import execa from 'execa'
import { intro, spinner, note, outro } from '@clack/prompts'
import {
  getPackageManagers,
  isPnpmWorkspaceRepo,
  Profile
} from '@ephemeras/utils'
import { bgGreen, black, underline, cyan } from 'picocolors'
import {
  supportFeatures,
  featuresMap,
  TFeature,
  cancelHandler
} from '../common'
import TEXT from '../../locales/text'
import { listIntersection, ConfigResolver } from '../../utils'
import {
  addFeaturesPrompt,
  installNowPrompt,
  selectPMPrompt,
  saveAsPresetPrompt
} from './prompts'
import addCommitFeature from './commit'
import addFormatFeature from './format'

export default async function add(
  features: TFeature | TFeature[],
  profile: Profile
) {
  const resolveFeatures: any = listIntersection<TFeature>(
    [...supportFeatures],
    features
  )
  const promptTitle = resolveFeatures.length
    ? ` ${TEXT.ADD_FEATURES}: ${resolveFeatures
        .map((i: TFeature) => featuresMap[i])
        .join(' & ')} `
    : TEXT.ADD_FEATURES

  intro(`${bgGreen(black(promptTitle))}`)

  const featurePrompts = await addFeaturesPrompt(resolveFeatures, profile)
  cancelHandler(featurePrompts)

  let combineFeatures = featurePrompts
  if (featurePrompts.preset) {
    combineFeatures = { ...profile.get(featurePrompts.preset).configs }
    if (!featurePrompts.features.includes('commit')) {
      combineFeatures.commit = false
    }
    if (!featurePrompts.features.includes('format')) {
      combineFeatures.format = false
      combineFeatures.environment = ''
      combineFeatures.typescript = false
      combineFeatures.vue = false
      combineFeatures.style = ''
    }
  }

  const resolver = new ConfigResolver()

  if (combineFeatures.commit) {
    const s = spinner()
    s.start(`${TEXT.COMMON_FEATURE_COMMIT}...`)
    const logs = await addCommitFeature(resolver)
    s.stop(`${TEXT.COMMON_FEATURE_COMMIT}:`)
    note(logs)
  }

  if (combineFeatures.format) {
    const s = spinner()
    s.start(`${TEXT.COMMON_FEATURE_FORMAT}...`)
    const logs = await addFormatFeature(resolver, combineFeatures)
    s.stop(`${TEXT.COMMON_FEATURE_FORMAT}...`)
    note(logs)
  }

  if (!featurePrompts.preset) {
    // const save = await confirmSavePresetPrompt()
    // cancelHandler(save)
    // if (save) {
    //   const name = (await presetNamePrompt()) as string
    //   cancelHandler(name)
    //   const description = (await presetDescriptionPrompt()) as string
    //   cancelHandler(name)
    //   note(`📦 ${TEXT.PRESET_ADD_PRESET} [${name}]:${description}`)
    //   const { environment, typescript, vue, style, commit, format } =
    //     featurePrompts
    //   profile.set(name, {
    //     value: name,
    //     label: name,
    //     hint: description,
    //     configs: { environment, typescript, vue, style, commit, format }
    //   })
    // }

    const savePrompts = await saveAsPresetPrompt()
    cancelHandler(savePrompts)
    if (savePrompts.save) {
      const { name, description }: any = savePrompts
      note(`📦 ${TEXT.PRESET_ADD_PRESET} [${name}]:${description}`)
      const { environment, typescript, vue, style, commit, format } =
        featurePrompts
      profile.set(name, {
        value: name,
        label: name,
        hint: description,
        configs: { environment, typescript, vue, style, commit, format }
      })
    }
  }

  if (resolver.data.packages.length) {
    const install = await installNowPrompt()
    cancelHandler(install)
    if (install) {
      const pms = getPackageManagers()
      if (!pms.length) {
        process.exit(0)
      }
      if (pms.length) {
        const pm = await selectPMPrompt(pms)
        cancelHandler(pm)
        if (pm) {
          const { packages } = resolver.data
          const s = spinner()
          s.start(`${TEXT.COMMON_TIP_ADD_INSTALL_TIP} ${pm}`)
          const args = pm === 'npm' ? ['install', '--save-dev'] : ['add', '-D']
          if (pm === 'pnpm' && (await isPnpmWorkspaceRepo())) {
            args.push('-w')
          }
          await execa(pm as string, [...args, ...packages], {
            encoding: 'utf8'
          })

          s.stop(TEXT.COMMON_TIP_ADD_INSTALL_DONE)
          outro(`${TEXT.COMMON_TIP_ADD_DONE} 🎉`)
        }
      }
    } else {
      const { packages } = resolver.data
      const args = ['add', '-D']
      if (await isPnpmWorkspaceRepo()) {
        args.push('-w')
      }

      note(`pnpm ${args.join(' ')}\n${packages.join('\n')}`, 'Next steps')
      outro(
        `Problems? ${underline(
          cyan('https://github.com/Kythuen/ephemeras/issues')
        )}`
      )
      console.log(TEXT.COMMON_TIP_INSTALL_LATER)
      console.log()
      console.log(`pnpm ${args.join(' ')} ${packages.join(' ')}\n`)
    }
  } else {
    outro(TEXT.COMMON_TIP_NOT_CHANGE)
  }
}
