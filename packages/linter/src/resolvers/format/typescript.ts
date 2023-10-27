import { deepMerge, TConfigResolverData } from '../../utils'

export function formatTypeScript(configData: TConfigResolverData) {
  const config = {
    parserOptions: {
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
    '@typescript-eslint/eslint-plugin@5.54.0',
    '@typescript-eslint/parser@5.54.0',
    'typescript@5.0.2'
  ])
}
