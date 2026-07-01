import type { ConfigResolver } from '..'
import {
  copyItemToPWD,
  removeItemFromPWD,
  runCmd,
  setPkg,
  deletePkgFiled,
  CURRENT_NODE_VERSIONS
} from '../../utils'

export function commitBase(resolver: ConfigResolver) {
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@commitlint/cli', version: CURRENT_NODE_VERSIONS['@commitlint/cli'] },
    { name: '@commitlint/config-conventional', version: CURRENT_NODE_VERSIONS['@commitlint/config-conventional'] },
    { name: 'commitizen', version: CURRENT_NODE_VERSIONS['commitizen'] },
    { name: 'cz-conventional-changelog', version: CURRENT_NODE_VERSIONS['cz-conventional-changelog'] },
    { name: 'husky', version: CURRENT_NODE_VERSIONS['husky'] },
    { name: 'lint-staged', version: CURRENT_NODE_VERSIONS['lint-staged'] }
  ])
  const files: string[] = [
    '.husky/commit-msg',
    '.husky/pre-commit',
    '.commitlintrc',
    '.czrc',
    '.lintstagedrc',
    '.gitignore'
  ]

  for (const item of files) {
    resolver.tasks.add.push(() => copyItemToPWD(item))
    resolver.tasks.remove.push(() => removeItemFromPWD(item))
  }
  resolver.tasks.add.push(async () => {
    await runCmd('git', ['init'])
  })
  resolver.tasks.remove.push(() => removeItemFromPWD('.git', 'directory'))
  resolver.tasks.add.push(async () => {
    await runCmd('npx', ['husky', 'install'])
  })
  resolver.tasks.remove.push(() => removeItemFromPWD('.husky', 'directory'))
  resolver.tasks.add.push(async () => {
    await setPkg('scripts.prepare', 'husky install')
  })
  resolver.tasks.remove.push(async () => {
    await deletePkgFiled('scripts.prepare')
  })
}
