import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { Options, format } from 'prettier'
import { toUnixPath } from './common'
import { ensure } from './ensure'
import { exists } from './exist'

export interface CreateFileOptions {
  /**
   * Context directory of the create file operation.
   * @default process.cwd()
   */
  context: string
  /**
   * Overwrite existing file.
   * @default false
   */
  overwrite: boolean
  /**
   * Use prettier to format code while create file.
   * for detail: https://prettier.io/docs/en/options
   * @default true
   */
  prettier: false | Options
}

/**
 * Create file with content.
 *
 * @usage https://kythuen.github.io/ephemeras/fs/createFile
 * @param path File path, `string`.
 * @param content File content, `string`.
 * @param options See CreateFileOptions declare, `CreateFileOptions`.
 * @returns File path, `Promise<string>.`
 *
 * @example
 * ```
 * import { createFile } from '@ephemeras/fs'
 *
 * const data = {}
 * await createFile(filePath, JSON.stringify(data))
 * ```
 */
export async function createFile(
  path: string,
  content: string = '',
  options?: Partial<CreateFileOptions>
) {
  const {
    context = process.cwd(),
    overwrite = false,
    prettier = false
  } = options || {}

  const filePath = toUnixPath(path)
  const contextPath = toUnixPath(context)
  const resolvePath = resolve(contextPath, filePath)

  if (!overwrite && (await exists(resolvePath))) {
    return resolvePath
  }

  await ensure(dirname(resolvePath))
  if (prettier) {
    const formatContent = await format(content, {
      parser: 'babel-ts',
      ...prettier
    })
    await writeFile(resolvePath, formatContent, { encoding: 'utf-8' })
  } else {
    await writeFile(resolvePath, content, { encoding: 'utf-8' })
  }

  return resolvePath
}

/**
 * Create directory.
 *
 * @param dirPath PathLike url.
 *
 * @example
 * import { createDir } from '@ephemeras/fs'
 *
 * await createDir(filePath)
 */
export function createDir(dirPath: string) {
  return ensure(dirPath, 'dir')
}
