import TEXT from '../../locales/text'
import { answerPrompts, getPrompts, getPromptData } from '../../prompts'
import { profile } from '../../utils'
import add from '../add'

export default async function () {
  console.log(TEXT.TIP_WELCOME)

  const presets = profile.getData()
  const presetList = Object.keys(presets)
  let data = getPromptData()

  if (presetList.length) {
    console.log()
    console.log(TEXT.TITLE_USE_PRESET)
    const { preset } = await answerPrompts(getPrompts('SelectPreset', presets))
    data.preset = preset
  }

  if (data.preset) {
    data = { ...profile.getData()[data.preset], preset: data.preset }
  }

  await add(data)
}
