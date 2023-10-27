import { intro, outro } from '@clack/prompts'
import { Profile } from '@ephemeras/utils'
import { bgGreen, black, gray } from 'picocolors'
import TEXT from '../../locales/text'
import { editPresetPrompt } from './prompts'
import { DEFAULT_PRESET_VALUE } from './data'

export default async function (
  presetName: string,
  cmd: Record<string, any>,
  profile: Profile
) {
  const presetData = profile.getData()
  if (cmd.list) {
    if (!presetData || !Object.keys(presetData).length) {
      console.log(TEXT.COMMON_NO_DATA)
      return
    }
    const list: any = Object.values(profile.getData())
    for (const item of list) {
      console.log(item.label + gray(` (${item.hint})`))
    }
    return
  }
  if (cmd.add) {
    intro(`${bgGreen(black(TEXT.PRESET_PROMPT_TITLE_ADD))}`)
    const {
      name,
      description,
      environment,
      typescript,
      vue,
      style,
      commit,
      format
    } = await editPresetPrompt(DEFAULT_PRESET_VALUE, profile)
    const payload = {
      value: name,
      label: name,
      hint: description,
      configs: {
        environment,
        typescript,
        vue,
        style,
        commit,
        format
      }
    }
    profile.set(name, payload)
    outro(`${TEXT.COMMON_SUCCESS_OPERATION}: ${name}`)
  }
  if (cmd.edit) {
    if (!presetName) {
      throw new Error(TEXT.PRESET_ERROR_NEED_NAME)
    }
    const data = profile.get(presetName)
    if (!data) {
      console.log(`${TEXT.PRESET_ERROR_PRESET_NOT_FOUND}: ${presetName}`)
      return
    }
    const promptTitle = ` ${TEXT.PRESET_EDIT_PRESET}: ${presetName} `
    intro(`${bgGreen(black(promptTitle))}`)
    const {
      name,
      description,
      environment,
      typescript,
      vue,
      style,
      commit,
      format
    } = await editPresetPrompt(data, profile)
    if (name !== presetName) {
      const payload = {
        value: name,
        label: name,
        hint: description,
        configs: {
          environment,
          typescript,
          vue,
          style,
          commit,
          format
        }
      }
      profile.delete(presetName)
      profile.set(name, payload)
      outro(`${TEXT.PRESET_OPERATION_SUCCESS_EDIT}: ${presetName} -> ${name}.`)
      return
    }
    const payload = {
      value: presetName,
      label: presetName,
      hint: description,
      configs: {
        environment,
        typescript,
        vue,
        style,
        commit,
        format
      }
    }
    profile.set(presetName, payload)
    outro(`${TEXT.PRESET_OPERATION_SUCCESS_EDIT}: ${presetName}.`)
  }
}
