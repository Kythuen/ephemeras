import { deepMerge, TConfigResolverData } from '../../utils'

export function formatVue(configData: TConfigResolverData) {
  const config = {
    env: {
      'vue/setup-compiler-macros': true
    },
    extends: ['plugin:vue/vue3-recommended'],
    plugins: ['vue'],
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/no-multiple-template-root': 0,
      'vue/no-v-model-argument': 0,
      'vue/no-reserved-component-names': 0
    }
  }
  configData.extensions.recommendations = configData.extensions.recommendations.concat([
    'Vue.volar'
  ])
  configData.settings = {
    'editor.formatOnSave': true,
    '[html]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[css]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[less]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[javascript]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[typescript]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[vue]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' }
  }
  configData.eslintOverrides = deepMerge(configData.eslintOverrides, config, {
    arrayStrategy: 'concat'
  })
  configData.packages.push('eslint-plugin-vue@9.13.0')
}
