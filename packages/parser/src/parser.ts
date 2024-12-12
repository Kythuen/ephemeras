import {
  copyFile,
  createDir,
  createFile,
  emptyDir,
  ensureDir,
  exist,
  getLeafs,
  readFile,
  relativePath,
  stat,
  unixPath
} from '@ephemeras/fs'
import { minimatch } from 'minimatch'
import { basename, join, resolve } from 'node:path'
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
  parser: Parser | FileParser
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
 * ```
 * import { Parser, prettier } from '@ephemeras/parser'
 *
 * const parser = new Parser({
 *  source: '/src',
 *  destination: '/dest'
 * })
 *
 * parser.context(process.cwd())
 *
 * parser.set('clean', true)
 *
 * parser.set({
 *  relativize: true,
 *  overwrite: true,
 *  includes: [],
 *  excludes: [],
 *  filter: (path, stat) => stat.isFile() && path.includes('1.txt'),
 *  beforeEach: (src, dest) => { console.log(src, dest) }
 *  afterEach: (src, dest) => { console.log(src, dest) }
 *  plugins: []
 * })
 *
 * parser.use(prettier())
 *
 * const { src, dest, add, update, skip } = await parser.build()
 * ```
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
    const { context, includes, excludes, filter, relativize } = this.options
    const source = getLeafs(src, { relativize })

    const memo: any = {}
    const pool: any[] = []
    const todo: any[] = []

    for (let i = 0; i < source.length; i++) {
      const itemPath = resolve(context, this.options.source, source[i])
      const itemStat = await stat(itemPath)
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
      if (filter && !filter(itemPath)) {
        continue
      }

      todo.push(source[i])

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

    if (!Object.keys(files)) return result

    let srcFiles: string[] = []
    let existFiles: string[] = []
    try {
      srcFiles = getLeafs(resolveSrc, { relativize })
      existFiles = getLeafs(resolveDest, { relativize })
    } catch (e) {}

    result.src = srcFiles

    const fileMap: Record<string, string> = {}
    for (const item in files) {
      fileMap[item] = item
    }

    for (const plugin of plugins) {
      await plugin?.({ files, map: fileMap, parser: this })
    }

    await ensureDir(resolveDest)
    if (clean) {
      await emptyDir(resolveDest)
    }

    const pool: any[] = []

    for (const file in files) {
      let srcPathRelative = relativePath(fileMap[file], resolveSrc)
      let destPathRelative = relativePath(file, resolveSrc)
      let destPath = unixPath(join(resolveDest, destPathRelative))
      let srcPath = fileMap[file]
      let srcPathResult = srcPath
      let destPathResult = destPath

      if (relativize) {
        srcPathRelative = fileMap[file]
        destPathRelative = file
        srcPath = unixPath(join(resolveSrc, fileMap[file]))
        destPath = unixPath(join(resolveDest, file))
        srcPathResult = srcPathRelative
        destPathResult = destPathRelative
      }
      const content = files[file]
      const task = async () => {
        beforeEach?.(srcPathResult, destPathResult)
        result.dest.push(destPathResult)
        if (
          (existFiles.includes(destPath) && !overwrite) ||
          (!content && existFiles.some(i => i.includes(file)))
        ) {
          result.skip.push(destPathResult)
        } else {
          if (!content) {
            await createDir(destPath)
          } else if (content === -1) {
            await copyFile(srcPath, destPath, { overwrite })
          } else {
            await createFile(destPath, content, { overwrite })
          }
          if (existFiles.includes(destPath) && overwrite) {
            result.update.push(destPathResult)
          } else {
            result.add.push(destPathResult)
          }
        }
        afterEach?.(srcPathResult, destPathResult)
      }
      pool.push(task)
    }
    await Promise.allSettled(pool.map(i => i()))

    return result
  }
}

export type FileParserOptions = {
  /**
   * Source file.
   */
  source: string
  /**
   * Destination file.
   */
  destination: string
  /**
   * Parser plugins.
   */
  plugins: ParserPlugin[]
} & OverwriteOptions &
  Pick<BaseOptions, 'context'>
/**
 * Parser template with data.
 * {@link https://kythuen.github.io/ephemeras/parser/FileParser | View Details}
 *
 * @param options See {@link FileParserOptions }.
 *
 * @examples
 * ```
 * import { FileParser, prettier } from '@ephemeras/parser'
 *
 * const parser = new FileParser({
 *  source: '/src/1.txt',
 *  destination: '/dest/2.txt'
 * })
 *
 * parser.set({
 *  overwrite: true,
 *  plugins: []
 * })
 *
 * parser.use(prettier())
 *
 * const result = await parser.build()
 * ```
 */
export class FileParser {
  options: FileParserOptions

  constructor(options: Partial<FileParserOptions>) {
    this.options = {
      context: process.cwd(),
      source: '',
      destination: '',
      plugins: [],
      ...(options || {})
    } as ParserOptions
  }

  set(prop: keyof FileParserOptions, value: any): this
  set(props: Partial<FileParserOptions>): this
  set(
    propNameOrProps: keyof FileParserOptions | Partial<FileParserOptions>,
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

  source(src: string) {
    this.set('source', src)
    return this
  }
  destination(dest: string) {
    this.set('destination', dest)
    return this
  }
  use(plugin: ParserPlugin) {
    this.options.plugins.push(plugin)
    return this
  }

  async build() {
    const { context, source, destination, plugins, overwrite } = this.options

    const resolveSrc = resolve(context, source)
    const resolveDest = resolve(context, destination)
    const filename = basename(resolveSrc)

    const fileMap: Record<string, string> = {
      [filename]: filename
    }

    const content = await readFile(resolveSrc)
    const files = {
      [filename]: content
    }

    for (const plugin of plugins) {
      await plugin?.({ files, map: fileMap, parser: this })
    }

    if (!overwrite && (await exist(resolveDest))) {
      return false
    }
    const itemStat = await stat(resolveSrc)
    if (!(await isTextFile(resolveSrc, itemStat))) {
      return copyFile(fileMap[filename], resolveDest, { overwrite })
    }
    return await createFile(resolveDest, files[filename], { overwrite })
  }
}
