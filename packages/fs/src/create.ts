import { writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { type Options, format } from 'prettier'
import { unixPath, relativePath } from './common'
import { ensureDir } from './ensure'
import { exist } from './exist'
import type { BaseOptions, SingleOperationResult } from './types'

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
  content: string | Buffer = '',
  options?: Partial<CreateFileOptions>
) {
  const { context = process.cwd(), overwrite, prettier } = options || {}

  const resolvePath = unixPath(resolve(context, path))

  if ((await exist(resolvePath)) && !overwrite) {
    return false
  }

  let fileContent: any = content
  if (prettier) {
    // TODO: parser match file type
    fileContent = await format(content.toString(), {
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

export interface CreateFromJSONFiles {
  [key: string]: CreateFromJSONFiles | string | null
}
export type CreateFromJSONOptions = {
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
} & BaseOptions
export type CreateFromJSONResult = SingleOperationResult
export async function createFromJSON(
  files: CreateFromJSONFiles,
  options?: Partial<CreateFromJSONOptions>
) {
  const result: CreateFromJSONResult = {
    all: [],
    done: [],
    skip: []
  }

  await doCreateFromJSON(files, options || {}, result)
  return result
}

async function doCreateFromJSON(
  files: CreateFromJSONFiles,
  options: Partial<CreateFromJSONOptions>,
  result: CreateFromJSONResult
) {
  const { context = process.cwd(), relativize } = options

  for (const path in files) {
    let resolvePath = unixPath(join(context, path))
    if (relativize) {
      resolvePath = unixPath(relativePath(resolvePath, context))
    }
    const item = files[path]
    if (!item) {
      result.all.push(resolvePath)
      const res = await createDir(path, options)
      if (res) {
        result.done.push(resolvePath)
      } else {
        result.skip.push(resolvePath)
      }
    } else if (typeof item === 'string') {
      result.all.push(resolvePath)
      const res = await createFile(path, item, options)
      if (res) {
        result.done.push(resolvePath)
      } else {
        result.skip.push(resolvePath)
      }
    } else if (Object.prototype.toString.call(item) === '[object Object]') {
      await doCreateFromJSON(
        item,
        {
          ...options,
          context: join(context, path)
        },
        result
      )
    }
  }
}
