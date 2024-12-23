import type { Profile } from '@ephemeras/profile'
import TEXT from '../../locales/text'
import {
  getUsePresetPrompt,
  getFeaturesPrompt,
  answerPrompts
} from '../../prompts'
import type { PromptData } from '../../types'
import add from '../add'

// async function addFeatures(profile: Profile) {
//   console.log()
//   console.log(TEXT.TITLE_SELECT_FEATURES)
//   const { features } = await answerPrompts(getFeaturesPrompt())
//   if (features.length) {
//     await add(features, profile)
//   } else {
//     console.log('\n', TEXT.TIP_NOT_CHANGE, '\n')
//   }
// }
export default async function (profile: Profile) {
  console.log(TEXT.TIP_WELCOME, '\n')
  console.log(TEXT.TITLE_USE_PRESET)
  const presets = profile.getData()
  const presetList = Object.keys(presets)

  let data: PromptData = {
    preset: '',
    features: [],
    environment: [],
    framework: '',
    typescript: false,
    commitHook: false,
    commitMessage: false,
    save: false,
    install: false,
    packageManager: ''
  }
  if (presetList.length) {
    const { preset } = await answerPrompts(getUsePresetPrompt(presets))
    data.preset = preset
  }

  if (!data.preset) {
    console.log()
    console.log(TEXT.TITLE_SELECT_FEATURES)
    const { features } = await answerPrompts(getFeaturesPrompt())
    data.features = features
  } else {
    data = { ...profile.getData()[data.preset], preset: data.preset }
  }
  await add(profile, data)
}
