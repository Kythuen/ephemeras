#!/usr/bin/env node
import { cac } from 'cac'
import PKG from '../package.json'
import add from './command/add'
import init from './command/init'
import remove from './command/remove'
import preset from './command/preset'
import config from './command/config'
import TEXT from './locales/text'
import type { LintFeature } from './types'
import { prettifyOutput } from './utils'

async function run() {
  const { name, version } = PKG
  const cli = cac(name).version(version)

  cli
    .command('[root]')
    .option('-i, --init', TEXT.USAGE_ROOT_OPTION_INITIAL)
    .option('-c, --clear', TEXT.USAGE_ROOT_OPTION_INITIAL)
    .action((_: string, options: Record<string, any>) => {
      if (options.init) {
        prettifyOutput(init)
        return
      }
      if (options.clear) {
        prettifyOutput(remove, ['format', 'commit'])
        return
      }
      prettifyOutput(() => {
        cli.outputHelp()
      })
    })

  cli
    .command('init', TEXT.USAGE_COMMAND_INITIAL)
    .example('  $ linter init')
    .action(() => {
      prettifyOutput(init)
    })

  cli
    .command('add [...features]', TEXT.USAGE_COMMAND_ADD)
    .example('  $ linter add format')
    .example('  $ linter add commit')
    .example('  $ linter add format commit')
    .action(async (features: LintFeature[]) => {
      prettifyOutput(add, undefined, features)
    })

  cli
    .command('remove [...features]', TEXT.USAGE_COMMAND_REMOVE)
    .example('  $ linter remove format')
    .example('  $ linter remove commit')
    .example('  $ linter remove format commit')
    .action((features: LintFeature[]) => {
      prettifyOutput(remove, features)
    })

  cli
    .command('clear', TEXT.USAGE_COMMAND_CLEAR)
    .example('  $ linter clear')
    .action(() => {
      prettifyOutput(remove, ['format', 'commit'])
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
    .action((presetName: string, args: Record<string, any>) => {
      if (!presetName && Object.keys(args).length === 1) {
        prettifyOutput(() => cli.outputHelp())
        return
      }
      prettifyOutput(preset, presetName, args)
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
    .action(
      (configKey: string, configValue: string, args: Record<string, any>) => {
        if (!configKey && Object.keys(args).length === 1) {
          prettifyOutput(() => cli.outputHelp())
          return
        }
        prettifyOutput(config, configKey, configValue, args)
      }
    )

  cli.help(() => {})

  cli.parse()
}

run()
