import { removeItemsFromPWD, ConfigResolver } from '../../utils'
import { formatBase, formatTypeScript, formatVue } from '../../resolvers'

export default async function(resolver: ConfigResolver) {
  resolver.use(formatBase, { environment: 'web' })
  resolver.use(formatTypeScript)
  resolver.use(formatVue)
  const logs = await removeItemsFromPWD([
    { name: 'tsconfig.json', type: 'file' },
    { name: '.editorconfig', type: 'file' },
    { name: '.eslintrc', type: 'file' },
    { name: '.prettierrc', type: 'file' },
    { name: '.vscode', type: 'directory' }
  ])
  return logs
}
