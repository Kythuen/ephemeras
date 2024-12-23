import { PromptData } from '../types'
import { Tasks } from './task'

export * from './format/base'
export * from './format/typescript'
export * from './format/vue'
export * from './commit/base'

export type TConfigResolverData = {
  packages: { name: string; version: string }[]
  extensions: string[]
  languages: string[]
}

export class ConfigResolver {
  data: TConfigResolverData
  tasks: Tasks

  constructor() {
    this.data = {
      packages: [],
      extensions: [],
      languages: []
    }
    this.tasks = new Tasks()
  }

  use(
    handlerFn: (resolver: ConfigResolver, data: PromptData) => void,
    data: PromptData
  ): this {
    handlerFn(this, data)
    return this
  }
}
