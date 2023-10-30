import colors from 'picocolors'
import prompts, { PromptObject } from 'prompts'
import gradient from 'gradient-string'
import TEXT from '../locales/text'

const { bold } = colors
const { vice, retro } = gradient

export async function prettifyOutput(fn: Function, ...args: any) {
  console.log()
  if (['AsyncFunction', 'Promise'].includes(fn.constructor.name)) {
    await fn(...args)
  } else {
    fn(...args)
  }
  console.log()
}

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

export function welcomeText(text: string) {
  return bold(retro(text))
}
export function boldText(text: string) {
  return bold(text)
}
export function endText(text: string) {
  return bold(vice(text))
}
