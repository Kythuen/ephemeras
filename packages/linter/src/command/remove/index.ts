import execa from 'execa'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import ora from 'ora'
import { readPKG, getPackageManager, isPnpmWorkspaceRepo } from '@ephemeras/utils'
import TEXT from '../../locales/text'
import { TFeature } from '../common'
import { ConfigResolver, listIntersection, removePackagesVersion, answerPrompts } from '../../utils'
import { getRemoveFormatPrompt, getRemoveCommitPrompt, getUninstallPrompt } from '../../prompts'
import removeCommitFeature from './commit'
import removeFormatFeature from './format'

export default async function remove(features: TFeature[]) {
  const resolver = new ConfigResolver()
  if (features.includes('format')) {
    console.log()
    console.log(TEXT.TITLE_REMOVE_FORMAT)
    const removeFormat = await answerPrompts(getRemoveFormatPrompt())
    if (removeFormat) {
      const logs = await removeFormatFeature(resolver)
      if (logs.length) {
        console.log()
        console.log(logs)
      }
    }
  }
  if (features.includes('commit')) {
    console.log()
    console.log(TEXT.TITLE_REMOVE_COMMIT)
    const removeCommit = await answerPrompts(getRemoveCommitPrompt())
    if (removeCommit) {
      const logs = await removeCommitFeature(resolver)
      if (logs.length) {
        console.log()
        console.log(logs)
      }
    }
  }

  if (existsSync(resolve(process.cwd(), 'node_modules'))) {
    console.log()
    console.log(TEXT.TITLE_UNINSTALL_DEPENDENCIES)
    const { packages } = resolver.data
    const { devDependencies } = await readPKG(process.cwd())
    if (!devDependencies || !Object.keys(devDependencies).length) process.exit(0)
    const resolvePackage = listIntersection(
      Object.keys(devDependencies),
      removePackagesVersion(packages)
    )
    if (resolvePackage.length) {
      const { uninstall } = await answerPrompts(getUninstallPrompt())
      const pm = getPackageManager()
      const args = pm === 'npm' ? ['uninstall', '--save-dev'] : ['remove', '-D']
      if (pm === 'pnpm' && isPnpmWorkspaceRepo()) {
        args.push('-w')
      }
      if (uninstall) {
        const spinner = ora('uninstall dependencies...').start()
        await execa(pm, [...args, ...resolvePackage], { encoding: 'utf8' })
        spinner.succeed('successfully uninstall dependencies')
      } else {
        console.log()
        console.log(TEXT.TITLE_INSTALL_LATER, '\n')
        console.log([pm, ...args, ...resolvePackage].join(' '))
        console.log()
        console.log(TEXT.TIP_PROBLEM_FEEDBACK)
      }
    }
  }
  console.log()
  console.log(TEXT.TIP_SUCCESS_REMOVE_DONE)
}
