import type { TConfigResolverData } from '../../utils'

export function commitBase(configData: TConfigResolverData) {
  configData.packages = configData.packages.concat([
    '@commitlint/cli@17.4.4',
    '@commitlint/config-conventional@17.4.4',
    'commitizen@4.3.0',
    'cz-conventional-changelog@3.3.0',
    'husky@8.0.3',
    'lint-staged@13.1.2'
  ])
}
