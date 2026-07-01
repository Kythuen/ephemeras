import type { ConfigResolver } from '..'
import type { PromptData } from '../../types'
import { copyItemToPWD, removeItemFromPWD, CURRENT_NODE_VERSIONS } from '../../utils'

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
    { name: '@eslint/js', version: CURRENT_NODE_VERSIONS['@eslint/js'] },
    { name: 'eslint', version: CURRENT_NODE_VERSIONS['eslint'] },
    { name: 'eslint-plugin-prettier', version: CURRENT_NODE_VERSIONS['eslint-plugin-prettier'] },
    { name: 'globals', version: CURRENT_NODE_VERSIONS['globals'] },
    { name: 'prettier', version: CURRENT_NODE_VERSIONS['prettier'] },
    { name: 'typescript-eslint', version: CURRENT_NODE_VERSIONS['typescript-eslint'] }
  ])
  resolver.tasks.add.push(() => copyItemToPWD('.editorconfig'))
  resolver.tasks.add.push(() => copyItemToPWD('.prettierrc'))
  resolver.tasks.remove.push(() => removeItemFromPWD('.editorconfig'))
  resolver.tasks.remove.push(() => removeItemFromPWD('.prettierrc'))
}
