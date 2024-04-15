import { writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { format, Options } from 'prettier'
import { PathLike, toUnixPath, isExists } from './common'
import { ensureExists } from './ensure'

export interface CreateFileOptions {
  /**
   * Context directory of the create file operation.
   * @default process.cwd()
   */
  context: PathLike
  /**
   * Overwrite existing file.
   * @default false
   */
  overwrite: boolean
  /**
   * Use prettier to format code while create file.
   * @default true
   */
  prettier: boolean
  /**
   * Use prettier to format code while create file.
   * for detail: https://prettier.io/docs/en/options
   */
  prettierOptions?: Options
}

/**
 * Create file with content.
 * @param path PathLike url.
 * @param content File content, string.
 * @param options See CreateFileOptions declare.
 *
 * @example
 * import { createFile } from '@ephemeras/utils/fs'
 *
 * const data = {}
 * await createFile(filePath, JSON.stringify(data))
 */
export async function createFile(
  path: PathLike,
  content: string = '',
  options?: Partial<CreateFileOptions>
) {
  const {
    context = process.cwd(),
    overwrite = false,
    prettier = false,
    prettierOptions = { parser: 'babel' }
  } = options || {}

  const filePath = toUnixPath(path)
  if (filePath && !basename(filePath).includes('.')) {
    throw Error(`filePath: (${filePath}) must be a file`)
  }
  const contextPath = toUnixPath(context)
  const resolvePath = resolve(contextPath, filePath)

  if (!overwrite && (await isExists(resolvePath))) {
    return
  }

  await ensureExists(dirname(resolvePath))
  if (prettier) {
    const formatContent = await format(content, prettierOptions)
    await writeFile(resolvePath, formatContent, { encoding: 'utf-8' })
  } else {
    await writeFile(resolvePath, content, { encoding: 'utf-8' })
  }

  return resolvePath
}

/**
 * Create folder.
 * @param folderPath PathLike url.
 *
 * @example
 * import { createFolder } from '@ephemeras/utils/fs'
 *
 * await createFolder(filePath)
 */
export function createFolder(folderPath: PathLike) {
  return ensureExists(folderPath, 'folder')
}
