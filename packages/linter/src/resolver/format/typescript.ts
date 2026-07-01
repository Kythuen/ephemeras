import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ConfigResolver } from '..'
import type { PromptData } from '../../types'
import {
  copyItemToPWD,
  removeItemFromPWD,
  CURRENT_NODE_VERSIONS
} from '../../utils'

export function formatTypescript(
  resolver: ConfigResolver,
  data: Partial<PromptData>
) {
  if (data.environment?.includes('browser')) {
    resolver.data.languages.push('typescript')
  }
  resolver.data.packages = resolver.data.packages.concat([
    { name: '@types/node', version: CURRENT_NODE_VERSIONS['@types/node'] },
    { name: 'typescript', version: CURRENT_NODE_VERSIONS['typescript'] }
  ])
  if (!existsSync(join(process.cwd(), 'tsconfig.json'))) {
    resolver.tasks.add.push(() => copyItemToPWD('tsconfig.json'))
    resolver.tasks.remove.push(() => removeItemFromPWD('tsconfig.json'))
  }
}
