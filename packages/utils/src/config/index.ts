import { resolve } from 'node:path'
import fs from 'fs-extra'
import { bundleRequire } from 'bundle-require'
import { validateParams } from '../validate'
import { SchemaLoadConfigFile, SchemaLoadConfigOptions } from './schema'

export function defineConfig<T>(options: Partial<T>) {
  return options
}

export interface LoadConfigOptions {
  files?: string[]
  context?: string
}
export async function loadConfig(file: string, options: LoadConfigOptions = {}) {
  validateParams([
    {
      name: 'file',
      schema: SchemaLoadConfigFile,
      value: file
    },
    {
      name: 'options',
      schema: SchemaLoadConfigOptions,
      value: options
    }
  ])
  const { files, context = process.cwd() } = options || {}
  const optionFile = resolve(context, file)
  let resolveFile = ''
  if (fs.existsSync(optionFile)) {
    resolveFile = optionFile
  } else if (files?.length) {
    let fileFound = ''
    for (const f of files) {
      const filePath = resolve(context, f)
      if (!fs.existsSync(filePath)) continue
      fileFound = filePath
      break
    }
    if (!fileFound) {
      throw Error('no file available found: neither "file" nor "files"')
    }
    resolveFile = resolve(context, fileFound)
  } else {
    throw Error(`config file "${optionFile}" not found`)
  }

  let resolveData: any = {}
  if (resolveFile.endsWith('.json')) {
    resolveData = fs.readJSONSync(resolveFile)
  } else {
    const result = await bundleRequire({
      filepath: resolveFile
    })
    resolveData = result.mod.default || result.mod
  }

  return {
    file: resolveFile,
    data: resolveData
  }
}
