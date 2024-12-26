import TEXT from '../../locales/text'
import { answerPrompts, getPrompts } from '../../prompts'
import { profile, Gray, Bold } from '../../utils'

export default async function (presetName: string, args: Record<string, any>) {
  console.log(TEXT.TIP_WELCOME)

  const presets = profile.getData()

  console.log()
  if (args.list) {
    if (!presets || !Object.keys(presets).length) {
      console.log(TEXT.TIP_NO_DATA)
      return
    }
    console.log(TEXT.TITLE_PRESET_LIST)
    Object.keys(presets).forEach(name => {
      console.log(name + Gray(` ${presets[name].description}`))
    })
    return
  }
  if (args.add) {
    console.log(TEXT.TITLE_PRESET_ADD)
    const addPreset = await answerPrompts(getPrompts('AddPreset', {}, presets))
    profile.set(addPreset.name, addPreset)
    console.log()
    console.log(Bold(`${TEXT.TIP_PRESET_ADD}: ${addPreset.name}`))
    return
  }
  if (args.edit) {
    if (!presetName) {
      console.log(TEXT.TIP_NEED_PRESET_NAME)
      return
    }
    const data = profile.get(presetName)
    if (!data) {
      console.log(`${TEXT.TIP_PRESET_NOT_FOUND}: ${presetName}`)
      return
    }
    console.log(`${TEXT.TITLE_PRESET_EDIT} ${presetName}:`)
    const editPreset = await answerPrompts(
      getPrompts('AddPreset', data, presets)
    )
    profile.set(presetName, { name: presetName, ...editPreset })
    console.log()
    console.log(Bold(`${TEXT.TIP_PRESET_EDIT}: ${presetName}`))
    return
  }
  if (args.unset) {
    if (!presetName) {
      console.log(TEXT.TIP_NEED_PRESET_NAME, '\n')
      return
    }
    const data = profile.get(presetName)
    if (!data) {
      console.log(`${TEXT.TIP_PRESET_NOT_FOUND}: ${presetName}`)
      return
    }
    profile.delete(presetName)
    console.log(Bold(`${TEXT.TIP_PRESET_DELETE}: ${presetName}`))
  }
}
