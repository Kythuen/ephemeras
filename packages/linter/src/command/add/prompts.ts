import {
  group,
  text,
  multiselect,
  select,
  confirm,
  cancel
} from '@clack/prompts'
import TEXT from '../../locales/text'
import { asyncValue, mapToList } from '../../utils'
import { featuresMap, TFeature } from '../common'
import type { Profile } from '@ephemeras/utils'

export function addFeaturesPrompt(features: TFeature[], profile: Profile) {
  const presetOptions: any = [
    { value: '', label: TEXT.ADD_PROMPT_MANUAL_SELECT },
    ...Object.values(profile.get('presets') || {})
  ]
  return group(
    {
      features: () =>
        features.length
          ? asyncValue(features)
          : multiselect({
              message: TEXT.ADD_PROMPT_CHOOSE_ADD_FEATURES,
              options: mapToList(featuresMap),
              required: true
            }),
      preset: () =>
        presetOptions[1]
          ? select({
              message: TEXT.ADD_PROMPT_USE_PRESET,
              options: presetOptions
            })
          : asyncValue(''),
      format: ({ results }) =>
        !results.preset && results.features.includes('format')
          ? confirm({
              message: TEXT.ADD_PROMPT_CONFIRM_ADD_FORMAT
            })
          : asyncValue(false),
      environment: ({ results }) =>
        !results.preset && results.format
          ? select({
              message: TEXT.ADD_PROMPT_CHOOSE_ENVIRONMENT,
              options: [
                { value: 'web', label: 'Browser' },
                { value: 'node', label: 'Node' }
              ]
            })
          : asyncValue(''),
      typescript: ({ results }) =>
        !results.preset && results.format
          ? confirm({
              message: TEXT.ADD_PROMPT_USE_TYPESCRIPT
            })
          : asyncValue(false),
      vue: ({ results }) =>
        !results.preset && results.format && results.environment === 'web'
          ? confirm({
              message: TEXT.ADD_PROMPT_USE_VUE
            })
          : asyncValue(false),
      style: ({ results }) =>
        !results.preset && results.format && results.environment === 'web'
          ? select({
              message: TEXT.ADD_PROMPT_CHOOSE_CODE_STYLE_GUIDE,
              options: [
                {
                  value: 'airbnb',
                  label: 'Airbnb',
                  hint: 'https://github.com/airbnb/javascript'
                },
                {
                  value: 'standard',
                  label: 'Standard',
                  hint: 'https://github.com/standard/standard'
                }
              ]
            })
          : asyncValue('airbnb'),
      commit: ({ results }) =>
        !results.preset && results.features.includes('commit')
          ? confirm({
              message: TEXT.ADD_PROMPT_CONFIRM_ADD_COMMIT
            })
          : asyncValue(false)
    },
    {
      onCancel: () => {
        cancel(TEXT.COMMON_CANCEL_OPERATION)
        process.exit(0)
      }
    }
  )
}

export function installNowPrompt() {
  return confirm({
    message: TEXT.ADD_PROMPT_INSTALL_NOW
  })
}

export function selectPMPrompt(pms: string[]) {
  const options: any = []
  for (const pm of pms) {
    options.push({
      label: pm,
      value: pm
    })
  }
  return select({
    message: TEXT.ADD_PROMPT_CHOOSE_PACKAGE_MANAGER,
    options: mapToList({
      pnpm: 'pnpm',
      yarn: 'yarn',
      npm: 'npm'
    })
  })
}

export function confirmSavePresetPrompt() {
  return confirm({ message: TEXT.ADD_PROMPT_SAVE_AS_PRESET })
}
export function presetNamePrompt() {
  return text({
    message: TEXT.PRESET_PROMPT_NAME,
    placeholder: TEXT.PRESET_NAME,
    validate: (value: string) => {
      if (!value) return TEXT.PRESET_NAME_RULE_REQUIRED
      if (value.length < 3) return TEXT.PRESET_NAME_RULE_LENGTH
    }
  })
}
export function presetDescriptionPrompt() {
  return text({
    message: TEXT.PRESET_PROMPT_DESCRIPTION,
    placeholder: TEXT.PRESET_DESCRIPTION,
    validate: (value: string) => {
      if (!value) return TEXT.PRESET_DESCRIPTION_RULE_REQUIRED
      if (value.length < 3) return TEXT.PRESET_DESCRIPTION_RULE_LENGTH
    }
  })
}
export function saveAsPresetPrompt() {
  // TODO: group 冲突
  return group({
    save: () => confirm({ message: TEXT.ADD_PROMPT_SAVE_AS_PRESET }),
    name: ({ results }) =>
      results.save
        ? text({
            message: TEXT.PRESET_PROMPT_NAME,
            placeholder: TEXT.PRESET_NAME,
            validate: (value: string) => {
              if (!value) return TEXT.PRESET_NAME_RULE_REQUIRED
              if (value.length < 3) return TEXT.PRESET_NAME_RULE_LENGTH
            }
          })
        : asyncValue(''),
    description: ({ results }) =>
      results.save
        ? text({
            message: TEXT.PRESET_PROMPT_DESCRIPTION,
            placeholder: TEXT.PRESET_DESCRIPTION,
            validate: (value: string) => {
              if (!value) return TEXT.PRESET_DESCRIPTION_RULE_REQUIRED
              if (value.length < 3) return TEXT.PRESET_DESCRIPTION_RULE_LENGTH
            }
          })
        : asyncValue('')
  })
}
