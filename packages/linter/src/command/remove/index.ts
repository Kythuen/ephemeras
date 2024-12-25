import { readJSON } from '@ephemeras/fs'
import { join } from 'node:path'
import ora from 'ora'
import TEXT from '../../locales/text'
import { answerPrompts, getPrompts } from '../../prompts'
import { ConfigResolver } from '../../resolver'
import { Tasks, type TaskItemResult } from '../../resolver/task'
import type { LintFeature } from '../../types'
import { getPackageManager, runCmd } from '../../utils'
import removeCommit from './commit'
import removeFormat from './format'

export default async function remove(features?: LintFeature[]) {
  console.log(TEXT.TIP_WELCOME)

  const data: any = {
    format: features?.includes('format'),
    commit: features?.includes('commit')
  }

  if (!features?.length) {
    console.log()
    console.log(TEXT.TITLE_SELECT_FEATURES)
    const { features } = await answerPrompts(
      getPrompts('SelectFeatures', 'remove')
    )
    data.format = features.includes('format')
    data.commit = features.includes('commit')
  }

  if (data.format) {
    console.log()
    console.log(TEXT.TITLE_REMOVE_FORMAT)
    const { remove } = await answerPrompts(getPrompts('RemoveFormat'))
    data.format = remove
  }

  if (data.commit) {
    console.log()
    console.log(TEXT.TITLE_REMOVE_COMMIT)
    const { remove } = await answerPrompts(getPrompts('RemoveCommit'))
    data.commit = remove
  }

  const resolver = new ConfigResolver()
  if (data.format) {
    removeFormat(resolver)
  }
  if (data.commit) {
    removeCommit(resolver)
  }

  console.log()
  const spinner = ora(TEXT.TIP_REMOVE_FILE).start()

  const logs: string[] = []
  const tasks = new Tasks()
  for (const item of resolver.tasks.remove) {
    tasks.addTask(item)
  }
  await tasks.runTask({
    each: ({ log }: TaskItemResult) => {
      if (log) {
        spinner.text = log
        logs.push(log)
      }
    }
  })

  spinner.text = TEXT.TIP_REMOVE_DEPENDENCIES
  if (resolver.data.packages.length) {
    const resolvePackages: string[] = []
    const { devDependencies = {}, dependencies = {} } = await readJSON(
      join(process.cwd(), 'package.json')
    )
    const existPackages = {
      ...dependencies,
      ...devDependencies
    }
    for (const item of resolver.data.packages) {
      if (item.name in existPackages) {
        resolvePackages.push(item.name)
      }
    }
    if (resolvePackages.length) {
      const packageManager = getPackageManager()
      const args = packageManager === 'npm' ? ['uninstall'] : ['remove']
      spinner.text = `📦 ${TEXT.TIP_UNINSTALL_DEPENDENCIES}`
      await runCmd(packageManager, [...args, ...resolvePackages])
      logs.push(`📃 update package.json`)
    }
  }
  spinner.stop().clear()

  if (logs.length) {
    console.log(logs.join('\n'))
  }

  console.log(TEXT.TIP_SUCCESS_REMOVE_DONE)
}
