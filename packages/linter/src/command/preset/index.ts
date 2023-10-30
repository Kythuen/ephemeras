import { Profile } from '@ephemeras/utils'
import colors from 'picocolors'
import TEXT from '../../locales/text'
import { getPresetPrompt } from '../../prompts'
import { answerPrompts, boldText } from '../../utils'
import { DEFAULT_PRESET_VALUE } from './data'

export default async function (presetName: string, cmd: Record<string, any>, profile: Profile) {
  const presetData: Record<string, any> = profile.getData()
  if (cmd.list) {
    if (!presetData || !Object.keys(presetData).length) {
      console.log(TEXT.TIP_NO_DATA)
      return
    }
    console.log(TEXT.TITLE_PRESET_LIST)
    Object.keys(presetData).forEach(name => {
      console.log(name + colors.gray(` (${presetData[name].description})`))
    })
    return
  }
  if (cmd.add) {
    console.log(TEXT.TITLE_PRESET_ADD)
    const addData = await answerPrompts(getPresetPrompt(DEFAULT_PRESET_VALUE))
    profile.set(addData.name, addData)
    console.log()
    console.log(boldText(`${TEXT.TIP_PRESET_ADD}: ${addData.name}`))
    return
  }
  if (cmd.edit) {
    if (!presetName) {
      console.log(TEXT.TIP_NEED_PRESET_NAME, '\n')
      return
    }
    const data = profile.get(`${presetName}`)
    if (!data) {
      console.log(`${TEXT.TIP_PRESET_NOT_FOUND}: ${presetName}`)
      return
    }
    console.log(`${TEXT.TITLE_PRESET_EDIT} ${presetName}:`)
    const editData = await answerPrompts(getPresetPrompt({ name: presetData, ...data }))
    profile.set(`${presetName}`, editData)
    console.log()
    console.log(boldText(`${TEXT.TIP_PRESET_EDIT}: ${presetName}`))
    return
  }
  if (cmd.unset) {
    if (!presetName) {
      console.log(TEXT.TIP_NEED_PRESET_NAME, '\n')
      return
    }
    profile.delete(`${presetName}`)
    console.log(boldText(`${TEXT.TIP_PRESET_DELETE}: ${presetName}`))
  }
}
