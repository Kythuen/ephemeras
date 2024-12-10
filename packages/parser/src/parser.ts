import {
  copyFile,
  createDir,
  emptyDir,
  ensureDir,
  getLeafs,
  readFile,
  stat,
  relativePath,
  unixPath
} from '@ephemeras/fs'
import { createFile } from '@ephemeras/fs/create'
import { minimatch } from 'minimatch'
import { join, resolve } from 'node:path'
import {
  BaseOptions,
  CrossHookOptions,
  CrossOperationResult,
  FilterOptions,
  OverwriteOptions
} from './types'
import { isTextFile } from './utils'

export type ParserPluginParams = {
  files: Record<string, string | Buffer | null>
  map: Record<string, string>
  parser: Parser
}
export type ParserPlugin = (options: ParserPluginParams) => void

export type ParserOptions = {
  /**
   * Source directory.
   */
  source: string
  /**
   * Destination directory.
   */
  destination: string
  /**
   * Clear destination directory or not before operation.
   */
  clean: boolean
  /**
   * Parser plugins.
   */
  plugins: ParserPlugin[]
} & BaseOptions &
  FilterOptions &
  OverwriteOptions &
  CrossHookOptions
export type ParseResult = CrossOperationResult

/**
 * Parser template with data.
 * {@link https://kythuen.github.io/ephemeras/parser/Parser | View Details}
 *
 * @param options See {@link ParserOptions }.
 *
 * @examples
 * import { Parser, prettier } from '@ephemeras/parser'
 *
 * const parser = new Parser({
 *  clean: false,
 *  includes: [],
 *  excludes: [],
 *  plugins: []
 * })
 *
 * parser.context(process.cwd())
 *
 * parser.set({
 *  source: 'src',
 *  destination: 'dest'
 * })
 *
 * parser.set('clean', true)
 *
 * parser.use(prettier())
 *
 * await parser.build()
 */
export class Parser {
  options: ParserOptions
  tasks: (() => Promise<any>)[]
  result: Record<string, any>

  constructor(options: Partial<ParserOptions>) {
    this.options = {
      context: process.cwd(),
      source: '',
      destination: '',
      plugins: [],
      ...(options || {})
    } as ParserOptions
    this.result = {}
    this.tasks = []
  }
  set(prop: keyof ParserOptions, value: any): this
  set(props: Partial<ParserOptions>): this
  set(
    propNameOrProps: keyof ParserOptions | Partial<ParserOptions>,
    propValue?: any
  ) {
    if (typeof propNameOrProps === 'string') {
      ;(this.options as any)[propNameOrProps] = propValue
      return this
    }
    this.options = {
      ...this.options,
      ...propNameOrProps
    }
    return this
  }

  context(context: string) {
    this.set('context', context)
    return this
  }
  source(src: string) {
    this.set('source', src)
    return this
  }
  destination(dest: string) {
    this.set('destination', dest)
    return this
  }
  clean(clean: boolean) {
    this.set('clean', clean)
    return this
  }
  includes(patterns: string[]) {
    this.set('includes', patterns)
    return this
  }
  excludes(patterns: string[]) {
    this.set('excludes', patterns)
    return this
  }
  use(plugin: ParserPlugin) {
    this.options.plugins.push(plugin)
    return this
  }

