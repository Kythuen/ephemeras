import { minimatch } from 'minimatch'
import { constants, Stats } from 'node:fs'
import { copyFile, readdir, rmdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
  getStats,
  isExists,
  PathLike,
  toRelativePath,
  toUnixPath
} from './common'
import { ensureExists } from './ensure'

export interface CopyOptions {
  /**
   * Overwrite existing file or directory. priority less than `include` & `exclude`.
   * @default false
   */
  overwrite: boolean
  /**
   * Pattern matcher to include when copy the operation.
   */
  includes?: string[]
  /**
   * Pattern matcher to exclude when copy operation. priority less than `include`.
   */
  excludes?: string[]
  /**
   * Filter by some condition when copy operation.
   * return `true` to continue copy operation and `false` to skip it.
   * priority less than `include` & `exclude`.
   */
  filter?: (src: string, srcStats: Stats) => boolean
}

/**
 * Copy file with mode COPYFILE_FICLONE.
 * @param src PathLike url.
 * @param dest PathLike url.
 *
 * @example
 * import { copyFileForce } from '@ephemeras/utils/fs'
 *
 * await copyFileForce(srcPath, destPath)
 */
export async function copyFileForce(src: PathLike, dest: PathLike) {
  const dir = dirname(toUnixPath(dest))
  await ensureExists(dir, 'folder')
  await copyFile(src, dest, constants.COPYFILE_FICLONE)
}

/**
 * Copy file or folder.
 * @param src PathLike url.
 * @param dest PathLike url.
 * @param options See CopyOptions.
 *
 * @example
 * import { copy } from '@ephemeras/utils/fs'
 *
 * await copy(srcPath, destPath, { overwrite: true })
 */
export async function copy(
  src: PathLike,
  dest: PathLike,
  options?: Partial<CopyOptions>
) {
  options = options || {}

  const srcPath = toUnixPath(src)
  const destPath = toUnixPath(dest)

  const summary: Record<string, string[]> = {
    all: [],
    done: [],
    undo: [],
    modify: [],
    delete: []
  }

  await doCopy(srcPath, destPath, options, summary)

  return summary
}

async function doCopy(
  src: string,
  dest: string,
  options: Partial<CopyOptions>,
  summary: Record<string, string[]>,
  base?: string
) {
  base = base || dirname(src)
  const { overwrite = false, includes, excludes, filter } = options || {}

  const srcStats = await getStats(src)
  const destExist = await isExists(dest)

  const isLeaf =
    srcStats.isFile() ||
    (srcStats.isDirectory() && !(await readdir(src)).length)

  if (isLeaf) {
    const p = toRelativePath(src, base)
    summary.all.push(p)
  }

  if (
    includes?.length &&
    includes.every(p => !minimatch(src, p, { dot: true })) &&
    isLeaf
  ) {
    summary.undo.push(toRelativePath(src, base))
    return
  }

  if (
    excludes?.length &&
    excludes.some(p => minimatch(src, p, { dot: true })) &&
    isLeaf
  ) {
    summary.undo.push(toRelativePath(src, base))
    return
  }

  if (filter && !filter(src, srcStats) && isLeaf) {
    summary.undo.push(toRelativePath(src, base))
    return
  }

  if (isLeaf) {
    if (destExist && !overwrite) {
      summary.undo.push(toRelativePath(src, base))
      return
    }
    summary.done.push(toRelativePath(src, base))
    summary.modify.push(toRelativePath(dest, base))
    if (srcStats.isDirectory()) {
      await ensureExists(dest, 'folder')
      return
    }
    await copyFileForce(src, dest)
    return
  }

  await ensureExists(dest, 'folder')
  const items = (await readdir(src, { withFileTypes: true })) || []
  for (const item of items) {
    const itemSrc = toUnixPath(join(src, item.name))
    const itemDest = toUnixPath(join(dest, item.name))
    await doCopy(itemSrc, itemDest, options, summary, base)
  }

  if (!(await readdir(dest)).length) {
    await rmdir(dest)
  }
}
