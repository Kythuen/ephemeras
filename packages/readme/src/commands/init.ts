import { readJSON } from '@ephemeras/fs'
import { FileParser, nunjucks, prettier } from '@ephemeras/parser'
import { join, resolve } from 'node:path'
import { resolveConfig } from 'prettier'
import { pascal, title } from 'radash'
import { DEFAULT_OPTIONS, PROJECT_ROOT } from '../constants'
import { getPrompt } from '../prompts'
import { answerPrompts } from '../utils'

export default async function (data: Record<string, any> = {}) {
  const { name, description = '' } = await readJSON(
    join(process.cwd(), 'package.json')
  )
  data = {
    ...DEFAULT_OPTIONS,
    name,
    description,
    ...data
  }

  const promptData = await answerPrompts(getPrompt(data))
  console.log(promptData)
  const namePascal = pascal(title(promptData.name)) || ''

  const prettierOptions =
    (await resolveConfig(join(process.cwd(), '.prettierrc'))) || {}

  const parser = new FileParser({
    source: resolve(PROJECT_ROOT, 'files', 'README.md'),
    destination: resolve(process.cwd(), 'README.md'),
    overwrite: true
  })
  parser
    .use(
      nunjucks({
        ...data,
        namePascal
      })
    )
    .use(prettier({ prettier: prettierOptions }))

  await parser.build()
}
