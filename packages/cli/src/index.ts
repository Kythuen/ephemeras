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
    .option('--source <context>', 'use private template repo')
    .option('--context <context>', 'context directory of current operation')
    .example('  $ create-ephemeras --online')
    .example('  $ create-ephemeras --context sub')
    .action(root)

  cli
    .command('config [key] [value]', 'global config for create ephemeras')
    .option('-l, --list', 'display all existing configs')
    .option('-d, --delete', 'remove config item')
    .example('  $ create-ephemeras config --list')
    .example('  $ create-ephemeras config authors')
    .example('  $ create-ephemeras config license.0 MIT')
    .example('  $ create-ephemeras config authors.0 -d')
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
