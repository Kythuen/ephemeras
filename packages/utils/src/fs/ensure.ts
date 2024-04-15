import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname } from 'node:path'
import { PathLike, toUnixPath, isExists } from './common'

/**
 * Ensure a file or folder is exist, if not create it.
 * @param path PathLike url.
 * @param priority Confirm to create file or folder while path basename start with `.`, e.g. `.vscode`.
 * @param fileContent Default content when file not exist.
 *
 * @example
 * import { ensureExists } from '@ephemeras/utils/fs'
 *
 * ensureExists(filePath)
 */
export async function ensureExists(
  path: PathLike,
  priority: 'file' | 'folder' = 'file',
  fileContent = ''
) {
  const ensurePath = toUnixPath(path)

  const pathType =
    extname(ensurePath) && priority === 'file' ? 'file' : 'folder'

  if ((await isExists(ensurePath)) && priority === pathType && !fileContent) {
    return
  }

  if (pathType === 'file') {
    ensureExists(dirname(ensurePath), 'folder')
    await writeFile(ensurePath, fileContent, { encoding: 'utf-8' })
    return
  }

  if (!(await isExists(ensurePath))) {
    await mkdir(ensurePath, { recursive: true })
  }
}
