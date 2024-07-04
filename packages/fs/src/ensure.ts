import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname } from 'node:path'
import { toUnixPath } from './common'
import { exists } from './exist'

/**
 * Ensure a file or dir is exist, if not create it.
 *
 * @param path File path, `string`.
 * @param priority Priority type to create `file` or `dir` while path basename start with `.`, `file | dir`.
 * @param fileContent Default content when file not exist, `string`.
 *
 * @example
 * ```
 * import { ensure } from '@ephemeras/fs'
 *
 * ensure(filePath)
 * ```
 */
export async function ensure(
  path: string,
  priority: 'file' | 'dir' = 'file',
  fileContent = ''
) {
  const ensurePath = toUnixPath(path)

  const pathType = extname(ensurePath) && priority === 'file' ? 'file' : 'dir'

  if (priority === pathType && !fileContent && (await exists(ensurePath))) {
    return ensurePath
  }

  if (pathType === 'file') {
    ensure(dirname(ensurePath), 'dir')
    await writeFile(ensurePath, fileContent, { encoding: 'utf-8' })
    return ensurePath
  }

  if (!(await exists(ensurePath))) {
    await mkdir(ensurePath, { recursive: true })
  }

  return ensurePath
}
