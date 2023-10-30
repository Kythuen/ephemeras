import { deepMerge, TConfigResolverData } from '../../utils'

export function formatTypeScript(configData: TConfigResolverData) {
  const config = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser'
    },
    plugins: ['@typescript-eslint']
  }
  // eslint-disable-next-line no-param-reassign
  configData.eslintOverrides = deepMerge(configData.eslintOverrides, config, {
    arrayStrategy: 'concat'
  })
  // eslint-disable-next-line no-param-reassign
  configData.packages = configData.packages.concat([
    '@types/node@20.4.5',
    '@typescript-eslint/eslint-plugin@5.54.0',
    '@typescript-eslint/parser@5.54.0',
    'typescript@5.0.2'
  ])
}
