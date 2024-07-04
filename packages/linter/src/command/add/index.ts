import { Profile } from '@ephemeras/profile'
import { isPnpmWorkspaceRepo } from '@ephemeras/utils'
import execa from 'execa'
import ora from 'ora'
import TEXT from '../../locales/text'
import {
  getAddCommitPrompt,
  getAddFormatPrompt,
  getInstallPrompt,
  getSavePresetPrompt
} from '../../prompts'
import { ConfigResolver, answerPrompts } from '../../utils'
import { TFeature } from '../common'
import addCommitFeature from './commit'
import addFormatFeature from './format'

export default async function add(
  features: TFeature[],
  profile: Profile,
  presetSetting?: any
) {
  const resolver = new ConfigResolver()
  if (presetSetting) {
    if (presetSetting.features.includes('format')) {
      console.log()
      console.log(TEXT.TITLE_ADD_FORMAT)
      const logs = await addFormatFeature(resolver, presetSetting)
      console.log(logs)
    }
    if (presetSetting.features.includes('commit')) {
      console.log()
      console.log(TEXT.TITLE_ADD_COMMIT)
      const logs = await addCommitFeature(resolver, presetSetting)
      console.log(logs)
    }
  } else {
    let settings: any = {
      features,
      environment: [],
      typescript: false,
      framework: '',
      style: '',
      validate: false,
      message: false
    }
    if (settings.features.includes('format')) {
      console.log()
      console.log(TEXT.TITLE_ADD_FORMAT)
      const addFormatData = await answerPrompts(getAddFormatPrompt())
      settings = {
        ...settings,
        ...addFormatData
      }
      const logs = await addFormatFeature(resolver, settings)
      console.log()
      console.log(logs)
    }
    if (settings.features.includes('commit')) {
      console.log()
      console.log(TEXT.TITLE_ADD_COMMIT)
      const addCommitData = await answerPrompts(getAddCommitPrompt())
      settings = {
        ...settings,
        ...addCommitData
      }
      const logs = await addCommitFeature(resolver, settings)
      console.log()
      console.log(logs)
    }
    if (features.length) {
      console.log()
      console.log(TEXT.TITLE_ADD_PRESET)
      const presetData = await answerPrompts(getSavePresetPrompt())
      if (presetData.save) {
        profile.set(presetData.name, {
          description: presetData.description,
          ...settings
        })
      }
    }
  }

  if (resolver.data.packages.length) {
    console.log()
    console.log(TEXT.TITLE_INSTALL_DEPENDENCIES)
    const { install, pm = 'npm' } = await answerPrompts(getInstallPrompt())
    const args = pm === 'npm' ? ['install', '--save-dev'] : ['add', '-D']
    if (pm === 'pnpm' && isPnpmWorkspaceRepo()) {
      args.push('-w')
    }
    if (install) {
      const spinner = ora('install dependencies...').start()
      await execa(pm, [...args, ...resolver.data.packages], {
        encoding: 'utf8'
      })
      spinner.succeed('successfully install dependencies')
    } else {
      console.log()
      console.log(TEXT.TITLE_INSTALL_LATER, '\n')
      console.log([pm, ...args, ...resolver.data.packages].join(' '))
      console.log()
      console.log(TEXT.TIP_PROBLEM_FEEDBACK)
    }
  }

  console.log()
  console.log(TEXT.TIP_SUCCESS_ADD_DONE)
}
