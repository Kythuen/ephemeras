import { ConfigResolver, removeItemsFromPWD } from '../../utils'
import { commitBase } from '../../resolvers'

export default async function (resolver: ConfigResolver) {
  resolver.use(commitBase)
  const logs = await removeItemsFromPWD([
    { name: '.commitlintrc', type: 'file' },
    { name: '.gitignore', type: 'file' },
    { name: '.lintstagedrc', type: 'file' },
    { name: '.czrc', type: 'file' },
    { name: '.husky', type: 'directory' }
  ])
  return logs
}