  async read(src: string) {
    const { context, includes, excludes, filter } = this.options
    const source = getLeafs(src, { relativize: true })
    const srcStats = await stat(src)

    const memo: any = {}
    const pool: any[] = []
    const todo: any[] = []

    for (let i = 0; i < source.length; i++) {
      const itemPath = resolve(context, this.options.source, source[i])
      if (
        includes?.length &&
        includes.every(p => !minimatch(itemPath, p, { dot: true }))
      )
        continue
      if (
        excludes?.length &&
        excludes.some(p => minimatch(itemPath, p, { dot: true }))
      ) {
        continue
      }
      if (filter && !filter(src, srcStats)) {
        continue
      }

      todo.push(source[i])

      const itemStat = await stat(itemPath)
      if (itemStat.isDirectory()) {
        pool.push(
          () =>
            new Promise(async resolve => {
              resolve(null)
            })
        )
      } else if (!(await isTextFile(itemPath, itemStat))) {
        pool.push(
          () =>
            new Promise(async resolve => {
              resolve(-1)
            })
        )
      } else {
        pool.push(() => readFile(itemPath))
      }
    }
    const result: any = await Promise.allSettled(pool.map(i => i()))
    for (let i = 0; i < result.length; i++) {
      memo[todo[i]] = result[i].status === 'fulfilled' ? result[i].value : null
    }
    return memo
  }

  async build() {
    const {
      context,
      source,
      destination,
      plugins,
      clean,
      relativize,
      overwrite,
      beforeEach,
      afterEach
    } = this.options

    const result: ParseResult = {
      src: [],
      dest: [],
      add: [],
      update: [],
      skip: []
    }

    const resolveSrc = resolve(context, source)
    const resolveDest = resolve(context, destination)
    const files = await this.read(resolveSrc)

    let destFiles: string[] = []
    try {
      destFiles = getLeafs(resolveDest, { relativize: true })
    } catch (e) {}

    result.src = Object.keys(files)

    const map: Record<string, string> = {}
    for (const item in files) {
      map[item] = item
    }

    for (const plugin of plugins) {
      plugin?.({ files, map, parser: this })
    }

    result.dest = Object.keys(files)

    await ensureDir(resolveDest)
    if (clean) {
      await emptyDir(resolveDest)
    }
    const pool: any[] = []
    for (const file in files) {
      const content = files[file]
      const srcPath = join(resolveSrc, map[file])
      const destPath = join(resolveDest, file)
      const srcPathRelative = unixPath(relativePath(srcPath, resolveSrc))
      const destPathRelative = unixPath(relativePath(srcPath, resolveDest))
      let srcPathResult = srcPath
      let destPathResult = destPath
      if (relativize) {
        srcPathResult = destPathResult = unixPath(
          relativePath(destPath, resolveDest)
        )
        console.log(srcPath, destPath)
      }
      if (!content) {
        pool.push(
          () =>
            new Promise(async resolve => {
              beforeEach?.(srcPath, destPath)
              const res = await createDir(destPath, this.options)
              if (res) {
                if (
                  destFiles.includes(destPathRelative) &&
                  this.options.overwrite
                ) {
                  result.update.push(destPathResult)
                } else {
                  result.add.push(destPathResult)
                }
              } else {
                result.skip.push(destPathResult)
              }
              afterEach?.(srcPath, destPath)
              resolve(null)
            })
        )
      } else if (content === -1) {
        pool.push(
          () =>
            new Promise(async resolve => {
              beforeEach?.(srcPath, destPath)
              const res = await copyFile(srcPath, destPath, this.options)
              if (res) {
                if (
                  destFiles.includes(destPathRelative) &&
                  this.options.overwrite
                ) {
                  result.update.push(destPathResult)
                } else {
                  result.add.push(destPathResult)
                }
              } else {
                result.skip.push(destPathResult)
              }
              afterEach?.(srcPath, destPath)
              resolve(null)
            })
        )
      } else {
        pool.push(
          () =>
            new Promise(async resolve => {
              beforeEach?.(srcPath, destPath)
              const res = await createFile(destPath, content, this.options)
              if (res) {
                if (
                  destFiles.includes(destPathRelative) &&
                  this.options.overwrite
                ) {
                  result.update.push(destPathResult)
                } else {
                  result.add.push(destPathResult)
                }
              } else {
                result.skip.push(destPathResult)
              }
              afterEach?.(srcPath, destPath)
              resolve(null)
            })
        )
      }
    }
    await Promise.allSettled(pool.map(i => i()))

    return result
  }
}
