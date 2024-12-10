import { fileTypeFromBuffer } from 'file-type'
import type { Stats } from 'node:fs'
import { open } from 'node:fs/promises'
import { resolveConfig, resolveConfigFile, type Options } from 'prettier'

export async function isTextFile(filePath: string, stat: Stats) {
  const length = Math.min(stat.size, 4096)
  const fd = await open(filePath, 'r')
  const buffer: any = Buffer.alloc(length)
  await fd.read(buffer, 0, length, null)
  await fd.close()

  if (await fileTypeFromBuffer(buffer)) return false
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0 || buffer[i] > 127) {
      return false
    }
  }
  return true
}

export async function getPrettierConfig() {
  let prettierConfig: Options = {}
  const configFile = await resolveConfigFile()
  if (configFile) {
    prettierConfig = (await resolveConfig(configFile)) || {}
  }

  return prettierConfig
}
