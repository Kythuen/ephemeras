import type { Profile } from '@ephemeras/profile'
import TEXT from '../../locales/text'
import { getFeaturesPrompt, getUsePresetPrompt } from '../../prompts'
import { answerPrompts } from '../../utils'
import add from '../add'

async function addFeatures(profile: Profile) {
  const { features } = await answerPrompts(getFeaturesPrompt())
  if (features.length) {
    await add(features, profile)
  } else {
    console.log('\n', TEXT.TIP_NOT_CHANGE, '\n')
  }
}
export default async function (profile: Profile) {
  console.log(TEXT.TIP_WELCOME, '\n')
  console.log(TEXT.TITLE_USE_PRESET)
  const presets = profile.getData()
  const presetList = Object.keys(presets)
  if (presetList.length) {
    const { preset } = await answerPrompts(getUsePresetPrompt(presets))
    if (preset) {
      await add([], profile, profile.get(preset))
      return
    }
    await addFeatures(profile)
    return
  }
  await addFeatures(profile)
}
