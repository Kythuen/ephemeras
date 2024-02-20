import { deepMerge, TConfigResolverData } from '../../utils'

export function formatReact(configData: TConfigResolverData) {
  const config = {
    extends: ['plugin:import/recommended', 'plugin:react/recommended'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    plugins: ['react'],
    rules: {
      'react/react-in-jsx-scope': 0
    }
  }
  configData.settings = {
    'eslint.validate': ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    'editor.formatOnSave': true,
    'editor.codeActionsOnSave': { 'source.fixAll': 'explicit' },
    'eslint.format.enable': true,
    '[html]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[css]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[less]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[javascript]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[javascriptreact]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[typescript]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
    '[typescriptreact]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' }
  }

  configData.eslintOverrides = deepMerge(configData.eslintOverrides, config, {
    arrayStrategy: 'concat'
  })
  configData.packages = configData.packages.concat([
    'eslint-plugin-react@7.33.2',
    'eslint-plugin-react-hooks@4.6.0'
  ])
}
