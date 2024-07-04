import { Stats } from 'node:fs'
import { stat } from 'node:fs/promises'
import { to } from './common'

/**
 * Get the stats of a given path.
 *
 * @param path The path you need to check stats.
 * @returns A promise with the stats. [Stats]
 *
 * @example
 * import { stats } from '@ephemeras/fs'
 *
 * const patgStats = await getStats(pathUrl)
 * console.log(patgStats.isFile())
 */
export async function stats(path: string) {
  const [err, res] = await to<Stats>(stat(path))
  if (err) {
    if (err.code === 'ENOENT') {
      throw Error(`stats: (${path}) not exists.`)
    }
    throw err
  }
  return res
}
