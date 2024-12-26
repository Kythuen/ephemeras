import { readFileSync } from 'node:fs'
import { FileParser, nunjucks } from '@ephemeras/parser'
import { join, resolve } from 'node:path'
import type { ConfigResolver } from '..'
import { PROJECT_ROOT } from '../../constant'
import type { PromptData } from '../../types'
import { createFileToPWD, removeItemFromPWD } from '../../utils'
import { readdir, removeDir } from '@ephemeras/fs'
import TEXT from '../../locales/text'

export function formatFinal(
  resolver: ConfigResolver,
  data: Partial<PromptData>
) {
  createVSCodeSetting(resolver)
  createVSCodeExtensions(resolver)
  createEslintConfig(resolver, data)
}

function createVSCodeSetting(resolver: ConfigResolver) {
  const { languages } = resolver.data

  const fileContent = `{
  "editor.formatOnSave": true,
${languages.map(i => `  "[${i}]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }`).join(',\n')}
}`
  resolver.tasks.add.push(() =>
    createFileToPWD('.vscode/settings.json', fileContent)
  )
  resolver.tasks.remove.push(() => removeItemFromPWD('.vscode/settings.json'))
}
function createVSCodeExtensions(resolver: ConfigResolver) {
  const { extensions } = resolver.data

  const fileContent = `{
  "recommendations": [
${extensions.map(i => `    "${i}"`).join(',\n')}
  ]
}`
  resolver.tasks.add.push(() =>
    createFileToPWD('.vscode/extensions.json', fileContent)
  )
  resolver.tasks.remove.push(() => removeItemFromPWD('.vscode/extensions.json'))
}
function createEslintConfig(
  resolver: ConfigResolver,
  data: Partial<PromptData> = {}
) {
  const {
    devDependencies = {},
    dependencies = {},
    type
  } = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), { encoding: 'utf8' })
  )

  const packages = {
    ...dependencies,
    ...devDependencies
  }
  const extend: any = {}
  if ('vitepress' in packages) {
    extend.vitepress = true
  }
  if ('@changesets/cli' in packages) {
    extend.changesets = true
  }

  const filename = type === 'module' ? 'eslint.config.js' : 'eslint.config.mjs'
  const parser = new FileParser({
    source: resolve(PROJECT_ROOT, 'files', 'eslint.config.js'),
    destination: resolve(process.cwd(), filename),
    overwrite: true
  })
  parser.use(nunjucks({ ...data, ...extend }))

  resolver.tasks.add.push(async () => {
    await parser.build()
    return `📃 ${TEXT.TEXT_CREATE} ${filename}`
  })

  resolver.tasks.remove.push(async () => {
    const vscodeDir = resolve(process.cwd(), '.vscode')
    if (!(await readdir(vscodeDir)).length) {
      await removeDir(vscodeDir)
    }
  })
  resolver.tasks.remove.push(() => removeItemFromPWD(filename))
}
