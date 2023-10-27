import { deepMerge, TConfigResolverData } from '../../utils'

export function formatVue(configData: TConfigResolverData) {
  const config = {
    env: {
      'vue/setup-compiler-macros': true
    },
    extends: ['plugin:vue/vue3-recommend'],
    plugins: ['vue'],
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/no-multiple-template-root': 0,
      'vue/no-v-model-argument': 0,
      'vue/no-reserved-component-names': 0
    }
  }
  // eslint-disable-next-line no-param-reassign
  configData.eslintOverrides = deepMerge(configData.eslintOverrides, config, {
    arrayStrategy: 'concat'
  })
  configData.packages.push('eslint-plugin-vue@9.13.0')
}
