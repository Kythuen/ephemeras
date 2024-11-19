import { constants } from 'node:fs'
import { access } from 'node:fs/promises'

/**
 * Determine path exist or not.
 * {@link https://kythuen.github.io/ephemeras/fs/exist | View Details}
 *
 * @param path Path you want to determine.
 * @returns Path exist or not.
 *
 * @example
 * await exist('foo/bar')        //--> false
 */
export async function exist(path: string) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}
