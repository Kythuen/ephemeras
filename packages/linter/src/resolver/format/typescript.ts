import type { ConfigResolver } from '..'
import type { PromptData } from '../../types'
import { copyItemToPWD, removeItemFromPWD } from '../../utils'

export function formatTypescript(
  resolver: ConfigResolver,
  data: Partial<PromptData>
) {
  if (data.environment?.includes('browser')) {
    resolver.data.languages.push('typescript')
  }
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@types/node', version: '20.4.5' },
    { name: 'typescript', version: '5.0.2' }
  ])
  resolver.tasks.add.push(() => copyItemToPWD('tsconfig.json'))
  resolver.tasks.remove.push(() => removeItemFromPWD('tsconfig.json'))
}
