import glob from 'fast-glob'
import { resolve } from 'node:path'
import { readJSON } from '@ephemeras/fs'

export async function transformPageData() {
  const result: any = []
  // @ts-ignore
  const pkgs = glob.sync(['../packages/*/package.json'])
  for (const pkg of pkgs) {
    const file = pkg.match(/packages\/(.*)/)?.[1]
    if (file) {
      const filePath = resolve(__dirname, '../../../packages', file)
      const link = file.split('/')[0] || ''
      const { name = '', description = '' } = await readJSON(filePath)

      result.push({
        name,
        link,
        description
      })
    }
  }
  return { pkgs: result.filter(i => i.link !== 'core') }
}
