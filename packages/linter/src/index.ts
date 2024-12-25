#!/usr/bin/env node
import { cac } from 'cac'
import PKG from '../package.json'
import add from './command/add'
import init from './command/init'
import remove from './command/remove'
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
      console.log('clear')
    })

  cli.help(() => {})

  cli.parse()
}

run()
