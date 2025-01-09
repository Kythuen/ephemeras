#!/usr/bin/env node
import { cac } from 'cac'
import init from './commands/init'
import { name, version } from '../package.json'

async function run() {
  const cli = cac(name).version(version)

  cli
    .command('[root]')
    .option('-i, --init', 'init readme file')
    .example('  $ readme --init')
    .allowUnknownOptions()
    .action((_: string, options: Record<string, any>) => {
      if (!options.init) {
        cli.outputHelp()
        return
      }
      init()
    })

  cli
    .command('init', 'init readme file')
    .example('  $ linter init')
    .action(() => {
      init()
    })

  cli.help(() => {})

  cli.parse()
}

run()

export { init }
