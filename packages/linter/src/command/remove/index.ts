import execa from 'execa'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { intro, spinner, note, outro } from '@clack/prompts'
import { bgYellow, black } from 'picocolors'
import {
  readPKG,
  getPackageManager,
  isPnpmWorkspaceRepo
} from '@ephemeras/utils'
import TEXT from '../../locales/text'
import {
  supportFeatures,
  featuresMap,
  TFeature,
  cancelHandler
} from '../common'
import {
  listIntersection,
  ConfigResolver,
  removePackagesVersion
} from '../../utils'
import { removeFeaturesPrompt, TRemoveFeaturesPrompt } from './prompts'
import removeCommitFeature from './commit'
import removeFormatFeature from './format'

export default async function remove(features: TFeature | TFeature[]) {
  const resolveFeatures: TFeature[] = listIntersection<TFeature>(
    [...supportFeatures],
    features
  )
  const removeFeatures: string = resolveFeatures
    .map((i: TFeature) => featuresMap[i])
    .join(' & ')

  const promptTitle = resolveFeatures.length
    ? ` ${TEXT.REMOVE_FEATURES}: ${resolveFeatures
        .map((i: TFeature) => featuresMap[i])
        .join(' & ')} `
    : TEXT.REMOVE_FEATURES

  intro(`${bgYellow(black(promptTitle))}`)

  const prompts = (await removeFeaturesPrompt(
    resolveFeatures,
    removeFeatures
  )) as TRemoveFeaturesPrompt
  cancelHandler(prompts)

  let selectedFeatures = resolveFeatures
  if (
    (typeof prompts === 'boolean' && !prompts) ||
    (typeof prompts !== 'boolean' && !prompts.confirm)
  ) {
    process.exit(0)
  }
  if (typeof prompts !== 'boolean') {
    selectedFeatures = prompts.features
  }

  const resolver = new ConfigResolver()
  if (selectedFeatures.includes('commit')) {
    const s = spinner()
    s.start(`${TEXT.COMMON_FEATURE_COMMIT}...`)
    const logs = await removeCommitFeature(resolver)
    s.stop(`${TEXT.COMMON_FEATURE_COMMIT}`)
    logs.length && note(logs)
  }
  if (selectedFeatures.includes('format')) {
    const s = spinner()
    s.start(`${TEXT.COMMON_FEATURE_FORMAT}...`)
    const logs = await removeFormatFeature(resolver)
    s.stop(`${TEXT.COMMON_FEATURE_FORMAT}`)
    logs.length && note(logs)
  }

  if (existsSync(resolve(process.cwd(), 'node_modules'))) {
    const { packages } = resolver.data
    const { devDependencies } = await readPKG(process.cwd())
    if (!devDependencies || !Object.keys(devDependencies).length)
      process.exit(0)

    const resolvePackage = listIntersection(
      Object.keys(devDependencies),
      removePackagesVersion(packages)
    )
    if (resolvePackage.length) {
      const pm = getPackageManager()
      const s = spinner()
      s.start(`remove dependencies via ${pm}`)
      const args = pm === 'npm' ? ['uninstall', '--save-dev'] : ['remove', '-D']
      if (pm === 'pnpm' && isPnpmWorkspaceRepo()) {
        args.push('-w')
      }
      await execa('pnpm', [...args, ...resolvePackage], { encoding: 'utf8' })
      s.stop('successfully remove dependencies')
    }
  }
  outro(TEXT.COMMON_TIP_REMOVE_DONE)
}
