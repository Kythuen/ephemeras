export async function prettifyOutput(fn: Function, ...args: any) {
  console.log()
  if (['AsyncFunction', 'Promise'].includes(fn.constructor.name)) {
    await fn(...args)
  } else {
    fn(...args)
  }
  console.log()
}
