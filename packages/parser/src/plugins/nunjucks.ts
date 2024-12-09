import { minimatch } from 'minimatch'
import NJ from 'nunjucks'

export type PluginOptions = {
  includes: string[]
  excludes: string[]
}

/**
 * Nunjucks plugins for @ephemeras/parser.
 *
 * @param options See {@link PluginOptions }.
 * @returns `void`
 * @examples
 * ```
 * import { Parser, nunjucks } from '@ephemeras/parser'
 *
 * const parser = new Parser(...)
 *
 * parser.use(nunjucks({
 *   includes: ['src/*.{ts|js|tsx|jsx}'],
 *   excludes: ['src/*.d.ts']
 * }))
 * ...
 * ```
 */
export function nunjucks(options?: Partial<PluginOptions>) {
  const { includes, excludes } = options || {}

  function validate(content: string) {
    const nunjucksRegex = /({{.*?}}|{%.*?%}|{#.*?#})/
    return nunjucksRegex.test(content)
  }

  const { renderString } = NJ

  return (files: Record<string, Buffer | null>, parser: any) => {
    for (const name of Object.keys(files)) {
      if (includes && !includes?.some(p => minimatch(name, p, { dot: true })))
        continue
      if (excludes?.some(p => minimatch(name, p, { dot: true }))) continue
      const content = files[name]
      if (!content) continue
      const text = content.toString()
      let file = name
      if (validate(name)) {
        file = renderString(name, parser.options.data)
        delete files[name]
      }
      if (validate(text)) {
        files[file] = Buffer.from(renderString(text, parser.options.data))
      }
    }
  }
}
