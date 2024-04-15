import { Stats, constants } from 'node:fs'
import { normalize } from 'node:path'
import { access, stat } from 'node:fs/promises'
import { to } from '../promise'

export type PathLike = string | Buffer | URL

/**
 * Convert a PathLike url to unix path.
 * @param path PathLike url.
 * @returns convert result, string.
 *
 * @example
 * import { toUnixPath } from '@ephemeras/utils/fs'
 *
 * const unixPath = toUnixPath(path)
 */
export function toUnixPath(path: PathLike) {
  let result = null
  if (path instanceof URL) result = path.href
  if (Buffer?.isBuffer(path)) result = path.toString()
  if (typeof path === 'string') result = path

  if (result === null) {
    throw new Error(`Invalid path detected: (${path}).`)
  }
  return (result as string).replace(/\\/g, '/')
}

/**
 * Get the stats of a given path.
 *
 * @param path The path you need to check stats.
 * @returns A promise with the stats, Stats.
 *
 * @example
 * import { getStats } from '@ephemeras/utils/fs'
 *
 * const stats = await getStats(pathUrl)
 * console.log(stats.isFile())
 */
export async function getStats(path: PathLike) {
  const [err, res] = await to<Stats>(stat(path))
  if (err) {
    if (err.code === 'ENOENT') {
      throw Error(`getStats: (${path}) not exists.`)
    }
    throw err
  }
  return res as Stats
}

/**
 * Determine whether a path exists or not.
 *
 * @param path The path you want to determine.
 * @returns Path is exists, boolean.
 *
 * @example
 * import { isExists } from '@ephemeras/utils/fs'
 *
 * const exists = await isExists(pathUrl)
 * console.log(exists)
 */
export async function isExists(path: PathLike) {
  const [err] = await to(access(path, constants.F_OK))
  if (!err) return true
  if (err.code === 'ENOENT') {
    return false
  }
  throw err
}

/**
 * Get relative path from base path.
 * @param path source path
 * @param base base path
 *
 * @example
 * import { toRelativePath } from '@ephemeras/utils/fs'
 *
 * const relativePath = await toRelativePath('/abc/b/1.txt', '/abc')
 * console.log(relativePath)
 */
export function toRelativePath(path: string, base?: string) {
  return base ? path.substring(normalize(base).length + 1) : path
}

export function unify(path: string) {
  return toUnixPath(normalize(path))
}

// console.log(normalize('/a/b/c/./../../d/'))
// console.log(normalize('a/b/c/./../../d/'))
// console.log(normalize('/a/b/c/./../../d'))
// console.log(normalize('//a/b/c/./../../d'))
// console.log(normalize('../a/b/c/./../../d'))
