import type { Stats } from 'node:fs'

export type BaseOptions = {
  /**
   * Context directory.
   * @default process.cwd()
   */
  context: string
  /**
   * Relativize the paths in result.
   */
  relativize: boolean
}

export type FilterOptions = {
  /**
   * Pattern matcher to include for operation.
   */
  includes?: string[]
  /**
   * Pattern matcher to exclude for operation.
   */
  excludes?: string[]
  /**
   * Filter by some condition for operation.
   * return `true` to continue operation and `false` to skip it.
   */
  filter?: (src: string, srcStats: Stats) => boolean
}

export type OverwriteOptions = {
  /**
   * Overwrite existing file or directory.
   */
  overwrite: boolean
}

export type CrossHookOptions = {
  /**
   * Hook before each item been operated.
   */
  beforeEach?: (src: string, dest: string) => any
  /**
   * Hook after each item been operated.
   */
  afterEach?: (src: string, dest: string) => any
}

export type CrossOperationResult = {
  src: string[]
  dest: string[]
  add: string[]
  update: string[]
  skip: string[]
}
