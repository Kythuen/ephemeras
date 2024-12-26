import colors from 'picocolors'
const { bold, gray } = colors

export async function prettifyOutput(fn: Function, ...args: any) {
  console.log()
  if (['AsyncFunction', 'Promise'].includes(fn.constructor.name)) {
    await fn(...args)
  } else {
    fn(...args)
  }
  console.log()
}

export function Bold(text: string) {
  return bold(text)
}
export function Gray(text: string) {
  return gray(text)
}
