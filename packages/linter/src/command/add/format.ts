import { createFile } from '@ephemeras/fs'
import {
  formatBase,
  formatTypeScript,
  formatVue,
  formatReact
} from '../../resolvers'
import { ConfigResolver, TItem, copyItemsToPWD } from '../../utils'

export default async function (resolver: ConfigResolver, answerData: any) {
  resolver.use(formatBase, answerData)
  if (answerData.framework === 'vue') {
    resolver.use(formatVue)
  } else if (answerData.framework === 'react') {
    resolver.use(formatReact)
  }

  if (answerData.typescript) {
    resolver.use(formatTypeScript)
  }

  if (answerData.framework === 'vue') {
    resolver.data.eslintOverrides.extends =
      resolver.data.eslintOverrides.extends.concat([
        'eslint:recommended',
        'plugin:prettier/recommended'
      ])
    resolver.data.eslintOverrides.parser = 'vue-eslint-parser'
  } else if (answerData.framework === 'react') {
    resolver.data.eslintOverrides.extends =
      resolver.data.eslintOverrides.extends.concat([
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
      ])
  }

  const resolverConfigData = resolver.data

  const eslintrc = await createFile(
    '.eslintrc',
    JSON.stringify(resolverConfigData.eslintOverrides),
    { prettier: { parser: 'json' } }
  )

  const eslintLog = `📃 create ${eslintrc}`
  const files: TItem[] = [
    { name: '.editorconfig', type: 'file' },
    { name: '.prettierrc', type: 'file' }
  ]

  const extension = await createFile(
    '.vscode/extensions.json',
    JSON.stringify(resolverConfigData.extensions)
  )
  const extensionLog = `📃 create ${extension}`
  const settings = await createFile(
    '.vscode/settings.json',
    JSON.stringify(resolverConfigData.settings)
  )
  const settingsLog = `📃 create ${settings}`
  const logs = await copyItemsToPWD(files)
  return `${extensionLog}\n${settingsLog}\n${eslintLog}\n${logs}`
}
