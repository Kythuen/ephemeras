import { ConfigResolver } from '../../resolver'
import type { PromptData } from '../../types'
import { commitBase } from '../../resolver'

export default function (resolver: ConfigResolver, data: PromptData) {
  if (data.features.includes('commit')) {
    resolver.use(commitBase, data)
  }
}
