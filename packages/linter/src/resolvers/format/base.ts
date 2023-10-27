import type { TConfigResolverData } from '../../utils'

export function formatBase(
  configData: TConfigResolverData,
  userConfigs: { environment: string }
) {
  // eslint-disable-next-line no-param-reassign
  configData.packages = configData.packages.concat([
    'eslint@8.35.0',
    'eslint-config-airbnb-base@15.0.0',
    'eslint-config-prettier@8.6.0',
    'eslint-plugin-import@2.27.5'
  ])
  // eslint-disable-next-line no-param-reassign
  configData.eslintOverrides = {
    env: { es2021: true },
    extends: ['airbnb-base'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'import/order': 0,
      'import/no-unresolved': 0,
      'import/extensions': 0,
      'func-names': ['warn', 'never'],
      'import/prefer-default-export': 0,
      'no-restricted-syntax': 0,
      'default-case': 0,
      'vue/multi-word-component-names': 0,
      'vue/no-multiple-template-root': 0,
      'vue/no-v-model-argument': 0,
      'vue/no-reserved-component-names': 0,
      'import/no-extraneous-dependencies': 0,
      'no-plusplus': 0
    }
  }
  if (userConfigs.environment === 'web' && configData.eslintOverrides.env) {
    // eslint-disable-next-line no-param-reassign
    configData.eslintOverrides.env.browser = true
  }
  if (userConfigs.environment === 'node' && configData.eslintOverrides.env) {
    // eslint-disable-next-line no-param-reassign
    configData.eslintOverrides.env.node = true
  }
}
