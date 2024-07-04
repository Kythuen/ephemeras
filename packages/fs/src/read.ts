import { extname } from 'node:path'
import { readFile } from 'node:fs/promises'

export async function readJSON(filePath: string) {
  let result = {}
  if (extname(filePath) !== '.json') return result
  const content = await readFile(filePath, { encoding: 'utf-8' })
  try {
    result = JSON.parse(content)
  } catch (e: any) {
    console.error(e.message)
  }
  return result
}
