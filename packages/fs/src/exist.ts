import { constants } from 'node:fs'
import { access } from 'node:fs/promises'
import { to } from './common'

/**
 * Determine whether a path exists or not.
 *
 * @param path The path you want to determine, `string`.
 * @returns Path exists or not, `boolean`.
 *
 * @example
 * import { exists } from '@ephemeras/fs'
 *
 * const isExists = await exists(path)
 * console.log(exists)
 */
export async function exists(path: string) {
  const [err] = await to(access(path, constants.F_OK))
  if (!err) return true
  if (err.code === 'ENOENT') {
    return false
  }
  throw err
}
