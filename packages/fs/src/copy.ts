import { minimatch } from 'minimatch'
import { constants } from 'node:fs'
import { copyFile as copyFileOrigin, readdir, rmdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { relativePath, unixPath } from './common'
import { ensureDir } from './ensure'
import { exist } from './exist'
import { stat } from './stat'
import type {
  BaseOptions,
  CrossHookOptions,
  CrossOperationResult,
  OverwriteOptions,
  FilterOptions
} from './types'

export type CopyFileOptions = {
  /**
   * Overwrite existing file or not.
   */
  overwrite: boolean
} & Pick<BaseOptions, 'context'>
/**
 * Copy file.
 * {@link https://kythuen.github.io/ephemeras/fs/copyFile | View Details}
 *
 * @param src Source file path.
 * @param dest Destination file path.
 * @param options See {@link CopyFileOptions }.
 * @returns Result of operation.
 *
 * @example
 * await copyFile('/foo/bar.json', '/foo/baz.json')
 */
export async function copyFile(
  src: string,
  dest: string,
  options?: Partial<CopyFileOptions>
) {
  const { overwrite, context = process.cwd() } = options || {}

  const resolveSrc = unixPath(resolve(context, src))
  const resolveDest = unixPath(resolve(context, dest))

  try {
    await copyFileOrigin(
      resolveSrc,
      resolveDest,
      overwrite ? constants.COPYFILE_FICLONE : constants.COPYFILE_EXCL
    )
    return true
  } catch (err: any) {
    console.log(err.message)
    return false
  }
}

export type CopyDirOptions = BaseOptions &
  FilterOptions &
  CrossHookOptions &
  OverwriteOptions
export type CopyDirResult = CrossOperationResult
/**
 * Copy directory.
 * {@link https://kythuen.github.io/ephemeras/fs/copyDir | View Details}
 *
 * @param src Source directory path.
 * @param dest Destination directory path.
 * @param options See {@link CopyDirOptions }.
 * @returns Result of operation, See {@link CopyDirResult }.
 *
 * @example
 * const { src, dest, add, update, skip } = await copyDir('/foo/bar', '/foo/baz')
 */
export async function copyDir(
  src: string,
  dest: string,
  options?: Partial<CopyDirOptions>
) {
  const { context = process.cwd() } = options || {}
  const srcPath = unixPath(resolve(context, src))
  const destPath = unixPath(resolve(context, dest))

  const result: CopyDirResult = {
    src: [],
    dest: [],
    add: [],
    update: [],
    skip: []
  }

  await doCopy(srcPath, destPath, options || {}, result, srcPath, destPath)

  return result
}

async function doCopy(
  src: string,
  dest: string,
  options: Partial<CopyDirOptions>,
  result: CopyDirResult,
  srcRoot: string,
  destRoot: string
) {
  const {
    overwrite,
    includes,
    excludes,
    relativize,
    filter,
    beforeEach,
    afterEach
  } = options

  const srcStats = await stat(src)
  // if (!srcStats) return

  const isLeaf =
    srcStats.isFile() ||
    (srcStats.isDirectory() && !(await readdir(src)).length)

  if (isLeaf) {
    const destExist = await exist(dest)

    let srcItem = unixPath(src)
    let destItem = unixPath(dest)
    if (relativize) {
      srcItem = unixPath(relativePath(src, srcRoot))
      destItem = unixPath(relativePath(dest, destRoot))
    }

    result.src.push(srcItem)

    if (
      includes?.length &&
      includes.every(p => !minimatch(src, p, { dot: true }))
    ) {
      result.skip.push(srcItem)
      return
    }

    if (
      excludes?.length &&
      excludes.some(p => minimatch(src, p, { dot: true }))
    ) {
      result.skip.push(srcItem)
      return
    }

    if (filter && !filter(src, srcStats)) {
      result.skip.push(srcItem)
      return
    }

    if (destExist) {
      result.dest.push(destItem)
      if (!overwrite) {
        result.skip.push(srcItem)
        return
      }
      result.update.push(destItem)
    } else {
      result.dest.push(destItem)
      result.add.push(destItem)
    }
    if (srcStats.isDirectory()) {
      if (beforeEach) {
        await beforeEach(srcItem, destItem)
      }
      await ensureDir(dest)
      if (afterEach) {
        await afterEach(srcItem, destItem)
      }
      return
    }

    await copyFileForce(src, dest, srcItem, destItem, beforeEach, afterEach)
    return
  }

  await ensureDir(dest)
  const items = await readdir(src, { withFileTypes: true })
  for (const item of items) {
    const itemSrc = unixPath(join(src, item.name))
    const itemDest = unixPath(join(dest, item.name))
    await doCopy(itemSrc, itemDest, options, result, srcRoot, destRoot)
  }

  if (!(await readdir(dest)).length) {
    await rmdir(dest)
  }
}

async function copyFileForce(
  src: string,
  dest: string,
  resolveSrc: string,
  resolveDest: string,
  beforeEach?: (src: string, dest: string) => Promise<void>,
  afterEach?: (src: string, dest: string) => Promise<void>
) {
  const dir = dirname(unixPath(dest))
  await ensureDir(dir)
  if (beforeEach) {
    await beforeEach(resolveSrc, resolveDest)
  }
  await copyFileOrigin(src, dest, constants.COPYFILE_FICLONE)
  if (afterEach) {
    await afterEach(resolveSrc, resolveDest)
  }
}
