import { createFile } from '@ephemeras/utils'
import { ConfigResolver, copyItemsToPWD, TItem } from '../../utils'
import { formatBase, formatTypeScript, formatVue } from '../../resolvers'

export default async function (resolver: ConfigResolver, prompts: any) {
  resolver.use(formatBase, prompts)
  if (prompts.typescript) {
    resolver.use(formatTypeScript)
  }
  if (prompts.vue) {
    resolver.use(formatVue)
  }

  if (resolver.data.eslintOverrides?.extends) {
    ;(resolver.data.eslintOverrides?.extends as string[]).push('prettier')
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
  if (prompts.environment === 'node') {
    files.unshift({ name: 'tsconfig.json', type: 'file' })
  }
  const logs = await copyItemsToPWD(files)
  return `${eslintFile}\n${logs}`
}
