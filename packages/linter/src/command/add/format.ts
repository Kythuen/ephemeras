import { createFile } from '@ephemeras/utils'
import { formatBase, formatTypeScript, formatVue } from '../../resolvers'
import { ConfigResolver, TItem, copyItemsToPWD } from '../../utils'

export default async function (resolver: ConfigResolver, answerData: any) {
  resolver.use(formatBase, answerData)
  if (answerData.typescript) {
    resolver.use(formatTypeScript)
  }
  if (answerData.vue) {
    resolver.use(formatVue)
  }

  if (resolver.data.eslintOverrides.extends) {
    ;(resolver.data.eslintOverrides.extends as string[]).push('prettier')
  }

  const resolverConfigData = resolver.data

  const eslintrc = await createFile({
    path: '.eslintrc',
    data: resolverConfigData.eslintOverrides
  })
  const eslintFile = `📃 create ${eslintrc}`
  const files: TItem[] = [
    { name: '.editorconfig', type: 'file' },
    { name: '.prettierrc', type: 'file' },
    { name: '.vscode', type: 'directory' }
  ]
  const logs = await copyItemsToPWD(files)
  return `${eslintFile}\n${logs}`
}
