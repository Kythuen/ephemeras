import { readdirSync } from 'node:fs'
import { toRelativePath } from './common'
import { join } from 'node:path'

export type GetLeafsOptions = {
  emptyDir: boolean
}

export function getLeafs(
  currentPath: string,
  originPath?: string,
  options?: Partial<GetLeafsOptions>
): string[] {
  const { emptyDir = true } = options || {}
  const targetPath = currentPath.replace(/\\/g, '/')

  originPath = originPath || targetPath

  const items = readdirSync(targetPath, { withFileTypes: true })

  if (!items.length) {
    if (emptyDir) {
      return [toRelativePath(targetPath, originPath)]
    }
    return []
  }
  const result = items.flatMap(item => {
    const filePath = join(targetPath, item.name).replace(/\\/g, '/')

    if (item.isDirectory()) {
      return [...getLeafs(filePath, originPath, options)]
    }
    return [toRelativePath(filePath, originPath)]
  })

  return result
}
