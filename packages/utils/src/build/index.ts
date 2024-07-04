import { resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { PM_LOCK_FILES, PNPM_WORKSPACE_CONFIG_FILES } from './constant'

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
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.log(e.message)
    }
  }
  return result
}

export function isPnpmWorkspaceRepo(context = process.cwd()) {
  const { workspaces } = readPKG(context)
  console.log(workspaces)
  if (workspaces) {
    return true
  }
  for (const file of PNPM_WORKSPACE_CONFIG_FILES) {
    const filePath = resolve(context, file)
    if (!existsSync(filePath)) continue
    return true
  }
  return false
}

export function isProject(contextPath: string = process.cwd()) {
  return existsSync(resolve(contextPath, 'package.json'))
}
