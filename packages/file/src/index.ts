import { resolve as resolvePath, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import generator from '@babel/generator'
import { parse, parseExpression, ParserOptions } from '@babel/parser'
import traverse from '@babel/traverse'
import { identifier, objectProperty } from '@babel/types'
import prettier from '@prettier/sync'
import { readFileSync, writeFileSync } from 'node:fs'
import { Options as PrettierOptions } from 'prettier'
import { getNodeKey, resolve, getNodeValue } from './ast'
import { AST } from './types'

export const PROJECT_ROOT = resolvePath(
  fileURLToPath(import.meta.url),
  '../../..'
)

export interface FileOptions {
  context?: string
  parser?: Partial<ParserOptions>
  prettier?: Partial<PrettierOptions>
}

/**
 * File operator.
 *
 * @examples
 * ```
 * import { File } from '@ephemeras/file'
 *
 * const code = `export const A = {
 *   B: 'bb',
 *   C: ['cc'],
 *   D: { E: 'ee' }
 * }`
 * const file = new File()
 * file.init(code)
 *
 * file
 *   .get('A')                          // get prop with key
 *   .set('F', { G: 'gg' })             // set prop value with key
 *   .root()                            // back to code root context
 *   .delete('B')                       // delete prop
 *   .get('C')
 *   .set(1, 'cc2')                     // set prop value with index
 *   .save()                            // save changed code to file
 *
 * console.log(file.get('C').get(0))    // get prop with index
 * console.log(file.get('A').json())    // get value json
 * console.log(file.text())             // get changed code
 * ```
 *
 * // => export const A = {
 *   C: ['cc', 'cc2'],
 *   D: { E: 'ee' },
 *   F: { G: 'gg' }
 * }
 */
export class File {
  private file: string = ''
  private options: FileOptions
  private code: string = ''
  private ast: AST
  private currentNode: AST

  constructor(file?: string, options?: FileOptions) {
    if (file) {
      const filePath = resolvePath(options?.context || process.cwd(), file)
      this.file = filePath
      const code = readFileSync(filePath, { encoding: 'utf-8' })
      this.init(code)
    }
    this.options = options || {}
  }

  init(code: string) {
    this.code = code
    this.ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      ...(this.options?.parser ?? {})
    })
    this.currentNode = this.ast
    return this.root()
  }

  root() {
    this.currentNode = this.ast
    return this
  }

  get(id: string | number) {
    if (typeof id === 'string') return this.getKey(id)
    if (typeof id === 'number') return this.getIndex(id)
    return this
  }

  getKey(key: string) {
    const node = resolve(this.currentNode, key)
    this.currentNode = node
    return this
  }

  getIndex(index: number) {
    const node = resolve(this.currentNode, index)
    this.currentNode = node
    return this
  }

  text() {
    if (this.currentNode.type === 'File') {
      return this.code
    }
    const { code } = generator(getNodeValue(this.currentNode), {
      concise: true
    })
    return code
  }

  json() {
    if (this.currentNode.type.includes('Literal')) {
      return this.currentNode.value
    }
    const { code } = generator(getNodeValue(this.currentNode), {
      concise: true
    })
    const str = code.replace(/'/g, '"').replace(/(\w+):/g, '"$1":')

    return JSON.parse(str)
  }
  set(id: string | number, value: any) {
    if (typeof id === 'string') return this.setKey(id, value)
    if (typeof id === 'number') return this.setIndex(id, value)
    return this
  }
  setKey(key: string, value: any) {
    const parentKey = getNodeKey(this.currentNode)
    const visitor = {
      ObjectExpression(path: any) {
        const ast: any = parseExpression(`{ ${key}: ${JSON.stringify(value)} }`)
        if (!parentKey) return this
        if (getNodeKey(path.parent) === parentKey) {
          let foundItem: any = null
          path.node.properties.some((item: any) => {
            if (getNodeKey(item) === key) {
              foundItem = item
              return true
            }
            return false
          })
          if (foundItem) {
            foundItem.value = ast.properties[0].value
          } else {
            path.node.properties.push(
              objectProperty(identifier(key), ast.properties[0].value)
            )
          }
        }
      }
    }
    traverse(this.ast, visitor)
    return this
  }
  setIndex(index: number, value: any) {
    if (index < 0) return this
    const parentKey = getNodeKey(this.currentNode)
    const visitor = {
      ArrayExpression(path: any) {
        if (getNodeKey(path.parent) === parentKey) {
          const ast: any = parseExpression(JSON.stringify(value))
          if (index < path.node.elements.length) {
            path.node.elements[index] = ast
          } else {
            path.node.elements.push(ast)
          }
        }
      }
    }
    traverse(this.ast, visitor)
    return this
  }
  delete(id: string | number) {
    if (typeof id === 'string') return this.deleteKey(id)
    if (typeof id === 'number') return this.deleteIndex(id)
    return this
  }
  deleteKey(key: string) {
    const parentKey = getNodeKey(this.currentNode)
    const visitor = {
      ObjectExpression(path: any) {
        if (getNodeKey(path.parent) === parentKey) {
          path.node.properties.some((item: any, index: any) => {
            if (getNodeKey(item) === key) {
              path.node.properties.splice(index, 1)
              return true
            }
            return false
          })
        }
      }
    }
    traverse(this.ast, visitor)
    return this
  }
  deleteIndex(index: number) {
    if (index < 0) return this
    const parentKey = getNodeKey(this.currentNode)
    const visitor = {
      ArrayExpression(path: any) {
        if (getNodeKey(path.parent) === parentKey) {
          if (index > path.node.elements.length) return
          path.node.elements.splice(index, 1)
        }
      }
    }
    traverse(this.ast, visitor)
    return this
  }
  save() {
    if (!this.file) return
    this.root()

    const { code } = generator(this.ast, {
      concise: true
    })

    const prettierOptions =
      prettier.resolveConfig(join(PROJECT_ROOT, '.prettierrc')) || {}

    const result = prettier.format(code, {
      parser: 'babel-ts',
      ...(prettierOptions ?? {}),
      ...(this.options?.prettier ?? {})
    })
    writeFileSync(this.file, result, { encoding: 'utf-8' })
  }
}
