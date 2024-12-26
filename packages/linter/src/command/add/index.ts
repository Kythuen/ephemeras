import ora from 'ora'
import TEXT from '../../locales/text'
import { answerPrompts, getPromptData, getPrompts } from '../../prompts'
import { ConfigResolver } from '../../resolver'
import { Tasks } from '../../resolver/task'
import type { LintFeature, PromptData } from '../../types'
import { profile, runCmd, setPkg } from '../../utils'
import addCommit from './commit'
import addFormat from './format'

export default async function add(data: PromptData, features?: LintFeature[]) {
  if (!data) {
    console.log(TEXT.TIP_WELCOME)
    data = getPromptData()
  }
  data.features = features || []

  if (!data.preset) {
    if (!data.features.length) {
      console.log()
      console.log(TEXT.TITLE_SELECT_FEATURES)
      const { features } = await answerPrompts(
        getPrompts('SelectFeatures', 'add')
      )
      data.features = features
    }

    console.log()
    console.log(TEXT.TITLE_ADD_REQUIREMENT)
    if (data.features.includes('format')) {
      const format = await answerPrompts(getPrompts('AddFormat'))
      data = {
        ...data,
        ...format
      }
    }
    if (data.features.includes('commit')) {
      const commit = await answerPrompts(getPrompts('AddCommit'))
      data = {
        ...data,
        ...commit
      }
    }
  }

  const resolver = new ConfigResolver()
  addFormat(resolver, data)
  addCommit(resolver, data)

  console.log()
  console.log(TEXT.TITLE_ADD_CONFIRM)
  const { confirm } = await answerPrompts(getPrompts('ConfirmAdd'))

  if (!confirm) {
    console.log()
    console.log(TEXT.TIP_NOT_CHANGE)
    return
  }

  console.log()
  const spinner = ora(TEXT.TIP_CREATE_FILE).start()

  const logs: string[] = []
  const tasks = new Tasks()
  for (const item of resolver.tasks.add) {
    tasks.addTask(item)
  }
  tasks.runTask({
    each: ({ log }: { log: string }) => {
      if (log) {
        spinner.text = log
        logs.push(log)
      }
    }
  })

  spinner.text = TEXT.TIP_ADD_DEPENDENCIES
  for (const pkg of resolver.data.packages) {
    await setPkg(`devDependencies.${pkg.name}`, `^${pkg.version}`)
    spinner.text = `📦 ${TEXT.TEXT_ADD_PACKAGE} ${pkg.name}`
  }
  logs.push(`📃 ${TEXT.TEXT_UPDATE} package.json`)

  spinner.stop().clear()

  console.log(logs.join('\n'))

  console.log()
  console.log(TEXT.TITLE_INSTALL_DEPENDENCIES)
  const { install, packageManager = 'pnpm' } = await answerPrompts(
    getPrompts('Install')
  )

  if (resolver.data.packages.length && install) {
    console.log()
    const spinner = ora(TEXT.TIP_INSTALL_DEPENDENCIES).start()
    await runCmd(packageManager, ['install'])
    spinner.succeed(TEXT.TIP_INSTALL_DEPENDENCIES_SUCCESS)
  }

  if (!data.preset) {
    console.log()
    console.log(TEXT.TITLE_SAVE_AS_PRESET)
    const presetData = await answerPrompts(getPrompts('SavePreset'))

    if (presetData.save) {
      const { name, description } = presetData
      const { features, environment, typescript, commitHook, commitMessage } =
        data
      profile.set(presetData.name, {
        name,
        description,
        features,
        environment,
        typescript,
        commitHook,
        commitMessage
      })
    }
  }

  console.log()
  console.log(TEXT.TIP_SUCCESS_ADD_DONE, '\n')
  console.log(TEXT.TIP_PROBLEM_FEEDBACK)
}
