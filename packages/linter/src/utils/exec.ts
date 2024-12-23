import { promisify } from 'node:util'
import { execFile } from 'node:child_process'

const asyncExecFile = promisify(execFile)
export async function setPkg(field: string, script: string) {
  return asyncExecFile('npm', ['pkg', 'set', `${field}=${script}`])
}
export async function runCmd(cmd: string, args: string[]) {
  return asyncExecFile(cmd, args)
}
