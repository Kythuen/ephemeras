import type { TConfigResolverData } from '../../utils'

export function formatBase(
  configData: TConfigResolverData,
  userConfigs: { environment: string; framework: string }
) {
  configData.extensions.recommendations = configData.extensions.recommendations.concat([
    'EditorConfig.EditorConfig',
    'dbaeumer.vscode-eslint',
    'esbenp.prettier-vscode'
  ])
  configData.packages = configData.packages.concat([
    'eslint@8.35.0',
    'eslint-config-airbnb-base@15.0.0',
    'eslint-config-prettier@8.6.0',
    'eslint-plugin-import@2.27.5',
    'eslint-plugin-prettier@5.1.3',
    'prettier@2.8.8'
  ])
  configData.eslintOverrides = {
    root: true,
    env: { es2021: true },
    extends: ['airbnb-base'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
      'import/no-extraneous-dependencies': 0,
      'import/order': 0,
      'import/extensions': 0,
      'func-names': ['warn', 'never'],
      'import/prefer-default-export': 0,
      'no-restricted-syntax': 0,
      'default-case': 0,
      'no-plusplus': 0
    }
  }
  if (userConfigs.environment.includes('web') && configData.eslintOverrides.env) {
    configData.eslintOverrides.env.browser = true
  }
  if (userConfigs.environment.includes('node') && configData.eslintOverrides.env) {
    configData.eslintOverrides.env.node = true
  }
  if (userConfigs.framework === 'vue' && configData.eslintOverrides.env) {
    configData.eslintOverrides.env['vue/setup-compiler-macros'] = true
  }
}
