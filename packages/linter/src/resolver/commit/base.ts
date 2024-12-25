import type { ConfigResolver } from '..'
import {
  copyItemToPWD,
  removeItemFromPWD,
  runCmd,
  setPkg,
  deletePkgFiled
} from '../../utils'

export function commitBase(resolver: ConfigResolver) {
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@commitlint/cli', version: '19.5.0' },
    { name: '@commitlint/config-conventional', version: '19.5.0' },
    { name: 'commitizen', version: '4.3.1' },
    { name: 'cz-conventional-changelog', version: '3.3.0' },
    { name: 'husky', version: '9.1.7' },
    { name: 'lint-staged', version: '15.2.10' }
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
