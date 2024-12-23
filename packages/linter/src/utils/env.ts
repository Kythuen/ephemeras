import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function readPKG(context = process.cwd()) {
  try {
    const url = resolve(context, 'package.json')
    const content = readFileSync(url, { encoding: 'utf-8' })
    return JSON.parse(content)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error('Cannot find package.json file.')
    } else {
      throw new Error(`Failed to read package.json: ${err.message}.`)
    }
  }
}

const PM_LOCK_FILES = {
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
  npm: 'package-lock.json'
}
export function getPackageManager(context = process.cwd()) {
  let result = 'pnpm'
  for (const pm in PM_LOCK_FILES) {
    const filePath = resolve(context, (PM_LOCK_FILES as any)[pm])
    if (!existsSync(filePath)) continue
    result = pm
    break
  }
  return result
}

export function getPackageManagers() {
  const result = []
  for (const cmd of Object.keys(PM_LOCK_FILES)) {
    try {
      execSync(`${cmd} -v`, { stdio: 'ignore' })
      result.push(cmd)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      // console.log(e.message)
    }
  }
  return result
}

const PNPM_WORKSPACE_CONFIG_FILES = [
  'pnpm-workspace.yaml',
  'pnpm-workspace.json',
  'pnpm-workspace.js',
  'pnpm-workspace.config.js'
]
export function isPnpmWorkspaceRepo(context = process.cwd()) {
  const { workspaces } = readPKG()
  if (workspaces) return true
  for (const file of PNPM_WORKSPACE_CONFIG_FILES) {
    const filePath = resolve(context, file)
    if (!existsSync(filePath)) continue
    return true
  }
  return false
}
