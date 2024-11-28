import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { unixPath } from './common'
import { exist } from './exist'
import type { BaseOptions, OverwriteOptions } from './types'

export type EnsureDirOptions = Pick<BaseOptions, 'context'>
/**
 * Create directory if not existing.
 * {@link https://kythuen.github.io/ephemeras/fs/ensureDir | View Details}
 *
 * @param path Directory path.
 * @param options See {@link EnsureDirOptions }.
 * @returns Result of operation.
 *
 * @example
 * await ensureDir('foo/bar')
 */
export async function ensureDir(
  path: string,
  options?: Partial<EnsureDirOptions>
) {
  const { context = process.cwd() } = options || {}

  const resolvePath = unixPath(resolve(context, path))
  const isExist = await exist(resolvePath)

  if (isExist) return false
  await mkdir(resolvePath, { recursive: true })
  return true
}

export type EnsureFileOptions = Pick<BaseOptions, 'context'> & OverwriteOptions
/**
 * Create file if not existing.
 * {@link https://kythuen.github.io/ephemeras/fs/ensureFile | View Details}
 *
 * @param path File path.
 * @param content Default content when create not exist file.
 *
 * @example
 * await ensureFile('foo/bar.json', JSON.stringify({ a: 1 }))
 */
export async function ensureFile(
  path: string,
  content = '',
  options?: Partial<EnsureFileOptions>
) {
  const { context = process.cwd(), overwrite } = options || {}

  const resolvePath = unixPath(resolve(context, path))
  if (context !== process.cwd()) {
    ensureDir(context)
  }

  const isExist = await exist(resolvePath)
  if (isExist && !overwrite) return false

  await ensureDir(dirname(resolvePath))
  await writeFile(resolvePath, content, { encoding: 'utf-8' })
  return true
}
