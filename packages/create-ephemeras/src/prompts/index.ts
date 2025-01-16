import prompts, { type PromptObject } from 'prompts'
import {
  PROMPTS_OVERWRITE,
  PROMPTS_NAME,
  PROMPTS_TYPE,
  PROMPTS_WEB
} from './constant'

type PromptKey = 'ProjectName' | 'Overwrite' | 'ProjectType' | 'WebTemplate'

export function getPrompts(key: PromptKey) {
  switch (key) {
    case 'ProjectName':
      return PROMPTS_NAME
    case 'Overwrite':
      return PROMPTS_OVERWRITE
    case 'ProjectType':
      return PROMPTS_TYPE
    case 'WebTemplate':
      return PROMPTS_WEB
  }
}

export function answerPrompts(questions: PromptObject[]) {
  return prompts(questions, {
    onCancel: () => {
      console.log()
      console.log('❌ Cancel operation')
      console.log()
      process.exit(0)
    }
  })
}
