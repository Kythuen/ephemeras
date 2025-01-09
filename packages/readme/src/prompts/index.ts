import type { PromptObject, Choice, Answers } from 'prompts'
import type { Options } from '../types'

function getSimpleChoices(items: string[], data: string[] = []) {
  const result: Choice[] = []

  items.forEach(item => {
    result.push({
      title: item,
      value: item,
      selected: data.includes(item)
    })
  })

  return result
}

export function getPrompt(data: Partial<Options>) {
  const result: PromptObject[] = [
    {
      name: 'name',
      type: 'text',
      message: 'project name:',
      initial: data.name || '',
      validate: (value: string) => {
        if (!value) return 'project name is required'
        if (value.length < 3) return 'no too short project name'
        return true
      }
    },
    {
      name: 'description',
      type: 'text',
      message: 'project description:',
      initial: data.description || '',
      validate: (value: string) => {
        if (!value) return 'project description is required'
        if (value.length < 3) return 'no too short project description'
        return true
      }
    },
    {
      name: 'logo',
      type: 'text',
      message: 'project logo:',
      initial: data.logo || '',
      validate: (value: string) => {
        if (!value) return 'project logo is required'
        return true
      }
    },
    {
      name: 'contents',
      type: 'multiselect',
      message: 'select content sections:',
      min: 1,
      instructions: false,
      choices: getSimpleChoices(
        [
          'Introduction',
          'Preview',
          'Features',
          'GettingStarted',
          'Questions',
          'Contribution',
          'License'
        ],
        data.contents
      )
    },
    {
      name: 'badges',
      type: 'toggle',
      message: 'add social badges?',
      initial: data.badges,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'social',
      type: (_: any, values: Answers<any>) =>
        values.badges ? 'multiselect' : null,
      instructions: false,
      message: 'select social badges:',
      choices: getSimpleChoices(['npm', 'github', 'juejin'], data.social)
    },
    {
      name: 'npm',
      type: (_: any, values: Answers<any>) =>
        values.social?.includes('npm') ? 'text' : null,
      message: 'input npm account:',
      initial: data.npm || ''
    },
    {
      name: 'github',
      type: (_: any, values: Answers<any>) =>
        values.social?.includes('github') ? 'text' : null,
      message: 'input github account:',
      initial: data.github || ''
    },
    {
      name: 'juejin',
      type: (_: any, values: Answers<any>) =>
        values.social?.includes('juejin') ? 'text' : null,
      message: 'input juejin account:',
      initial: data.juejin || ''
    },
    {
      name: 'build',
      type: (_: any, values: Answers<any>) =>
        values.badges ? 'multiselect' : null,
      instructions: false,
      message: 'select build badges:',
      choices: getSimpleChoices(['github-actions', 'codecov'], data.build)
    },
    {
      name: 'locales',
      type: 'multiselect',
      message: 'select locales:',
      instructions: false,
      choices: getSimpleChoices(['en', 'zh'], data.locales)
    }
  ]

  return result
}
