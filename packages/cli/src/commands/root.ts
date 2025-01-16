import { exist } from '@ephemeras/fs'
import { Parser, nunjucks } from '@ephemeras/parser'
import { downloadTemplate } from 'giget'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import ora from 'ora'
import { answerPrompts, getPrompts } from '../prompts'
import { bold, cyan, print, retro, underline, vice } from '../utils'
import { profile } from '../utils/profile'

type RootOptions = {
  online: boolean
  context: string
}
export async function root(
  name: string,
  { online, context = '' }: Partial<RootOptions> = {}
) {
  print(retro('🚀 Welcome to Create Ephemeras'), 1, 1)

  print(bold('💬 Project information:'))
  let projectName = name
  if (!name) {
    projectName = (await answerPrompts(getPrompts('ProjectName'))).name
  }
  const targetDir = resolve(process.cwd(), context, projectName)
  if (await exist(targetDir)) {
    const { overwrite } = await answerPrompts(getPrompts('Overwrite'))
    if (!overwrite) {
      print('❌ Cancel operation', 1, 1)
      process.exit(0)
    }
  }
  const { type, unocss } = await answerPrompts(getPrompts('ProjectType'))

  const TEMPLATE_DIR = resolve(homedir(), '.ephemeras/templates')
  if (online) {
    print(bold('💬 Create web project:'), 0, 1)
    const spinner = ora('download templates ...').start()
    const auth = profile.get('auth')
    if (!auth) {
      print('Kythuen/templates is a private repo, please set the auth key')
    }
    try {
      await downloadTemplate('github:Kythuen/templates/src#feat-web', {
        dir: TEMPLATE_DIR,
        force: true,
        forceClean: true,
        auth
      })
    } catch (e: any) {
      print(`download templates fail.\n${e.message}`)
    }
    spinner.succeed('template update completed')
  }

  const parser = new Parser({
    destination: targetDir,
    clean: true,
    overwrite: true
  })
  switch (type) {
    case 'web': {
      print(bold('💬 Create web project:'), 0, 1)
      const { author, license, repo } = await answerPrompts(
        getPrompts('WebTemplate')
      )
      const [user, email] = author.split(/\s+/)
      const resolveRepo =
        repo || `https://github.com/Kythuen/${projectName}.git`
      parser.source(resolve(TEMPLATE_DIR, unocss ? 'vue-unocss' : 'vue'))
      parser.use(
        nunjucks({ name: projectName, user, email, repo: resolveRepo, license })
      )
      await parser.build()
      break
    }
  }
  print(vice('⚡ successfully create project'), 1, 1)
  print(
    `${bold('Any problem?')} ${underline(
      cyan('https://github.com/Kythuen/ephemeras/issues#cli')
    )}`,
    1
  )
}
