import { constants, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'
import {
  access,
  mkdir,
  rmdir,
  unlink,
  writeFile,
  readdir,
  stat,
  readFile
} from 'node:fs/promises'

export async function exists(path: string) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return false
    }
    throw e
  }
}

export async function getStats(path: string) {
  try {
    const res = await stat(path)
    return res
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw Error(`getStats: (${path}) not exists.`)
    }
    throw e
  }
}

export async function createFile(path: string, content: string = '') {
  await writeFile(path, content, { encoding: 'utf-8' })
}

export async function removeFile(path: string) {
  await unlink(path)
}

export async function createDir(path: string) {
  await mkdir(path, { recursive: true })
}

export async function removeDir(path: string) {
  const stats = await stat(path)
  if (stats.isDirectory()) {
    const items = (await readdir(path, { withFileTypes: true })) || []
    for (const item of items) {
      const childPath = join(path, item.name)
      await removeDir(childPath)
    }
    await rmdir(path)
    return
  }
  await unlink(path)
}

export async function emptyDir(path: string) {
  const items = await readdir(path, { withFileTypes: true })
  for (const item of items) {
    const subPath = join(path, item.name)
    if (item.isDirectory()) {
      await removeDir(subPath)
      return
    }
    await unlink(subPath)
  }
}

export async function ensureDir(path: string) {
  if (!(await exists(path))) {
    await createDir(path)
  }
}

export async function ensureFile(path: string) {
  if (!(await exists(path))) {
    await createFile(path, '')
  }
}

export function toRelativePath(path: string, base?: string) {
  return base ? path.substring(base.length + 1) : path
}
export function toUnixPath(path: string) {
  return path.replace(/\\/g, '/')
}

export function getLeafItems(
  currentPath: string,
  originPath?: string
): string[] {
  const targetPath = currentPath.replace(/\\/g, '/')

  originPath = originPath || targetPath

  const items = readdirSync(targetPath, { withFileTypes: true })

  if (!items.length) {
    return [toRelativePath(targetPath, originPath)]
  }
  const result = items.flatMap(item => {
    const filePath = join(targetPath, item.name).replace(/\\/g, '/')

    if (item.isDirectory()) {
      return [...getLeafItems(filePath, originPath)]
    }
    return [toRelativePath(filePath, originPath)]
  })

  return result
}

export async function compareFolderInfo(src: string, dest: string) {
  const srcList: string[] = getLeafItems(src)
  const destList: string[] = getLeafItems(dest)

  const srcListSet = new Set(srcList)
  const destListSet = new Set(destList)

  const add: string[] = []
  const sub: string[] = []

  for (const item of destListSet) {
    if (!srcListSet.has(item)) {
      add.push(item)
    }
  }

  for (const item of srcListSet) {
    if (!destListSet.has(item)) {
      sub.push(item)
    }
  }

  return {
    isDiff: add.length > 0 || sub.length > 0,
    add,
    sub,
    src: srcList,
    dest: destList
  }
}

export async function readFileContent(path: string) {
  return readFile(path, { encoding: 'utf-8' })
}

export function noFolderName(path: string, folderPath: string) {
  return path.substring(basename(folderPath).length + 1)
}
export function addFolderName(path: string, folderPath: string) {
  return toUnixPath(join(basename(folderPath), path))
}
