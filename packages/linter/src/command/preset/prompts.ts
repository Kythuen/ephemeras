import { group, text, select, confirm, cancel } from '@clack/prompts'
import TEXT from '../../locales/text'
import { asyncValue } from '../../utils'

export function editPresetPrompt(presetValue: any) {
  return group(
    {
      name: () =>
        text({
          message: TEXT.PRESET_PROMPT_NAME,
          placeholder: TEXT.PRESET_NAME,
          initialValue: presetValue.value,
          validate: (value: string) => {
            if (!value) return TEXT.PRESET_NAME_RULE_REQUIRED
            if (value.length < 3) return TEXT.PRESET_NAME_RULE_LENGTH
          }
        }),
      description: () =>
        text({
          message: TEXT.PRESET_PROMPT_DESCRIPTION,
          placeholder: TEXT.PRESET_DESCRIPTION,
          initialValue: presetValue.hint,
          validate: (value: string) => {
            if (!value) return TEXT.PRESET_DESCRIPTION_RULE_REQUIRED
            if (value.length < 3) return TEXT.PRESET_DESCRIPTION_RULE_LENGTH
          }
        }),
      format: () =>
        confirm({
          message: TEXT.COMMON_CONFIRM_ADD_FORMAT,
          initialValue: presetValue.configs.format
        }),
      environment: ({ results }) =>
        results.format
          ? select({
              message: TEXT.ADD_PROMPT_CHOOSE_ENVIRONMENT,
              options: [
                { value: 'web', label: 'Browser' },
                { value: 'node', label: 'Node' }
              ],
              initialValue: presetValue.configs.environment
            })
          : asyncValue(''),
      typescript: ({ results }) =>
        results.format
          ? confirm({
              message: TEXT.ADD_PROMPT_USE_TYPESCRIPT
            })
          : asyncValue(false),
      vue: ({ results }) =>
        results.format && results.environment === 'web'
          ? confirm({
              message: TEXT.ADD_PROMPT_USE_VUE,
              initialValue: presetValue.configs.vue
            })
          : asyncValue(false),
      style: ({ results }) =>
        results.format && results.environment === 'web'
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
              ],
              initialValue: presetValue.configs.style
            })
          : asyncValue('airbnb'),
      commit: () =>
        confirm({
          message: TEXT.ADD_PROMPT_CONFIRM_ADD_COMMIT,
          initialValue: presetValue.configs.commit
        })
    },
    {
      onCancel: () => {
        cancel(TEXT.COMMON_CANCEL_OPERATION)
        process.exit(0)
      }
    }
  )
}
