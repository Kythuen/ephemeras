import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { copy, remove } from '@ephemeras/utils'

export interface TItem {
  name: string
  type: 'file' | 'directory'
}
export async function copyItemsToPWD(items: TItem[]) {
  const logs = []
  for (const item of items) {
    const itemPath = await copy(
      resolve(fileURLToPath(import.meta.url), '../../files', item.name),
      resolve(process.cwd(), item.name)
    )
    const text = `${item.type === 'directory' ? '📁' : '📃'} create ${itemPath}`
    logs.push(text)
  }
  return logs.join('\n')
}

export async function removeItemsFromPWD(items: TItem[]) {
  const logs = []
  for (const item of items) {
    const itemURL = join(process.cwd(), item.name)
    if (!existsSync(itemURL)) continue
    const itemPath = await remove(itemURL)
    const text = `${item.type === 'directory' ? '📁' : '📃'} delete ${itemPath}`
    logs.push(text)
  }
  return logs.join('\n')
}
