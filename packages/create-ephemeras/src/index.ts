#!/usr/bin/env node
import { cac } from 'cac'
import { description, name, version } from '../package.json'
import { config } from './commands/config'
import { root } from './commands/root'

async function run() {
  const cli = cac(name).version(version)

  cli
    .command('[root]', description)
    .option('-o, --online', 'use online template')
    .example('  $ create-ephemeras --online')
    .action(root)

  cli
    .command('config [key] [value]', 'global config for create ephemeras')
    .option('--list', 'display all existing configs')
    .option('--get', 'get config item')
    .option('--unset', 'remove config item')
    .example('  $ create-ephemeras config --list')
    .example('  $ create-ephemeras config --get language')
    .example('  $ create-ephemeras config language zh-CN')
    .example('  $ create-ephemeras --unset language')
    .action((key: string, value: string, options: Record<string, any>) => {
      if (!key && Object.keys(options).length === 1) {
        cli.outputHelp()
        return
      }
      config(key, value, options)
    })

  cli.help(() => {})

  cli.parse()
}

run()
