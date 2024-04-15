import { minimatch } from 'minimatch'
import { readdir, rename, rmdir } from 'node:fs/promises'
import { basename, join } from 'node:path'
import {
  PathLike,
  getStats,
  isExists,
  toRelativePath,
  toUnixPath
} from './common'
import { CopyOptions, copy } from './copy'
import { ensureExists } from './ensure'
import { remove } from './remove'

export type MoveOptions = CopyOptions

export async function renameMove(
  src: PathLike,
  dest: PathLike,
  options?: Partial<MoveOptions>
) {
  const { overwrite = false, includes, excludes, filter } = options || {}

  const srcPath = toUnixPath(src)
  const destPath = toUnixPath(dest)

  const srcStats = await getStats(src)
  const destExist = await isExists(dest)

  const isLeaf =
    srcStats.isFile() ||
    (srcStats.isDirectory() && !(await readdir(srcPath)).length)

  if (
    includes?.length &&
    includes.every(p => !minimatch(srcPath, p, { dot: true })) &&
    isLeaf
  ) {
    return
  }

  if (
    excludes?.length &&
    excludes.some(p => minimatch(srcPath, p, { dot: true })) &&
    isLeaf
  ) {
    return
  }

  if (filter && !filter(srcPath, srcStats) && isLeaf) {
    return
  }

  if (isLeaf) {
    if (destExist && !overwrite) {
      return
    }
    await rename(srcPath, destPath)
    return
  }

  await ensureExists(destPath, 'folder')

  const items = (await readdir(srcPath, { withFileTypes: true })) || []
  for (const item of items) {
    const itemSrc = join(srcPath, item.name)
    const itemDest = join(destPath, item.name)
    await renameMove(itemSrc, itemDest, options)
  }

  if (!(await readdir(srcPath)).length) {
    await rmdir(srcPath)
  }

  if (!(await readdir(destPath)).length) {
    await rmdir(destPath)
  }
}

export async function generalMove(
  src: PathLike,
  dest: PathLike,
  options?: Partial<MoveOptions>
) {
  const { overwrite = false, includes, excludes, filter } = options || {}

  const srcPath = toUnixPath(src)
  const destPath = toUnixPath(dest)

  const { done } = await copy(srcPath, destPath, {
    overwrite,
    includes,
    excludes,
    filter
  })

  const doneRelative = done.map(i => i.substring(basename(srcPath).length + 1))

  await remove(srcPath, {
    filter: path => {
      const a = toRelativePath(path, srcPath)
      const b = doneRelative.includes(toUnixPath(a))
      return b
    }
  })

  if ((await isExists(srcPath)) && !(await readdir(srcPath)).length) {
    rmdir(srcPath)
  }
}

/**
 * Move file or folder.
 * @param src PathLike url.
 * @param dest PathLike url.
 * @param options See MoveOptions.
 *
 * @example
 * import { move } from '@ephemeras/utils/fs'
 *
 * await move(srcPath, destPath, { overwrite: true })
 */
export async function move(
  src: PathLike,
  dest: PathLike,
  options?: Partial<MoveOptions>
) {
  const srcPath = toUnixPath(src)
  const destPath = toUnixPath(dest)

  try {
    await renameMove(srcPath, destPath, options)
  } catch (err: any) {
    if (err?.code === 'EXDEV') {
      await generalMove(srcPath, destPath, options)
      return
    }
    throw err
  }
}
