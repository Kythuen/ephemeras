#!/usr/bin/env node
import { cac } from 'cac'
import { readPKG, Profile } from '@ephemeras/utils'
import TEXT from './locales/text'
import init from './command/init'
import add from './command/add'
import remove from './command/remove'
import preset from './command/preset'
import config from './command/config'
import { prettifyOutput } from './utils'
import type { TFeature } from './command/common'

async function run() {
  const { name = '', version = '' } = readPKG()
  const cli = cac(name).version(version)
  const profile = new Profile({ path: '.ephemeras/linter/preset.json' })

  cli
    .command('[root]')
    .option('-i, --init', TEXT.USAGE_ROOT_OPTION_INITIAL)
    .option('-c, --clear', TEXT.USAGE_ROOT_OPTION_CLEAR)
    .example('  $ linter --init')
    .example('  $ linter --clear')
    .allowUnknownOptions()
    .action((_: string, options: Record<string, any>) => {
      if (!options.init && !options.clear) {
        prettifyOutput(() => cli.outputHelp())
        return
      }
      if (options.clear) {
        prettifyOutput(remove, ['format', 'commit'])
        return
      }
      prettifyOutput(init, profile)
    })

  cli
    .command('init', TEXT.USAGE_COMMAND_INITIAL)
    .example('  $ linter init')
    .action(() => {
      prettifyOutput(init, profile)
    })

  cli
    .command('clear', TEXT.USAGE_COMMAND_CLEAR)
    .example('  $ linter clear')
    .action(() => {
      prettifyOutput(async () => {
        console.log(TEXT.TIP_WELCOME)
        await remove(['format', 'commit'])
      })
    })

  cli
    .command('add [...features]', TEXT.USAGE_COMMAND_ADD)
    .example('  $ linter add format')
    .example('  $ linter add commit')
    .example('  $ linter add format commit')
    .action(async (features: TFeature[]) => {
      if (!features?.length) {
        prettifyOutput(() => cli.outputHelp())
        return
      }
      prettifyOutput(async () => {
        console.log(TEXT.TIP_WELCOME)
        await add(features, profile)
      })
    })

  cli
    .command('remove [...features]', TEXT.USAGE_COMMAND_REMOVE)
    .example('  $ linter remove format')
    .example('  $ linter remove commit')
    .example('  $ linter remove format commit')
    .action((features: TFeature[]) => {
      if (!features?.length) {
        prettifyOutput(() => cli.outputHelp())
        return
      }
      prettifyOutput(async () => {
        console.log(TEXT.TIP_WELCOME)
        await remove(features)
      })
    })

  cli
    .command('preset [presetName]', TEXT.USAGE_COMMAND_PRESET)
    .option('--list', TEXT.USAGE_COMMAND_PRESET_LIST)
    .option('--add', TEXT.USAGE_COMMAND_PRESET_ADD)
    .option('--edit', TEXT.USAGE_COMMAND_PRESET_EDIT)
    .option('--unset', TEXT.USAGE_COMMAND_PRESET_UNSET)
    .example('  $ linter preset --list')
    .example('  $ linter preset --add')
    .example('  $ linter preset --edit presetName')
    .example('  $ linter preset --unset presetName')
    .action((presetName: string, _: Record<string, any>) => {
      if (!presetName && Object.keys(_).length === 1) {
        prettifyOutput(() => cli.outputHelp())
        return
      }
      prettifyOutput(preset, presetName, _, profile)
    })

  cli
    .command('config [configKey] [configValue]', TEXT.USAGE_COMMAND_CONFIG)
    .option('--list', TEXT.USAGE_COMMAND_CONFIG_LIST)
    .option('--get', TEXT.USAGE_COMMAND_CONFIG_GET)
    .option('--unset', TEXT.USAGE_COMMAND_CONFIG_UNSET)
    .example('  $ linter config --list')
    .example('  $ linter config --get language')
    .example('  $ linter config language zh-CN')
    .example('  $ linter config --unset language')
    .action((configKey: string, configValue: string, _: Record<string, any>) => {
      if (!configKey && Object.keys(_).length === 1) {
        prettifyOutput(() => cli.outputHelp())
        return
      }
      prettifyOutput(config, configKey, configValue, _)
    })

  cli.help(() => {})

  cli.parse()
}

run()
