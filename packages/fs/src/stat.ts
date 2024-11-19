import { stat as statOrigin } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { BaseOptions } from './types'
import { unixPath } from './common'

export type StatOptions = Pick<BaseOptions, 'context'>
/**
 * Get path stat information.
 * {@link https://kythuen.github.io/ephemeras/fs/stat | View Details}
 *
 * @param path Path to check.
 * @param options See {@link StatOptions }.
 * @returns Stat info of path.
 *
 * @example
 * (await stat('foo/bar')).isFile()      //--> false
 */
export async function stat(path: string, options?: Partial<StatOptions>) {
  try {
    const { context = process.cwd() } = options || {}

    const resolvePath = unixPath(resolve(context, path))
    const result = await statOrigin(resolvePath)
    return result
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw Error(`stats: ${path} not exist.`)
    }
    throw err
  }
}
