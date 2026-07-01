const NODE_VERSION_MAP = [
  {
    // Tier 0: Node < 20.19.0
    vue: '3.5.39',
    vite: '6.0.5',
    '@vitejs/plugin-vue': '6.0.7',
    'vue-tsc': '3.3.5',
    '@vue/tsconfig': '0.9.1',
    typescript: '6.0.3',
    eslint: '9.39.4',
    '@eslint/js': '9.39.4',
    'typescript-eslint': '8.62.1',
    'eslint-plugin-vue': '10.9.2',
    'eslint-plugin-prettier': '5.5.6',
    'eslint-config-prettier': '10.1.8',
    'vue-eslint-parser': '10.4.1',
    prettier: '3.9.4',
    globals: '17.7.0',
    husky: '9.1.7',
    '@commitlint/cli': '20.5.3',
    '@commitlint/config-conventional': '20.5.3',
    'lint-staged': '16.4.0',
    commitizen: '4.3.2',
    'cz-conventional-changelog': '3.3.0',
    '@types/node': '20.19.0'
  },
  {
    // Tier 1: Node 20.19.0 ~ 23.x
    vue: '3.5.39',
    vite: '8.1.0',
    '@vitejs/plugin-vue': '6.0.7',
    'vue-tsc': '3.3.5',
    '@vue/tsconfig': '0.9.1',
    typescript: '6.0.3',
    eslint: '10.6.0',
    '@eslint/js': '10.0.1',
    'typescript-eslint': '8.62.1',
    'eslint-plugin-vue': '10.9.2',
    'eslint-plugin-prettier': '5.5.6',
    'eslint-config-prettier': '10.1.8',
    'vue-eslint-parser': '10.4.1',
    prettier: '3.9.4',
    globals: '17.7.0',
    husky: '9.1.7',
    '@commitlint/cli': '20.5.3',
    '@commitlint/config-conventional': '20.5.3',
    'lint-staged': '16.4.0',
    commitizen: '4.3.2',
    'cz-conventional-changelog': '3.3.0',
    '@types/node': '22.20.0'
  },
  {
    // Tier 2: Node >= 24
    vue: '3.5.39',
    vite: '8.1.0',
    '@vitejs/plugin-vue': '6.0.7',
    'vue-tsc': '3.3.5',
    '@vue/tsconfig': '0.9.1',
    typescript: '6.0.3',
    eslint: '10.6.0',
    '@eslint/js': '10.0.1',
    'typescript-eslint': '8.62.1',
    'eslint-plugin-vue': '10.9.2',
    'eslint-plugin-prettier': '5.5.6',
    'eslint-config-prettier': '10.1.8',
    'vue-eslint-parser': '10.4.1',
    prettier: '3.9.4',
    globals: '17.7.0',
    husky: '9.1.7',
    '@commitlint/cli': '21.2.0',
    '@commitlint/config-conventional': '21.2.0',
    'lint-staged': '17.0.8',
    commitizen: '4.3.2',
    'cz-conventional-changelog': '3.3.0',
    '@types/node': '26.0.1'
  }
] as const

function getNodeTier(version: string): number {
  const [major, minor, patch] = version.slice(1).split('.').map(Number)
  if (major >= 24) return 2
  if (major > 20) return 1 // 21, 22, 23
  if (major === 20) {
    // >= 20.19.0 → tier 1, otherwise tier 0
    if (minor > 19) return 1
    if (minor === 19) return 1
    return 0
  }
  return 0 // < 20
}

export const CURRENT_NODE_VERSIONS: Record<string, string> =
  NODE_VERSION_MAP[getNodeTier(process.version)]
