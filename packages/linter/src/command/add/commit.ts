import execa from 'execa'
import { ConfigResolver, copyItemsToPWD } from '../../utils'
import { commitBase } from '../../resolvers'

export default async function (resolver: ConfigResolver) {
  resolver.use(commitBase)
  const logs = await copyItemsToPWD([
    { name: '.commitlintrc', type: 'file' },
    { name: '.gitignore', type: 'file' },
    { name: '.lintstagedrc', type: 'file' },
    { name: '.husky', type: 'directory' }
  ])
  await execa('git init')
  await execa('npx husky install')
  await execa('npm pkg set scripts.prepare="husky install"')
  return logs
}
