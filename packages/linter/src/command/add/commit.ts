import execa from 'execa'
import { commitBase } from '../../resolvers'
import { ConfigResolver, copyItemsToPWD } from '../../utils'

export default async function (resolver: ConfigResolver, settings: any) {
  resolver.use(commitBase)
  const logs: string[] = []
  const base = await copyItemsToPWD([
    { name: '.commitlintrc', type: 'file' },
    { name: '.gitignore', type: 'file' },
    { name: '.lintstagedrc', type: 'file' }
  ])
  logs.push(base)
  await execa('git init')
  await execa('npx husky install')
  await execa('npm pkg set scripts.prepare="husky install"')
  if (settings.validate) {
    const validate = await copyItemsToPWD([{ name: '.husky/commit-msg', type: 'file' }])
    logs.push(validate)
  }
  if (settings.message) {
    const message = await copyItemsToPWD([{ name: '.husky/pre-commit', type: 'file' }])
    logs.push(message)
  }

  return logs.join('\n')
}
