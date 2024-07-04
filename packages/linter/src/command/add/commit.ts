import execa from 'execa'
import { commitBase } from '../../resolvers'
import { createFile } from '@ephemeras/fs'
import { ConfigResolver, copyItemsToPWD } from '../../utils'

export default async function (resolver: ConfigResolver, settings: any) {
  resolver.use(commitBase)
  const logs: string[] = []
  const base = await copyItemsToPWD([
    { name: '.commitlintrc', type: 'file' },
    // { name: '.gitignore', type: 'file' },
    { name: '.lintstagedrc', type: 'file' },
    { name: '.czrc', type: 'file' }
  ])

  await createFile(
    '.gitignore',
    `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build
node_modules
dist
dist-ssr
*.local

# Lock file
package-lock.json
yarn.lock

# Editor
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`
  )
  logs.push(base)
  await execa('git init')
  await execa('npx husky install')
  await execa('npm pkg set scripts.prepare="husky install"')
  if (settings.validate) {
    const validate = await copyItemsToPWD([
      { name: '.husky/commit-msg', type: 'file' }
    ])
    logs.push(validate)
  }
  if (settings.message) {
    const message = await copyItemsToPWD([
      { name: '.husky/pre-commit', type: 'file' }
    ])
    logs.push(message)
  }

  return logs.join('\n')
}
