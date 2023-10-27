import type { ESLint } from 'eslint'

export type TConfigResolverData = {
  packages: string[]
  eslintOverrides: ESLint.ConfigData
}

export class ConfigResolver {
  data: TConfigResolverData

  constructor() {
    this.data = {
      packages: [],
      eslintOverrides: {}
    }
  }

  use(
    handlerFn: (data: TConfigResolverData, ...params: any) => void,
    ...others: any
  ): this {
    handlerFn(this.data, ...others)
    return this
  }
}
