import type { ConfigResolver } from '..'
import type { PromptData } from '../../types'
import { copyItemToPWD, removeItemFromPWD } from '../../utils'

export function formatBase(
  resolver: ConfigResolver,
  data: Partial<PromptData>
) {
  resolver.data.extensions = resolver.data.extensions.concat([
    'EditorConfig.EditorConfig',
    'dbaeumer.vscode-eslint',
    'esbenp.prettier-vscode'
  ])
  if (data.environment?.includes('browser')) {
    resolver.data.languages = resolver.data.languages.concat([
      'html',
      'css',
      'javascript'
    ])
  }
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@eslint/js', version: '9.15.0' },
    { name: 'eslint', version: '9.15.0' },
    { name: 'eslint-plugin-prettier', version: '5.2.1' },
    { name: 'globals', version: '15.12.0' },
    { name: 'prettier', version: '3.3.3' },
    { name: 'typescript-eslint', version: '8.15.0' }
  ])
  resolver.tasks.add.push(() => copyItemToPWD('.editorconfig'))
  resolver.tasks.add.push(() => copyItemToPWD('.prettierrc'))
  resolver.tasks.remove.push(() => removeItemFromPWD('.editorconfig'))
  resolver.tasks.remove.push(() => removeItemFromPWD('.prettierrc'))
}
