export type ConfigResolverData = {
  packages: { name: string; version: string }[]
  extensions: string[]
  languages: string[]
}
export type ConfigResolverTasks = {
  add: Task[]
  remove: Task[]
}
export type ConfigResolverPlugin<T> = (
  resolver: ConfigResolver,
  data: T
) => void

export type Task = () => Promise<any>

export class ConfigResolver {
  data: ConfigResolverData
  tasks: ConfigResolverTasks

  constructor() {
    this.data = {
      packages: [],
      extensions: [],
      languages: []
    }
    this.tasks = {
      add: [],
      remove: []
    }
  }

  use<T = any>(plugin: ConfigResolverPlugin<T>, data: T): this {
    plugin(this, data)
    return this
  }
}

export * from './format/base'
export * from './format/typescript'
export * from './format/vue'
export * from './format/final'
export * from './commit/base'
