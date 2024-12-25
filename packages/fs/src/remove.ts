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

export type RemoveFileOptions = Pick<BaseOptions, 'context'>
/**
 * Remove file.
 * {@link https://kythuen.github.io/ephemeras/fs/removeFile | View Details}
 *
 * @param path File path to remove.
 * @param options See {@link RemoveFileOptions }.
 * @returns Result of operation.
 *
 * @example
 * await removeFile('/foo/bar.json')
 */
export async function removeFile(
  path: string,
  options?: Partial<RemoveFileOptions>
) {
  const { context = process.cwd() } = options || {}
  const resolvePath = unixPath(resolve(context, path))

  try {
    await unlink(resolvePath)
    return true
  } catch (err: any) {
    console.log(err.message)
    return false
  }
}

export type RemoveDirOptions = BaseOptions & FilterOptions & SingleHookOptions
export type RemoveDirResult = SingleOperationResult
/**
 * Remove directory.
 * {@link https://kythuen.github.io/ephemeras/fs/removeDir | View Details}
 *
 * @param path Directory path to remove.
 * @param options See {@link RemoveDirOptions }.
 * @returns Result of operation, see {@link RemoveDirResult }.
 *
 * @example
 * const { all, done, skip } = await removeFile('/foo/bar')
 */
export async function removeDir(
  path: string,
  options?: Partial<RemoveDirOptions>
) {
  const { context = process.cwd() } = options || {}
  const resolvePath = unixPath(resolve(context, path))

  const result: RemoveDirResult = {
    all: [],
    done: [],
    skip: []
  }

  await doRemove(resolvePath, options || {}, result, resolvePath)
  return result
}

async function doRemove(
  target: string,
  options: Partial<RemoveDirOptions>,
  result: RemoveDirResult,
  base: string
) {
  const { includes, excludes, relativize, filter, beforeEach, afterEach } =
    options

  const targetStat = await stat(target)
  // if (!targetStat) return

  const isLeaf =
    targetStat.isFile() ||
    (targetStat.isDirectory() && !(await readdir(target)).length)

  if (isLeaf) {
    let targetItem = unixPath(target)
    if (relativize) {
      targetItem = unixPath(relativePath(target, base))
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
    await doRemove(targetPath, options, result, base)
  }

  if (!(await readdir(target)).length) {
    await rmdir(target)
  }
}
