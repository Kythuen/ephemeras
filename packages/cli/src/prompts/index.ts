import prompts, { type PromptObject } from 'prompts'
import { print } from '../utils'
import {
  PROMPTS_NAME,
  PROMPTS_OVERWRITE,
  PROMPTS_TYPE,
  PROMPTS_WEB,
  PROMPTS_CLI
} from './constant'

type PromptKey =
  | 'ProjectName'
  | 'Overwrite'
  | 'ProjectType'
  | 'TemplateWeb'
  | 'TemplateCli'

export function getPrompts(key: PromptKey) {
  switch (key) {
    case 'ProjectName':
      return PROMPTS_NAME
    case 'Overwrite':
      return PROMPTS_OVERWRITE
    case 'ProjectType':
      return PROMPTS_TYPE
    case 'TemplateWeb':
      return PROMPTS_WEB
    case 'TemplateCli':
      return PROMPTS_CLI
  }
}

export function answerPrompts(questions: PromptObject[]) {
  return prompts(questions, {
    onCancel: () => {
      print('❌ Cancel operation', 1, 1)
      process.exit(0)
    }
  })
}
