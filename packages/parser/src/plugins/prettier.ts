import { minimatch } from 'minimatch'
import { extname } from 'node:path'
import type { BuiltInParserName, Options } from 'prettier'
import { format } from 'prettier'
import type { ParserPluginParams } from '../parser'
import { getPrettierConfig } from '../utils'

export type ParserMap = Record<string, BuiltInParserName>
export type PluginOptions = {
  includes: string[]
  excludes: string[]
  prettier: Options
  parser: ParserMap
}

const PARSERS: ParserMap = {
  '.html': 'html',
  '.css': 'css',
  '.svg': 'html',
  '.less': 'less',
  '.scss': 'scss',
  '.json': 'json',
  '.json5': 'json5',
  '.js': 'babel',
  '.jsx': 'babel',
  '.ts': 'babel-ts',
  '.tsx': 'babel-ts',
  '.vue': 'vue',
  '.md': 'markdown',
  '.yaml': 'yaml'
}

/**
 * Prettier plugins for @ephemeras/parser.
 *
 * @param options See {@link PluginOptions }.
 * @returns `void`
 * @examples
 * ```
 * import { Parser, prettier } from '@ephemeras/parser'
 *
 * const parser = new Parser(...)
 *
 * parser.use(prettier({
 *   includes: ['src/*.{ts|js|tsx|jsx}'],
 *   excludes: ['src/*.d.ts']
 * }))
 * ...
 * ```
 */
export function prettier(options?: Partial<PluginOptions>) {
  const { includes, excludes, parser = {}, prettier = {} } = options || {}

  const resolveParsers = {
    ...PARSERS,
    ...parser
  }

  return async ({ files }: ParserPluginParams) => {
    const prettierConfig = await getPrettierConfig()

    for (const file of Object.keys(files)) {
      if (includes && !includes?.some(p => minimatch(file, p, { dot: true })))
        continue
      if (excludes?.some(p => minimatch(file, p, { dot: true }))) continue
      const content = files[file]
      if (!content) continue
      const text = content.toString()
      const ext = extname(file)
      if (!resolveParsers[ext]) continue
      const formatted = await format(text, {
        ...prettierConfig,
        parser: resolveParsers[ext] || 'babel-ts',
        ...prettier
      })
      if (formatted) {
        files[file] = Buffer.from(formatted)
      }
    }
  }
}
