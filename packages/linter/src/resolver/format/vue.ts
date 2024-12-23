import type { ConfigResolver } from '..'

export function formatVue(resolver: ConfigResolver) {
  resolver.data.extensions = resolver.data.extensions.concat(['Vue.volar'])
  resolver.data.languages = resolver.data.languages.concat(['vue'])
  resolver.data.packages.push({ name: 'eslint-plugin-vue', version: '9.31.0' })
}
