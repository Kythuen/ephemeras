import type { ConfigResolver } from '..'
import type { PromptData } from '../../types'
import { copyItemsToPWD } from '../../utils'

export function formatTypescript(resolver: ConfigResolver, data: PromptData) {
  if (data.environment.includes('browser')) {
    resolver.data.languages.push('typescript')
  }
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@types/node', version: '20.4.5' },
    { name: 'typescript', version: '5.0.2' }
  ])
  resolver.tasks.addTask(() => copyItemsToPWD([{ path: 'tsconfig.json' }]))
}
