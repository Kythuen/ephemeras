import { readFile } from 'node:fs/promises'
import { PathLike } from './common'

export async function readJSON(filePath: PathLike) {
  let result = {}
  const content = await readFile(filePath, { encoding: 'utf-8' })
  try {
    result = JSON.parse(content)
  } catch (e: any) {
    console.error(e.message)
  }
  return result
}
