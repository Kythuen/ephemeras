import { extname } from 'node:path'
import { readFile } from 'node:fs/promises'

/**
 * Read a JSON file.
 * {@link https://kythuen.github.io/ephemeras/fs/readJSON | View Details}
 *
 * @param path JSON file path.
 * @returns JSON file data.
 *
 * @example
 * await readJSON('abc/ab.json')
 */
export async function readJSON(path: string) {
  let result: Record<string, any> = {}
  if (extname(path) !== '.json') return result
  try {
    const content = await readFile(path, { encoding: 'utf-8' })
    result = JSON.parse(content)
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e.message)
  }
  return result
}
