import { ConfigResolver } from '../../resolver'
import type { PromptData } from '../../types'
import { formatBase, formatVue, formatTypescript } from '../../resolver'

export default function (resolver: ConfigResolver, data: PromptData) {
  if (data.features.includes('format')) {
    resolver.use(formatBase, data)
  }
  if (data.framework === 'vue') {
    resolver.use(formatVue, data)
  }
  if (data.typescript) {
    resolver.use(formatTypescript, data)
  }
}
