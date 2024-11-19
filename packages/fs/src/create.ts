import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { type Options, format } from 'prettier'
import { unixPath } from './common'
import { ensureDir } from './ensure'
import { exist } from './exist'
import type { BaseOptions } from './types'

export type CreateFileOptions = {
  /**
   * Overwrite existing file or not.
   */
  overwrite: boolean
  /**
   * Format file with prettier or not.
   *
   * Prefer to {@link https://prettier.io/docs/en/options | Prettier options}
   */
  prettier: Options
} & Pick<BaseOptions, 'context'>

/**
 * Create file with content.
 * {@link https://kythuen.github.io/ephemeras/fs/createFile | View Details}
 *
 * @param path File path.
 * @param content File content.
 * @param options See {@link CreateFileOptions }.
 * @returns Created file path.
 *
 * @example
 * await createFile('/foo/bar.json', JSON.stringify({}))
 */
export async function createFile(
  path: string,
  content = '',
  options?: Partial<CreateFileOptions>
) {
  const { context = process.cwd(), overwrite, prettier } = options || {}

  const resolvePath = unixPath(resolve(context, path))

  if ((await exist(resolvePath)) && !overwrite) {
    return false
  }

  let fileContent = content
  if (prettier) {
    fileContent = await format(content, {
      parser: 'babel-ts',
      ...prettier
    })
  }
  await ensureDir(dirname(resolvePath))
  await writeFile(resolvePath, fileContent, { encoding: 'utf-8' })

  return true
}

export type CreateDirOptions = Pick<BaseOptions, 'context'>
/**
 * Create directory.
 * {@link https://kythuen.github.io/ephemeras/fs/createDir | View Details}
 *
 * @param path Directory path.
 * @param options See {@link CreateFileOptions }.
 * @returns Created directory path.
 *
 * @example
 * await createDir('foo/bar')
 */
export async function createDir(
  path: string,
  options?: Partial<CreateDirOptions>
) {
  return ensureDir(path, options)
}
