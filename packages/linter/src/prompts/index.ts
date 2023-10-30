import TEXT from '../locales/text'
import { getPackageManagers } from '@ephemeras/utils'
import type { PromptObject, Answers } from 'prompts'

export function getUsePresetPrompt(presets: Record<string, any>): PromptObject[] {
  const choices: any = [{ value: '', title: TEXT.TEXT_MANUAL_SELECT }]
  for (const name in presets) {
    choices.push({ value: name, title: name, description: presets[name].description })
  }
  return [
    {
      name: 'preset',
      type: 'select',
      initial: 0,
      message: TEXT.PROMPT_SELECT_PRESET,
      choices,
      hint: ' '
    }
  ]
}
export function getFeaturesPrompt(): PromptObject[] {
  return [
    {
      name: 'features',
      type: 'multiselect',
      instructions: false,
      min: 1,
      message: TEXT.PROMPT_SELECT_ADD_FEATURES,
      choices: [
        { title: TEXT.TEXT_FEATURE_FORMAT, value: 'format' },
        { title: TEXT.TEXT_FEATURE_COMMIT, value: 'commit' }
      ]
    }
  ]
}
export function getAddFormatPrompt(): PromptObject[] {
  return [
    {
      name: 'environment',
      type: 'multiselect',
      instructions: false,
      min: 1,
      message: TEXT.PROMPT_SELECT_ENVIRONMENT,
      choices: [
        { title: 'Browser', value: 'web' },
        { title: 'Node', value: 'node' }
      ]
    },
    {
      name: 'typescript',
      type: 'toggle',
      message: TEXT.PROMPT_USE_TYPESCRIPT,
      initial: true,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'vue',
      type: (_: any, values: Answers<any>) =>
        values.environment.includes('web') ? 'toggle' : null,
      message: TEXT.PROMPT_USE_VUE,
      initial: true,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'style',
      type: 'select',
      message: TEXT.PROMPT_SELECT_CODE_STYLE_GUIDE,
      choices: [
        {
          title: 'airbnb',
          value: 'airbnb',
          description: 'https://github.com/airbnb/javascript'
        },
        {
          title: 'standard',
          value: 'standard',
          description: 'https://github.com/standard/standard'
        }
      ]
    }
  ]
}
export function getAddCommitPrompt(): PromptObject[] {
  return [
    {
      name: 'validate',
      type: 'toggle',
      message: TEXT.PROMPT_USE_COMMIT_VALIDATE,
      initial: true,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'message',
      type: 'toggle',
      message: TEXT.PROMPT_CHECK_COMMIT_MESSAGE,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getSavePresetPrompt(): PromptObject[] {
  return [
    {
      name: 'save',
      type: 'toggle',
      message: TEXT.PROMPT_SAVE_AS_PRESET,
      initial: false,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'name',
      type: (_: any, values: Answers<any>) => (values.save ? 'text' : null),
      message: TEXT.PROMPT_PRESET_NAME,
      initial: '',
      validate: (value: string) => {
        if (!value) return TEXT.RULE_PRESET_NAME_REQUIRED
        if (value.length < 3) return TEXT.RULE_PRESET_NAME_LENGTH
        return true
      }
    },
    {
      name: 'description',
      type: (_: any, values: Answers<any>) => (values.save ? 'text' : null),
      message: TEXT.PROMPT_PRESET_DESCRIPTION,
      initial: '',
      validate: (value: string) => {
        if (!value) return TEXT.RULE_PRESET_DESCRIPTION_REQUIRED
        if (value.length < 3) return TEXT.RULE_PRESET_DESCRIPTION_LENGTH
        return true
      }
    }
  ]
}
export function getInstallPrompt(): PromptObject[] {
  const choices: any = []
  for (const pm of getPackageManagers()) {
    choices.push({ title: pm, value: pm })
  }
  return [
    {
      name: 'install',
      type: 'toggle',
      message: TEXT.PROMPT_INSTALL_NOW,
      initial: true,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'pm',
      type: (_: any, values: Answers<any>) => (values.install ? 'select' : null),
      initial: 0,
      message: TEXT.PROMPT_SELECT_PACKAGE_MANAGER,
      choices,
      hint: ' '
    }
  ]
}

export function getRemoveFormatPrompt(): PromptObject[] {
  return [
    {
      name: 'remove',
      type: 'toggle',
      message: TEXT.PROMPT_REMOVE_FORMAT,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getRemoveCommitPrompt(): PromptObject[] {
  return [
    {
      name: 'remove',
      type: 'toggle',
      message: TEXT.PROMPT_REMOVE_COMMIT,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getUninstallPrompt(): PromptObject[] {
  return [
    {
      name: 'uninstall',
      type: 'toggle',
      message: TEXT.PROMPT_REMOVE_UNINSTALL,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}

export function getPresetPrompt(presetData: any): PromptObject[] {
  return [
    {
      name: 'name',
      type: presetData.name ? null : 'text',
      message: TEXT.PROMPT_PRESET_NAME,
      initial: presetData.name,
      validate: (value: string) => {
        if (!value) return TEXT.RULE_PRESET_NAME_REQUIRED
        if (value.length < 3) return TEXT.RULE_PRESET_NAME_LENGTH
        return true
      }
    },
    {
      name: 'description',
      type: 'text',
      message: TEXT.PROMPT_PRESET_DESCRIPTION,
      initial: presetData.description,
      validate: (value: string) => {
        if (!value) return TEXT.RULE_PRESET_DESCRIPTION_REQUIRED
        if (value.length < 3) return TEXT.RULE_PRESET_DESCRIPTION_LENGTH
        return true
      }
    },
    {
      name: 'features',
      type: 'multiselect',
      instructions: false,
      min: 1,
      message: TEXT.PROMPT_SELECT_ADD_FEATURES,
      choices: [
        {
          title: TEXT.TEXT_FEATURE_COMMIT,
          value: 'format',
          selected: presetData.features.includes('format')
        },
        {
          title: TEXT.TEXT_FEATURE_FORMAT,
          value: 'commit',
          selected: presetData.features.includes('commit')
        }
      ]
    },
    {
      name: 'environment',
      type: (_: any, values: Answers<any>) =>
        values.features.includes('format') ? 'multiselect' : null,
      instructions: false,
      min: 1,
      message: TEXT.PROMPT_SELECT_ENVIRONMENT,
      choices: [
        { title: 'Browser', value: 'web', selected: presetData.environment.includes('web') },
        { title: 'Node', value: 'node', selected: presetData.environment.includes('node') }
      ]
    },
    {
      name: 'typescript',
      type: (_: any, values: Answers<any>) =>
        values.features.includes('format') ? 'toggle' : null,
      message: TEXT.PROMPT_USE_TYPESCRIPT,
      initial: presetData.typescript,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'vue',
      type: (_: any, values: Answers<any>) =>
        values.environment.includes('web') ? 'toggle' : null,
      message: TEXT.PROMPT_USE_VUE,
      initial: presetData.vue,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'style',
      type: (_: any, values: Answers<any>) =>
        values.features.includes('format') ? 'select' : null,
      message: TEXT.PROMPT_SELECT_CODE_STYLE_GUIDE,
      initial: ['airbnb', 'standard'].indexOf(presetData.style),
      choices: [
        {
          title: 'airbnb',
          value: 'airbnb',
          description: 'https://github.com/airbnb/javascript'
        },
        {
          title: 'standard',
          value: 'standard',
          description: 'https://github.com/standard/standard'
        }
      ]
    },
    {
      name: 'validate',
      type: (_: any, values: Answers<any>) =>
        values.features.includes('commit') ? 'toggle' : null,
      message: TEXT.PROMPT_USE_COMMIT_VALIDATE,
      initial: presetData.validate,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'message',
      type: (_: any, values: Answers<any>) =>
        values.features.includes('commit') ? 'toggle' : null,
      message: TEXT.PROMPT_CHECK_COMMIT_MESSAGE,
      initial: presetData.message,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
