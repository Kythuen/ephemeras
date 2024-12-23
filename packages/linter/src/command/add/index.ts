import { FileParser, nunjucks } from '@ephemeras/parser'
import type { Profile } from '@ephemeras/profile'
import { join, resolve } from 'node:path'
import ora from 'ora'
import { PROJECT_ROOT } from '../../constant'
import TEXT from '../../locales/text'
import {
  answerPrompts,
  getAddCommitPrompt,
  getAddFormatPrompt,
  getInstallPrompt,
  getConfirmAddPrompt,
  getSavePresetPrompt
} from '../../prompts'
import { ConfigResolver } from '../../resolver'
import type { PromptData } from '../../types'
import {
  createFileToPWD,
  setPkg,
  isPnpmWorkspaceRepo,
  runCmd
} from '../../utils'
import addCommit from './commit'
import addFormat from './format'

function createVSCodeSetting(resolver: ConfigResolver) {
  const { languages } = resolver.data

  const fileContent = `{
  "editor.formatOnSave": true,
${languages.map(i => `  "[${i}]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }`).join(',\n')}
}`
  resolver.tasks.addTask(
    () => createFileToPWD('.vscode/settings.json', fileContent),
    'unshift'
  )
}
function createVSCodeExtensions(resolver: ConfigResolver) {
  const { extensions } = resolver.data

  const fileContent = `{
  "recommendations": [
${extensions.map(i => `    "${i}"`).join(',\n')}
  ]
}`
  resolver.tasks.addTask(
    () => createFileToPWD('.vscode/extensions.json', fileContent),
    'unshift'
  )
}
function createEslintConfig(resolver: ConfigResolver, data: PromptData) {
  const parser = new FileParser({
    source: resolve(PROJECT_ROOT, 'files', 'eslint.config.js'),
    destination: join(process.cwd(), 'eslint.config.js'),
    overwrite: true
  })
  parser.use(nunjucks(data))

  resolver.tasks.addTask(async () => {
    await parser.build()
    return `📃 create eslint.config.js`
  })
}
// async function addPackages(resolver: ConfigResolver) {
//   for (const pkg of resolver.data.packages) {
//     await setPkg(`devDependencies.${pkg.name}`, `^${pkg.version}`)
//   }
// }

export default async function add(profile: Profile, data: PromptData) {
  if (!data.preset) {
    if (data.features.includes('format')) {
      console.log()
      console.log(TEXT.TITLE_ADD_FORMAT)
      const format: Partial<PromptData> =
        await answerPrompts(getAddFormatPrompt())
      data = {
        ...data,
        ...format
      }
    }
    if (data.features.includes('commit')) {
      console.log()
      console.log(TEXT.TITLE_ADD_COMMIT)
      const commit: Partial<PromptData> =
        await answerPrompts(getAddCommitPrompt())
      data = {
        ...data,
        ...commit
      }
    }
  }

  const resolver = new ConfigResolver()
  addFormat(resolver, data)
  addCommit(resolver, data)

  createVSCodeSetting(resolver)
  createVSCodeExtensions(resolver)
  createEslintConfig(resolver, data)

  console.log()
  console.log(TEXT.TITLE_CONFIRM_ADD_LINTER)
  const { confirm } = await answerPrompts(getConfirmAddPrompt())

  if (!confirm) {
    console.log(TEXT.TIP_CANCEL_OPERATION)
    return
  }

  console.log()
  const spinner = ora('start create files...').start()
  await resolver.tasks.runTask({
    each: ({ log }: any) => {
      if (log) {
        spinner.text = log
      }
    }
  })

  spinner.text = 'start add dependencies...'
  for (const pkg of resolver.data.packages) {
    await setPkg(`devDependencies.${pkg.name}`, `^${pkg.version}`)
    spinner.text = `add package ${pkg.name}`
  }

  spinner.stop().clear()

  console.log(TEXT.TITLE_INSTALL_DEPENDENCIES)
  const { install, packageManager = 'pnpm' } =
    await answerPrompts(getInstallPrompt())

  if (resolver.data.packages.length) {
    console.log()
    console.log(TEXT.TITLE_INSTALL_DEPENDENCIES)
    const args =
      packageManager === 'npm' ? ['install', '--save-dev'] : ['add', '-D']
    if (packageManager === 'pnpm' && isPnpmWorkspaceRepo()) {
      args.push('-w')
    }
    if (install) {
      const spinner = ora('install dependencies...').start()
      await runCmd(packageManager, [...args, 'install'])
      spinner.succeed('successfully install dependencies')
    } else {
      console.log()
      console.log(TEXT.TITLE_INSTALL_LATER, '\n')
      console.log()
    }
  }

  if (!data.preset) {
    console.log()
    console.log(TEXT.PROMPT_SAVE_AS_PRESET)
    const presetData = await answerPrompts(getSavePresetPrompt())

    if (presetData.save) {
      profile.set(presetData.name, {
        description: presetData.description,
        ...data
      })
    }
  }

  console.log()
  console.log(TEXT.TIP_SUCCESS_ADD_DONE, '\n')
  console.log(TEXT.TIP_PROBLEM_FEEDBACK)
}
