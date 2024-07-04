import { minimatch } from 'minimatch'
import NJ from 'nunjucks'

export type PluginOptions = {
  includes: string[]
  excludes: string[]
}

/**
 * Nunjucks plugins for @ephemeras/compiler.
 *
 * @param options Compile options, `PluginOptions`.
 * @returns `void`
 * @examples
 * ```
 * import { Compiler, nunjucks } from '@ephemeras/compiler'
 *
 * const compiler = new Compiler(...)
 *
 * compiler.use(nunjucks({
 *   includes: ['src/*.{ts|js|tsx|jsx}'],
 *   excludes: ['src/*.d.ts']
 * }))
 * ...
 * ```
 */

const { renderString } = NJ

export function nunjucks(options?: Partial<PluginOptions>) {
  const { includes, excludes } = options || {}

  function validate(content: string) {
    const nunjucksRegex = /({{.*?}}|{%.*?%}|{#.*?#})/
    return nunjucksRegex.test(content)
  }

  return (files: Record<string, Buffer | null>, compiler: any) => {
    for (const name of Object.keys(files)) {
      if (includes && !includes?.some(p => minimatch(name, p, { dot: true })))
        continue
      if (excludes?.some(p => minimatch(name, p, { dot: true }))) continue
      const content = files[name]
      if (!content) continue
      const text = content.toString()
      let file = name
      if (validate(name)) {
        file = renderString(name, compiler.options.data)
        delete files[name]
      }
      if (validate(text)) {
        files[file] = Buffer.from(renderString(text, compiler.options.data))
      }
    }
  }
}
