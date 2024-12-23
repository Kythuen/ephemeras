#!/usr/bin/env node
import { Profile } from '@ephemeras/profile'
import { cac } from 'cac'
import PKG from '../package.json'
import init from './command/init'
import TEXT from './locales/text'
import { prettifyOutput } from './utils'

async function run() {
  const { name = '', version = '' } = PKG
  const cli = cac(name).version(version)
  const profile = new Profile({ path: '.ephemeras/linter/preset.json' })

  cli
    .command('[root]')
    .option('-i, --init', TEXT.USAGE_ROOT_OPTION_INITIAL)
    .option('-c, --clear', TEXT.USAGE_ROOT_OPTION_INITIAL)
    .action((_: string, options: Record<string, any>) => {
      if (options.init) {
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
      prettifyOutput(init, profile)
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
