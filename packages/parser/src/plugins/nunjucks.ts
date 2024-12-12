import { minimatch } from 'minimatch'
import NJ from 'nunjucks'
import type { ParserPluginParams } from '../parser'
import type { FilterOptions } from '../types'

export type PluginOptions = FilterOptions

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
export function nunjucks(
  data: Record<string, any> = {},
  options?: Partial<PluginOptions>
) {
  const { includes, excludes, filter } = options || {}

  function validate(content: string) {
    const nunjucksRegex = /({{.*?}}|{%.*?%}|{#.*?#})/
    return nunjucksRegex.test(content)
  }

  const { renderString } = NJ

  return ({ files, map }: ParserPluginParams) => {
    for (const name of Object.keys(files)) {
      if (includes && !includes?.some(p => minimatch(name, p, { dot: true })))
        continue
      if (excludes?.some(p => minimatch(name, p, { dot: true }))) continue
      if (filter && !filter(name)) continue
      const content = files[name]
      if (!content) continue
      const text = content.toString()
      let file = name
      if (validate(name)) {
        file = renderString(name, data)
        files[file] = content
        map[file] = name
        delete files[name]
        delete map[name]
      }
      if (validate(text)) {
        files[file] = Buffer.from(renderString(text, data))
      }
    }
  }
}
