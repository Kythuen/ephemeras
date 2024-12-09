import { copyFile, readFile } from '@ephemeras/fs'
import { minimatch } from 'minimatch'
import { extname, join, resolve } from 'node:path'
import { createFile, emptyDir, ensureDir, getLeafs } from '../../fs/src'
import { BaseOptions, FilterOptions, OverwriteOptions } from './types'

export { nunjucks } from './plugins/nunjucks'
export { prettier } from './plugins/prettier'

export type ParserPlugin = (
  files: Record<string, Buffer | null>,
  parser?: Parser
) => void

export type ParserOptions = BaseOptions &
  FilterOptions &
  OverwriteOptions & {
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
  }

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
      context: '/',
      source: '',
      destination: '',
      clean: false,
      data: {},
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
  includes(data: string[]) {
    this.set('includes', data)
    return this
  }
  excludes(data: string[]) {
    this.set('excludes', data)
    return this
  }
  extensions(data: string[] | RegExp) {
    this.set('extensions', data)
    return this
  }
  data(data: Record<string, any>) {
    this.set('data', data)
    return this
  }
  use(plugin: ParserPlugin) {
    this.options.plugins.push(plugin)
    return this
  }

  async read(src: string) {
    const {
      context,
      includes,
      excludes,
      extensions = /ts|tsx|js|jsx|vue|json|css|less|ya?ml|txt|md/
    } = this.options
    const source = getLeafs(src)
    console.log('source', source)

    const memo: any = {}
    const pool: any[] = []
    const todo: any[] = []

    function needParse(ext: string) {
      return (
        (Object.prototype.toString.call(extensions) === '[object RegExp]' &&
          (extensions as RegExp).test(ext)) ||
        (Object.prototype.toString.call(extensions) === '[object Array]' &&
          (extensions as string[]).includes(ext))
      )
    }

    for (let i = 0; i < source.length; i++) {
      const itemPath = resolve(context, this.options.source, source[i])
      const ext = extname(itemPath).replace(/^\./, '')
      if (
        includes &&
        !includes?.some(p => minimatch(itemPath, p, { dot: true }))
      )
        continue
      if (excludes?.some(p => minimatch(itemPath, p, { dot: true }))) {
        continue
      }

      todo.push(source[i])
      if (needParse(ext)) {
        console.log(itemPath)
        pool.push(() => readFile(itemPath, { encoding: 'utf8' }))
      } else {
        pool.push(
          () =>
            new Promise(resolve => {
              resolve(null)
            })
        )
      }
    }
    const result: any = await Promise.allSettled(pool.map(i => i()))
    for (let i = 0; i < result.length; i++) {
      memo[todo[i]] = result[i].status === 'fulfilled' ? result[i].value : null
    }
    return memo
  }

  async build() {
    const { context, source, destination, plugins, clean } = this.options
    const src = resolve(context, source)
    const dest = resolve(context, destination)
    const files = await this.read(src)
    console.log(files)
    for (const plugin of plugins) {
      plugin?.(files, this)
    }

    await ensureDir(dest)
    if (clean) {
      await emptyDir(dest)
    }
    const pool: any[] = []
    for (const file in files) {
      if (!files[file]) {
        pool.push(() => copyFile(join(src, file), join(dest, file)))
      } else {
        pool.push(() => createFile(join(dest, file), files[file]))
      }
    }
    return Promise.allSettled(pool.map(i => i()))
  }
}
