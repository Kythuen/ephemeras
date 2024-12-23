import type { ConfigResolver } from '..'
import { copyItemsToPWD, runCmd, setPkg } from '../../utils'

export function commitBase(resolver: ConfigResolver) {
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@commitlint/cli', version: '19.5.0' },
    { name: '@commitlint/config-conventional', version: '19.5.0' },
    { name: 'commitizen', version: '4.3.1' },
    { name: 'cz-conventional-changelog', version: '3.3.0' },
    { name: 'husky', version: '9.1.7' },
    { name: 'lint-staged', version: '15.2.10' }
  ])
  // resolver.tasks.addTask(() =>
  //   copyItemsToPWD([
  //     { path: '.husky/commit-msg' },
  //     { path: '.husky/pre-commit' },
  //     { path: '.commitlintrc' },
  //     { path: '.czrc' },
  //     { path: '.lintstagedrc' },
  //     { path: '.gitignore' }
  //   ])
  // )
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: '.husky/commit-msg' }]))
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: '.husky/pre-commit' }]))
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: '.commitlintrc' }]))
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: '.czrc' }]))
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: '.lintstagedrc' }]))
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: '.gitignore' }]))
  resolver.tasks.addTask(async () => {
    await runCmd('git', ['init'])
  })
  resolver.tasks.addTask(async () => {
    await runCmd('npx', ['husky', 'install'])
  })
  resolver.tasks.addTask(async () => {
    await setPkg('scripts.prepare', 'husky install')
  })
}
