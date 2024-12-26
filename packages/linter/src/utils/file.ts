import { resolve, join } from 'node:path'
import {
  exist,
  copyDir,
  copyFile,
  removeDir,
  removeFile,
  createFile
} from '@ephemeras/fs'
import { PROJECT_ROOT } from '../constant'
import TEXT from '../locales/text'

export interface TItem {
  path: string
  type?: 'file' | 'directory'
}
export async function copyItemsToPWD(items: TItem[]) {
  // await sleep(50)
  const logs = []
  for (const item of items) {
    const srcPath = join(PROJECT_ROOT, 'files', item.path)
    const destPath = resolve(process.cwd(), item.path)
    if (item.type === 'directory') {
      await copyDir(srcPath, destPath, { overwrite: true })
    } else {
      await copyFile(srcPath, destPath, { overwrite: true })
    }
    const text = `${item.type === 'directory' ? '📁' : '📃'} ${TEXT.TEXT_CREATE} ${item.path}`
    logs.push(text)
  }
  return logs.join('\n')
}

export async function removeItemsFromPWD(items: TItem[]) {
  const logs = []
  for (const item of items) {
    const itemPath = join(process.cwd(), item.path)
    if (!(await exist(itemPath))) continue
    if (item.type === 'directory') {
      await removeDir(itemPath)
    } else {
      await removeFile(itemPath)
    }
    const text = `${item.type === 'directory' ? '📁' : '📃'} ${TEXT.TEXT_REMOVE} ${itemPath}`
    logs.push(text)
  }
  return logs.join('\n')
}

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

export async function createFileToPWD(path: string, content: string) {
  // await sleep(50)
  const itemPath = join(process.cwd(), path)
  await createFile(itemPath, content, { overwrite: true })
  return `📃 ${TEXT.TEXT_CREATE} ${path}`
}

export async function copyItemToPWD(
  path: string,
  type: 'file' | 'directory' = 'file'
) {
  // await sleep(50)
  const srcPath = resolve(PROJECT_ROOT, 'files', path)
  const destPath = resolve(process.cwd(), path)
  if (type === 'directory') {
    await copyDir(srcPath, destPath, { overwrite: true })
  } else {
    await copyFile(srcPath, destPath, { overwrite: true })
  }
  return `${type === 'directory' ? '📁' : '📃'} ${TEXT.TEXT_CREATE} ${path}`
}

export async function removeItemFromPWD(
  path: string,
  type: 'file' | 'directory' = 'file'
) {
  // await sleep(50)
  const itemPath = join(process.cwd(), path)
  const log = `${type === 'directory' ? '📁' : '📃'} ${TEXT.TEXT_REMOVE} ${path}`
  if (!(await exist(itemPath))) return ''
  if (type === 'directory') {
    const res = await removeDir(itemPath)
    if (res) return log
  } else {
    const res = await removeFile(itemPath)
    if (res) return log
  }
}
