import prompts, { PromptObject } from 'prompts'

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
