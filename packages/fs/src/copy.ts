import { minimatch } from 'minimatch'
import { constants, Stats } from 'node:fs'
import { copyFile, readdir, rmdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { toRelativePath, toUnixPath } from './common'
import { ensure } from './ensure'
import { exists } from './exist'
import { stats } from './stat'

export type CopyOptions = {
  /**
   * Context directory.
   * @default process.cwd
   */
  context: string
  /**
   * Pattern matcher to include when copy the operation.
   */
  includes?: string[]
  /**
   * Pattern matcher to exclude when copy operation. priority less than `include`.
   */
  excludes?: string[]
  /**
   * Overwrite existing file or directory. priority less than `include` & `exclude`.
   * @default false
   */
  overwrite: boolean
  /**
   * Filter by some condition when copy operation.
   * return `true` to continue copy operation and `false` to skip it.
   * priority less than `include` & `exclude`.
   */
  filter?: (src: string, srcStats: Stats) => boolean
  /**
   * Hook before file or directory copy.
   */
  beforeEach?: (src: string, dest: string) => any
  /**
   * Hook after file or directory copy.
   */
  afterEach?: (src: string, dest: string) => any
}
export type CopyResult = {
  src: string[]
  dest: string[]
  add: string[]
  update: string[]
  skip: string[]
}

/**
 * Copy file with mode COPYFILE_FICLONE.
 * @param src PathLike url.
 * @param dest PathLike url.
 *
 * @example
 * import { copyFileForce } from '@ephemeras/fs'
 *
 * await copyFileForce(srcPath, destPath)
 */
export async function copyFileForce(
  src: string,
  dest: string,
  beforeEach?: (src: string, dest: string) => Promise<void>,
  afterEach?: (src: string, dest: string) => Promise<void>
) {
  const dir = dirname(toUnixPath(dest))
  await ensure(dir, 'dir')
  if (beforeEach) {
    await beforeEach(src, dest)
  }
  await copyFile(src, dest, constants.COPYFILE_FICLONE)
  if (afterEach) {
    await afterEach(src, dest)
  }
}

/**
 * Copy file or dir.
 *
 * @param src PathLike url.
 * @param dest PathLike url.
 * @param options See CopyOptions.
 *
 * @example
 * import { copy } from '@ephemeras/fs'
 *
 * await copy(srcPath, destPath, { overwrite: true })
 */
export async function copy(
  src: string,
  dest: string,
  options?: Partial<CopyOptions>
) {
  options = options || {}

  let srcPath = toUnixPath(src)
  let destPath = toUnixPath(dest)
  const context = options.context
  if (context) {
    srcPath = join(context, toUnixPath(src))
    destPath = join(context, toUnixPath(dest))
  } else {
    options.context = dirname(srcPath)
  }

  const summary: CopyResult = {
    src: [],
    dest: [],
    add: [],
    update: [],
    skip: []
  }

  await doCopy(srcPath, destPath, options, summary)

  return summary
}

async function doCopy(
  src: string,
  dest: string,
  options: Partial<CopyOptions>,
  summary: CopyResult
) {
  const { overwrite = false, includes, excludes, filter } = options || {}

  const srcStats = await stats(src)
  if (!srcStats) return

  const isLeaf =
    srcStats.isFile() ||
    (srcStats.isDirectory() && !(await readdir(src)).length)

  if (isLeaf) {
    const destExist = await exists(dest)
    const srcItem = toRelativePath(src, options.context)
    const destItem = toRelativePath(dest, options.context)

    summary.src.push(srcItem)

    if (
      includes?.length &&
      includes.every(p => !minimatch(src, p, { dot: true }))
    ) {
      summary.skip.push(srcItem)
      return
    }

    if (
      excludes?.length &&
      excludes.some(p => minimatch(src, p, { dot: true }))
    ) {
      summary.skip.push(srcItem)
      return
    }

    if (filter && !filter(src, srcStats)) {
      summary.skip.push(srcItem)
      return
    }

    if (destExist) {
      summary.dest.push(destItem)
      if (!overwrite) {
        summary.skip.push(srcItem)
        return
      }
      summary.update.push(destItem)
    } else {
      summary.dest.push(destItem)
      summary.add.push(destItem)
    }
    if (srcStats.isDirectory()) {
      await ensure(dest, 'dir')
      return
    }

    await copyFileForce(src, dest, options.beforeEach, options.afterEach)
    return
  }

  await ensure(dest, 'dir')
  const items = (await readdir(src, { withFileTypes: true })) || []
  for (const item of items) {
    const itemSrc = toUnixPath(join(src, item.name))
    const itemDest = toUnixPath(join(dest, item.name))
    await doCopy(itemSrc, itemDest, options, summary)
  }

  if (!(await readdir(dest)).length) {
    await rmdir(dest)
  }
}
