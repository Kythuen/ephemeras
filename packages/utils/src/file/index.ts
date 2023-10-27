import { basename, resolve } from 'node:path'
import execa from 'execa'
import {
  existsSync,
  ensureFileSync,
  ensureDirSync,
  writeFileSync,
  copySync,
  removeSync,
  CopyOptionsSync
} from 'fs-extra'
import { validateParam } from '../validate'
import { SchemaCreateFile, SchemaCopyFile, SchemaRemoveFile } from './schema'

export type TCreateFileOptions = {
  context?: string
  path: string
  data: any
}
export type TCopyOptions = {
  source: string
  dest: string
  options?: CopyOptionsSync
}

export async function createFile(options: TCreateFileOptions) {
  validateParam('options', options, SchemaCreateFile)
  const { context, path, data } = options
  const baseDir = context || process.cwd()

  if (context && !existsSync(context)) {
    throw Error(`base directory: "${context}" is not exists`)
  }
  if (path && !basename(path).includes('.')) {
    throw Error(`path: "${path}" must be a file`)
  }

  const url: string = resolve(baseDir, path)
  ensureFileSync(url)
  writeFileSync(url, JSON.stringify(data))
  await execa('prettier', ['--write', url])
  return url
}

export function copyFile(copyOptions: TCopyOptions) {
  validateParam('options', copyOptions, SchemaCopyFile)
  const { source, dest, options } = copyOptions
  copySync(source, dest, options)
  return dest
}

export function removeFile(file: string) {
  validateParam('file', file, SchemaRemoveFile)
  removeSync(file)
  return file
}

export function copyDirectory(copyOptions: TCopyOptions) {
  validateParam('options', copyOptions, SchemaCopyFile)
  const { source, dest, options } = copyOptions
  ensureDirSync(dest)
  copySync(source, dest, options)
  return dest
}

export function removeDirectory(directory: string) {
  validateParam('directory', directory, SchemaRemoveFile)
  removeSync(directory)
  return directory
}
