import type { Stats } from 'node:fs'
import { open } from 'node:fs/promises'
import { resolveConfig, resolveConfigFile, type Options } from 'prettier'

function isPrintable(charCode: number) {
  return (
    (charCode >= 32 && charCode <= 126) ||
    charCode === 9 ||
    charCode === 10 ||
    charCode === 13
  )
}
export async function isTextFile(filePath: string, stat: Stats) {
  const length = Math.min(stat.size, 512)
  const fd = await open(filePath, 'r')
  const buffer: any = Buffer.alloc(length)
  await fd.read(buffer, 0, length, null)
  await fd.close()

  let nonPrintableCount = 0
  for (let i = 0; i < buffer.length; i++) {
    if (!isPrintable(buffer[i])) {
      nonPrintableCount++
    }
  }
  const printableRatio = 1 - nonPrintableCount / buffer.length

  return printableRatio > 0.9
}

export async function getPrettierConfig() {
  let prettierConfig: Options = {}
  const configFile = await resolveConfigFile()
  if (configFile) {
    prettierConfig = (await resolveConfig(configFile)) || {}
  }

  return prettierConfig
}
