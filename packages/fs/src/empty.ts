import { minimatch } from 'minimatch'
import { readdir, rmdir, unlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { relativePath, unixPath } from './common'
import { stat } from './stat'
import type {
  BaseOptions,
  FilterOptions,
  SingleHookOptions,
  SingleOperationResult
} from './types'

export type EmptyDirOptions = BaseOptions & FilterOptions & SingleHookOptions
export type EmptyDirResult = SingleOperationResult
/**
 * Empty directory.
 * {@link https://kythuen.github.io/ephemeras/fs/emptyDir | View Details}
 *
 * @param path Directory path.
 * @param options See {@link EmptyDirOptions }.
 * @returns Result of operation, See {@link EmptyDirResult }.
 *
 * @example
 * const { all, done, skip } = await emptyDir('foo/bar')
 */
export async function emptyDir(
  path: string,
  options?: Partial<EmptyDirOptions>
) {
  const { context = process.cwd() } = options || {}
  const resolvePath = unixPath(resolve(context, path))

  const result: EmptyDirResult = {
    all: [],
    done: [],
    skip: []
  }

  await doEmpty(resolvePath, options || {}, result, resolvePath)
  return result
}

async function doEmpty(
  target: string,
  options: Partial<EmptyDirOptions>,
  result: EmptyDirResult,
  root: string
) {
  const { relativize, includes, excludes, filter, beforeEach, afterEach } =
    options

  const targetStat = await stat(target)
  // if (!targetStat) return

  const isLeaf =
    targetStat.isFile() ||
    (targetStat.isDirectory() && !(await readdir(target)).length)

  if (isLeaf) {
    let targetItem = unixPath(target)
    if (relativize) {
      targetItem = unixPath(relativePath(target, root))
    }

    result.all.push(targetItem)

    if (
      includes?.length &&
      includes.every(p => !minimatch(target, p, { dot: true }))
    ) {
      result.skip.push(targetItem)
      return
    }

    if (
      excludes?.length &&
      excludes.some(p => minimatch(target, p, { dot: true }))
    ) {
      result.skip.push(targetItem)
      return
    }

    if (filter && !filter(target, targetStat)) {
      result.skip.push(targetItem)
      return
    }

    result.done.push(targetItem)

    if (beforeEach) {
      await beforeEach(targetItem, targetStat)
    }
    if (targetStat.isDirectory()) {
      await rmdir(target)
    } else {
      await unlink(target)
    }
    if (afterEach) {
      await afterEach(targetItem, targetStat)
    }
    return
  }

  const items = await readdir(target, { withFileTypes: true })
  for (const item of items) {
    const targetPath = join(target, item.name)
    await doEmpty(targetPath, options, result, root)
  }
  if (target !== root && !(await readdir(target)).length) {
    await rmdir(target)
  }
}
