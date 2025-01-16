import type { PromptObject, Answers } from 'prompts'
import { profile } from '../utils/profile'

export const PROMPTS_NAME: PromptObject[] = [
  {
    name: 'name',
    type: 'text',
    message: 'input project name:',
    validate: (value: string) => {
      if (!value) return 'please input project name'
      if (value.length < 3)
        return 'project name should have at least 3 characters'
      return true
    }
  }
]
export const PROMPTS_OVERWRITE: PromptObject[] = [
  {
    name: 'overwrite',
    type: 'toggle',
    message: 'directory already exists, overwrite it?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  }
]
export const PROMPTS_TYPE: PromptObject[] = [
  {
    name: 'type',
    type: 'select',
    message: 'select project type:',
    choices: ['web', 'lib', 'cli'].map(i => ({ title: i, value: i }))
  },
  {
    name: 'unocss',
    type: (_: any, values: Answers<'type'>) =>
      values.type === 'web' ? 'toggle' : null,
    message: 'use unocss?',
    initial: true,
    active: 'yes',
    inactive: 'no'
  }
]
export const PROMPTS_WEB: PromptObject[] = [
  {
    name: 'author',
    type: 'select',
    message: 'select authors:',
    choices: (profile.get('authors') || ['Kythuen 616332192@qq.com']).map(
      (i: string) => {
        const [user] = i.split(/\s+/)
        return {
          title: user,
          value: i
        }
      }
    )
  },
  {
    name: 'repo',
    type: 'text',
    message: 'input repositories url:'
  },
  {
    name: 'open',
    type: 'toggle',
    message: 'open source?',
    initial: true,
    active: 'yes',
    inactive: 'no'
  },
  {
    name: 'license',
    type: (_: any, values: Answers<'open'>) => (values.open ? 'select' : null),
    message: 'select a license',
    choices: (profile.get('licenses') || ['MIT', 'Apache2']).map(
      (i: string) => ({
        title: i,
        value: i
      })
    )
  }
]
