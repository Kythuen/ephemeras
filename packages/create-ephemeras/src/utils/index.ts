import { promisify } from 'node:util'
import { execFile } from 'node:child_process'

export function print(text: string, afterLine = 0, beforeLine = 0) {
  Array.from({ length: beforeLine }).forEach(() => console.log())
  console.log(text)
  Array.from({ length: afterLine }).forEach(() => console.log())
}
const asyncExecFile = promisify(execFile)
export async function setPkg(field: string, script: string) {
  return asyncExecFile('npm', ['pkg', 'set', `${field}=${script}`])
}
export async function runCmd(cmd: string, args: string[]) {
  return asyncExecFile(cmd, args)
}
export function getRepoInfo(url: string) {
  const trimmedUrl = url.replace(/\/+$/, '')

  const gitMatch = trimmedUrl.match(
    /(?:https?:\/\/|git@)([^/:]+)[:/](.*?)(?:\.git)?$/i
  )

  if (gitMatch && gitMatch[2]) {
    const parts = gitMatch[2].split('/')
    if (parts.length >= 2) {
      return {
        user: parts[0],
        repo: parts.slice(1).join('/')
      }
    }
  }

  return { user: '', repo: '' }
}
