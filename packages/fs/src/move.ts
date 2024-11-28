import { minimatch } from 'minimatch'
import { readdir, rename, rmdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { relativePath, unixPath } from './common'
import { copyDir, copyFile } from './copy'
import { ensureDir } from './ensure'
import { exist } from './exist'
import { removeDir, removeFile } from './remove'
import { stat } from './stat'
import type {
  BaseOptions,
  CrossHookOptions,
  CrossOperationResult,
  FilterOptions,
  OverwriteOptions
} from './types'

export type MoveStrategy = 'general' | 'rename' | undefined

export type MoveFileOptions = Pick<BaseOptions, 'context'> &
  OverwriteOptions & {
    strategy: MoveStrategy
    /**
     * Hook before move file, main to test unknown error.
     */
    before: (src: string, dest: string) => void
  }
/**
 * Move file.
 * {@link https://kythuen.github.io/ephemeras/fs/moveFile | View Details}
 *
 * @param src Source file path.
 * @param dest Destination file path.
 * @param options See {@link MoveFileOptions }.
 * @returns Result of operation.
 *
 * @example
 * await moveFile('foo/bar.txt')
 */
export async function moveFile(
  src: string,
  dest: string,
  options?: Partial<MoveFileOptions>
) {
  const { context = process.cwd(), overwrite, strategy, before } = options || {}

  const srcPath = unixPath(resolve(context, src))
  const destPath = unixPath(resolve(context, dest))

  const isExist = await exist(destPath)
  if (isExist && !overwrite) return false

  try {
    if (strategy === 'general') {
      const err: any = new Error('prefer to use general strategy')
      err.code = 'EXDEV'
      throw err
    }
    before?.(srcPath, destPath)
    await rename(srcPath, destPath)
    return true
  } catch (err: any) {
    if (err?.code === 'EXDEV') {
      await copyFile(srcPath, destPath, options)
      await removeFile(srcPath, options)
      return true
    }
    throw err
  }
}

export type MoveDirOptions = BaseOptions &
  FilterOptions &
  CrossHookOptions &
  OverwriteOptions & { strategy: MoveStrategy }
export type MoveDirResult = CrossOperationResult & { all: string[] }
/**
 * Move directory.
 * {@link https://kythuen.github.io/ephemeras/fs/moveDir | View Details}
 *
 * @param src Source directory path.
 * @param dest Destination directory path.
 * @param options See {@link MoveDirResult }.
 * @returns Result of operation, see {@link MoveDirResult }.
 *
 * @example
 * const { all, src, dest, add, update, skip } = await moveDir('foo/bar', 'foo/baz')
 */
export async function moveDir(
  src: string,
  dest: string,
  options: Partial<MoveDirOptions> = {}
) {
  const { context = process.cwd(), strategy } = options
  const srcPath = unixPath(resolve(context, src))
  const destPath = unixPath(resolve(context, dest))

  const result: MoveDirResult = {
    all: [],
    src: [],
    dest: [],
    add: [],
    update: [],
    skip: []
  }

  try {
    if (strategy === 'general') {
      const err: any = new Error('prefer to use general strategy')
      err.code = 'EXDEV'
      throw err
    }
    await renameMove(srcPath, destPath, options, result, srcPath, destPath)
    return result
  } catch (err: any) {
    if (err?.code === 'EXDEV') {
      return generalMove(srcPath, destPath, options, result)
    }
    throw err
  }
}
async function renameMove(
  src: string,
  dest: string,
  options: Partial<MoveDirOptions>,
  result: MoveDirResult,
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

    result.all.push(srcItem)
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
      const index = result.src.findIndex(i => i === destItem)
      result.src.splice(index, 1)
    } else {
      result.dest.push(destItem)
      result.add.push(destItem)
      const index = result.src.findIndex(i => i === destItem)
      result.src.splice(index, 1)
    }
    if (beforeEach) {
      await beforeEach(srcItem, destItem)
    }
    await rename(src, dest)
    if (afterEach) {
      await afterEach(srcItem, destItem)
    }
    return
  }

  await ensureDir(dest)
  const items = await readdir(src, { withFileTypes: true })
  for (const item of items) {
    const itemSrc = join(src, item.name)
    const itemDest = join(dest, item.name)
    await renameMove(itemSrc, itemDest, options, result, srcRoot, destRoot)
  }
  if (!(await readdir(src)).length) {
    await rmdir(src)
  }

  if (!(await readdir(dest)).length) {
    await rmdir(dest)
  }
}
async function generalMove(
  src: string,
  dest: string,
  options: Partial<MoveDirOptions>,
  result: MoveDirResult
) {
  const copyResult = await copyDir(src, dest, options)

  // eslint-disable-next-line no-param-reassign
  result = { ...copyResult, all: copyResult.src }
  const doneRelative = [...result.add, ...result.update].map(i =>
    relativePath(i, dest)
  )

  const { relativize } = options
  const removeResult = await removeDir(src, {
    relativize,
    filter: path => {
      const a = relativePath(path, src)
      const b = doneRelative.includes(a)
      return b
    }
  })

  // eslint-disable-next-line no-param-reassign
  result.src = result.all.filter(
    i =>
      !result.add.includes(i) &&
      !result.update.includes(i) &&
      !removeResult.done.includes(i)
  )

  return result
}
