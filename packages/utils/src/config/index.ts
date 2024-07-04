import { bundleRequire } from 'bundle-require'
import { resolve } from 'node:path'
import { readJSON, exists } from '@ephemeras/fs'

export function defineConfig<T>(options: Partial<T>) {
  return options
}

export interface LoadConfigOptions {
  files?: string[]
  context?: string
}
export async function loadConfig(
  file: string,
  options: LoadConfigOptions = {}
) {
  const { files, context = process.cwd() } = options || {}
  const optionFile = resolve(context, file)
  let resolveFile = ''
  if (await exists(optionFile)) {
    resolveFile = optionFile
  } else if (files?.length) {
    let fileFound = ''
    for (const f of files) {
      const filePath = resolve(context, f)
      if (!(await exists(filePath))) continue
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
    resolveData = await readJSON(resolveFile)
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
