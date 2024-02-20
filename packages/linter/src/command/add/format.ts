import { createFile } from '@ephemeras/utils'
import { formatBase, formatTypeScript, formatVue, formatReact } from '../../resolvers'
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
    resolver.data.eslintOverrides.extends = resolver.data.eslintOverrides.extends.concat([
      'eslint:recommended',
      'plugin:prettier/recommended'
    ])
    resolver.data.eslintOverrides.parser = 'vue-eslint-parser'
  } else if (answerData.framework === 'react') {
    resolver.data.eslintOverrides.extends = resolver.data.eslintOverrides.extends.concat([
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ])
  }

  const resolverConfigData = resolver.data

  const eslintrc = await createFile({
    path: '.eslintrc',
    data: resolverConfigData.eslintOverrides
  })
  const eslintLog = `📃 create ${eslintrc}`
  const files: TItem[] = [
    { name: '.editorconfig', type: 'file' },
    { name: '.prettierrc', type: 'file' }
  ]

  const extension = await createFile({
    path: '.vscode/extensions.json',
    data: resolverConfigData.extensions
  })
  const extensionLog = `📃 create ${extension}`
  const settings = await createFile({
    path: '.vscode/settings.json',
    data: resolverConfigData.settings
  })
  const settingsLog = `📃 create ${settings}`
  const logs = await copyItemsToPWD(files)
  return `${extensionLog}\n${settingsLog}\n${eslintLog}\n${logs}`
}
