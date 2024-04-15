import { minimatch } from 'minimatch'
import { Stats } from 'node:fs'
import { readdir, rmdir, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { PathLike, getStats, toRelativePath, toUnixPath } from './common'

export type RemoveOptionsExclude = (src: string, dest?: string) => boolean

export interface RemoveOptions {
  /**
   * Pattern matcher to include when remove the operation.
   * @default false
   */
  includes?: string[]
  /**
   * Pattern matcher to include when remove the operation.
   * @default false
   */
  excludes?: string[]
  /**
   * Filter by some condition when remove operation.
   * return `true` to continue remove operation and `false` to skip it.
   * priority less than `includes` & `excludes`.
   */
  filter?: (src: string, srcStats: Stats) => boolean
}

/**
 * Remove file or folder.
 * @param path PathLike url.
 *
 * @example
 * import { remove } from '@ephemeras/utils/fs'
 *
 * await remove(removePath, { filter: (url) => url.includes('xxx')})
 */
export async function remove(path: PathLike, options?: Partial<RemoveOptions>) {
  options = options || {}

  const targetPath = toUnixPath(path)

  const summary: Record<string, string[]> = {
    all: [],
    done: [],
    undo: []
  }

  await doRemove(targetPath, options, summary)

  return summary
}

async function doRemove(
  target: string,
  options: Partial<RemoveOptions>,
  summary: Record<string, string[]>,
  base?: string
) {
  base = base || dirname(target)
  const { includes, excludes, filter } = options || {}

  const targetStats = await getStats(target)

  const isLeaf =
    targetStats.isFile() ||
    (targetStats.isDirectory() && !(await readdir(target)).length)

  if (isLeaf) {
    const p = toRelativePath(target, base)
    summary.all.push(p)
  }

  if (
    includes?.length &&
    includes.every(p => !minimatch(target, p, { dot: true })) &&
    isLeaf
  ) {
    if (
      excludes?.length &&
      excludes.some(p => minimatch(target, p, { dot: true })) &&
      isLeaf
    ) {
      summary.undo.push(toRelativePath(target, base))
      return
    }
    summary.undo.push(toRelativePath(target, base))
    return
  }

  if (
    excludes?.length &&
    excludes.some(p => minimatch(target, p, { dot: true })) &&
    isLeaf
  ) {
    summary.undo.push(toRelativePath(target, base))
    return
  }

  if (filter && !filter?.(target, targetStats) && isLeaf) {
    summary.undo.push(toRelativePath(target, base))
    return
  }

  if (isLeaf) {
    summary.done.push(toRelativePath(target, base))
    if (targetStats.isDirectory()) {
      await rmdir(target)
      return
    }
    await unlink(target)
    return
  }

  const items = (await readdir(target, { withFileTypes: true })) || []
  for (const item of items) {
    const targetPath = join(target, item.name)
    await doRemove(targetPath, options, summary, base)
  }

  if (!(await readdir(target)).length) {
    await rmdir(target)
  }
}
