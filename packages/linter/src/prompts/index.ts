import prompts, { type Answers, type Choice, type PromptObject } from 'prompts'
import TEXT from '../locales/text'
import { getPackageManagers, isPnpmWorkspaceRepo } from '../utils'
import { DEFAULT_PROMPT_DATA } from './constant'

export function answerPrompts(questions: PromptObject[]) {
  return prompts(questions, {
    onCancel: () => {
      console.log()
      console.log(TEXT.TIP_CANCEL_OPERATION)
      console.log()
      process.exit(0)
    }
  })
}

export function getPromptData(key: keyof typeof DEFAULT_PROMPT_DATA) {
  return DEFAULT_PROMPT_DATA[key]
}

type PromptKey =
  | 'SelectPreset'
  | 'SelectFeatures'
  | 'AddFormat'
  | 'AddCommit'
  | 'ConfirmAdd'
  | 'SavePreset'
  | 'Install'
  | 'RemoveFormat'
  | 'RemoveCommit'
  | 'ConfirmRemove'
export function getPrompts(key: PromptKey, ...payload: any) {
  switch (key) {
    case 'SelectPreset':
      return getSelectPreset(...(payload as Parameters<typeof getSelectPreset>))
    case 'SelectFeatures':
      return getSelectFeatures(
        ...(payload as Parameters<typeof getSelectFeatures>)
      )
    case 'AddFormat':
      return getAddFormat()
    case 'AddCommit':
      return getAddCommit()
    case 'ConfirmAdd':
      return getConfirmAdd()
    case 'SavePreset':
      return getSavePreset()
    case 'Install':
      return getInstall()
    case 'RemoveFormat':
      return getRemoveFormat()
    case 'RemoveCommit':
      return getRemoveCommit()
    case 'ConfirmRemove':
      return getConfirmRemove()
  }
}

export function getSelectPreset(presets: Record<string, any>): PromptObject[] {
  const choices: Choice[] = [{ title: TEXT.TEXT_MANUAL_SELECT, value: '' }]
  for (const name in presets) {
    choices.push({
      title: name,
      value: name,
      description: presets[name].description
    })
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
export function getSelectFeatures(type: 'add' | 'remove'): PromptObject[] {
  return [
    {
      name: 'features',
      type: 'multiselect',
      instructions: false,
      min: 1,
      message:
        type === 'add'
          ? TEXT.PROMPT_SELECT_FEATURES_ADD
          : TEXT.PROMPT_SELECT_FEATURES_REMOVE,
      choices: [
        { title: TEXT.TEXT_FEATURE_FORMAT, value: 'format' },
        { title: TEXT.TEXT_FEATURE_COMMIT, value: 'commit' }
      ]
    }
  ]
}
export function getAddFormat(): PromptObject[] {
  return [
    {
      name: 'environment',
      type: 'multiselect',
      instructions: false,
      min: 1,
      message: TEXT.PROMPT_SELECT_ENVIRONMENT,
      choices: [
        { title: 'Browser', value: 'browser' },
        { title: 'Node', value: 'node' }
      ]
    },
    {
      name: 'framework',
      type: (_: any, values: Answers<any>) =>
        values.environment.includes('browser') ? 'select' : null,
      message: TEXT.PROMPT_SELECT_FRAMEWORK,
      choices: [
        {
          title: 'Vue',
          value: 'vue'
        },
        {
          title: 'React',
          value: 'react'
        }
      ]
    },
    {
      name: 'typescript',
      type: 'toggle',
      message: TEXT.PROMPT_USE_TYPESCRIPT,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getAddCommit(): PromptObject[] {
  return [
    {
      name: 'commitHook',
      type: 'toggle',
      message: TEXT.PROMPT_USE_COMMIT_VALIDATE,
      initial: true,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'commitMessage',
      type: 'toggle',
      message: TEXT.PROMPT_USE_MESSAGE_CHECK,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getConfirmAdd(): PromptObject[] {
  return [
    {
      name: 'confirm',
      type: 'toggle',
      message: TEXT.PROMPT_CONFIRM_ADD_FEATURES,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getSavePreset(): PromptObject[] {
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
export function getInstall(): PromptObject[] {
  const result: PromptObject[] = [
    {
      name: 'install',
      type: 'toggle',
      message: TEXT.PROMPT_INSTALL_NOW,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
  const choices: any = []
  if (!isPnpmWorkspaceRepo()) {
    for (const pm of getPackageManagers()) {
      choices.push({ title: pm, value: pm })
    }
    result.push({
      name: 'packageManager',
      type: (_: any, values: Answers<any>) =>
        values.install ? 'select' : null,
      initial: 0,
      message: TEXT.PROMPT_SELECT_PACKAGE_MANAGER,
      choices,
      hint: ' '
    })
  }
  return result
}

export function getRemoveFormat(): PromptObject[] {
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
export function getRemoveCommit(): PromptObject[] {
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
export function getConfirmRemove(): PromptObject[] {
  return [
    {
      name: 'confirm',
      type: 'toggle',
      message: TEXT.PROMPT_CONFIRM_REMOVE_FEATURES,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }
  ]
}
export function getUninstall(): PromptObject[] {
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
