import type { ConfigResolver } from '..'
import { CURRENT_NODE_VERSIONS } from '../../utils'

export function formatVue(resolver: ConfigResolver) {
  resolver.data.extensions = resolver.data.extensions.concat(['Vue.volar'])
  resolver.data.languages = resolver.data.languages.concat(['vue'])
  resolver.data.packages.push({ name: 'eslint-plugin-vue', version: CURRENT_NODE_VERSIONS['eslint-plugin-vue'] })
}
