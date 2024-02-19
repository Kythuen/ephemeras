export type TConfigResolverData = {
  env?: Record<string, any>
  packages: string[]
  eslintOverrides: Record<string, any>
  extensions: { recommendations: string[] }
  settings: Record<string, any>
}

export class ConfigResolver {
  data: TConfigResolverData

  constructor() {
    this.data = {
      packages: [],
      eslintOverrides: {},
      extensions: {
        recommendations: []
      },
      settings: {}
    }
  }

  use(handlerFn: (data: TConfigResolverData, ...params: any) => void, ...others: any): this {
    handlerFn(this.data, ...others)
    return this
  }
}
