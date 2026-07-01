import { promisify } from 'node:util'
import { execFile } from 'node:child_process'

const execOptions = { shell: true }
const asyncExecFile = promisify(execFile)
export async function setPkg(field: string, script: string) {
  return asyncExecFile('npm', ['pkg', 'set', `${field}=${script}`], execOptions)
}
export async function deletePkgFiled(field: string) {
  return asyncExecFile('npm', ['pkg', 'delete', field], execOptions)
}
export async function getPkgFiled(field: string) {
  const { stdout, stderr } = await asyncExecFile(
    'npm',
    ['pkg', 'get', field],
    execOptions
  )
  if (!stderr) return stdout
  return stderr
}
export async function runCmd(cmd: string, args: string[]) {
  return asyncExecFile(cmd, args)
}
