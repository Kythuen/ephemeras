import { createFile, ensure, getLeafs, emptyDir } from '@ephemeras/fs'
import { minimatch } from 'minimatch'
import { copyFile, readFile } from 'node:fs/promises'
import { join, resolve, extname } from 'node:path'

export { nunjucks } from './plugins/nunjucks'
export { prettier } from './plugins/prettier'

export type ComplierPlugin = (
  files: Record<string, Buffer | null>,
  compiler?: Complier
) => void

export type ComplierOptions = {
  context: string
  source: string
  destination: string
  clean: boolean
  data: Record<string, any>
  includes: string[]
  excludes: string[]
  extensions: string[] | RegExp
  plugins: ComplierPlugin[]
}

/**
 * @examples
 * ```
 * import { Compiler, prettier } from '@ephemeras/compiler'
 *
 * const compiler = new Compiler({
 *  clean: false,
 *  includes: [],
 *  excludes: [],
 *  plugins: []
 * })
 *
 * compiler.context(process.cwd())
 *
 * compiler.set({
 *  source: 'src',
 *  destination: 'dest'
 * })
 *
 * compiler.set('clean', true)
 *
 * compiler.use(prettier())
 *
 * await compiler.build()
 * ```
 */
export class Complier {
  options: ComplierOptions
  tasks: (() => Promise<any>)[]
  result: Record<string, any>

  constructor(options?: Partial<ComplierOptions>) {
    this.options = {
      context: '',
      source: '',
      destination: '',
      clean: false,
      data: {},
      plugins: [],
      ...(options || {})
    } as ComplierOptions
    this.result = {}
    this.tasks = []
  }
  set(prop: keyof ComplierOptions, value: any): this
  set(props: Partial<ComplierOptions>): this
  set(
    propNameOrProps: keyof ComplierOptions | Partial<ComplierOptions>,
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
  use(plugin: ComplierPlugin) {
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

    const memo: any = {}
    const pool: any[] = []
    const todo: any[] = []

    function needCompile(ext: string) {
      return (
        (Object.prototype.toString.call(extensions) === '[object RegExp]' &&
          (extensions as RegExp).test(ext)) ||
        (Object.prototype.toString.call(extensions) === '[object Array]' &&
          (extensions as string[]).includes(ext))
      )
    }

    for (let i = 0; i < source.length; i++) {
      const itemPath = join(context, this.options.source, source[i])
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
      if (needCompile(ext)) {
        pool.push(() => readFile(itemPath))
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
    for (const plugin of plugins) {
      plugin?.(files, this)
    }

    await ensure(dest)
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
