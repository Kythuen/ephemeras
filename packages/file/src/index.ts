import { resolve as resolvePath } from 'node:path'
import generator from '@babel/generator'
import { parse, parseExpression, ParserOptions } from '@babel/parser'
import traverse from '@babel/traverse'
import { identifier, objectProperty } from '@babel/types'
import prettier from '@prettier/sync'
import { readFileSync, writeFileSync } from 'node:fs'
import { Options as PrettierOptions } from 'prettier'
import { getNodeKey, resolve } from './ast'
import { AST } from './types'

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
 * const file = new File(code)
 *
 * file
 *   .get('A')                 // get props
 *   .set('F', { G: 'gg' })    // set prop value
 *   .root()                   // back to code root context
 *   .delete('B')              // delete prop
 *   .get('C')
 *   .add('cc2')               // add item in array
 *   .save()                   // save change to file
 *
 * file.getCode()              // get change code
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
      const filePath = resolvePath(process.cwd(), file)
      this.file = filePath
      const code = readFileSync(filePath, { encoding: 'utf-8' })
      this.setCode(code)
    }
    this.options = options || {}
  }

  root() {
    this.currentNode = this.ast
    return this
  }
  setCode(code: string) {
    this.code = code
    this.ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      ...(this.options?.parser ?? {})
    })
    this.root()
  }
  getCode(options?: Partial<PrettierOptions>) {
    const { code } = generator.default(this.ast)
    const formatContent = prettier.format(code, {
      parser: 'babel-ts',
      ...(this.options?.prettier ?? {}),
      ...(options || {})
    })
    this.code = formatContent
    this.root()
    return this.code
  }
  get(key: string) {
    const node = resolve(this.currentNode, key)
    this.currentNode = node
    return this
  }
  add(value: any, unique = false) {
    const key = getNodeKey(this.currentNode)
    if (!key) return this
    if (
      unique &&
      this.currentNode.value.elements?.some(item => item.value === value)
    )
      return this
    const visitor = {
      ArrayExpression(path) {
        if (getNodeKey(path.parent) === key) {
          const ast: any = parseExpression(`[${JSON.stringify(value)}]`)
          path.node.elements.push(ast.elements[0])
        }
      }
    }
    traverse.default(this.ast, visitor)
    return this
  }
  remove(value: any) {
    const key = getNodeKey(this.currentNode)
    if (!key) return this
    const visitor = {
      ArrayExpression(path) {
        if (getNodeKey(path.parent) === key) {
          path.node.elements.some((item, index) => {
            if (item.value === value) {
              path.node.elements.splice(index, 1)
              return true
            }
            return false
          })
        }
      }
    }
    traverse.default(this.ast, visitor)
    return this
  }
  set(prop: string, value: any) {
    const id = getNodeKey(this.currentNode)
    if (!id) return this
    const visitor = {
      ObjectExpression(path) {
        if (getNodeKey(path.parent) === id) {
          let foundItem
          const ast: any = parseExpression(
            `{ ${prop}: ${JSON.stringify(value)} }`
          )
          const { name } = ast.properties[0].key
          path.node.properties.some(item => {
            if (getNodeKey(item) === name) {
              foundItem = item
              return true
            }
            return false
          })
          if (foundItem) {
            foundItem.value = ast.properties[0].value
          } else {
            path.node.properties.push(
              objectProperty(identifier(prop), ast.properties[0].value)
            )
          }
        }
      }
    }
    traverse.default(this.ast, visitor)
    return this
  }
  delete(prop: string) {
    const id = getNodeKey(this.currentNode)
    if (!id) return this
    const visitor = {
      ObjectExpression(path) {
        if (getNodeKey(path.parent) === id) {
          path.node.properties.some((item, index) => {
            if (getNodeKey(item) === prop) {
              path.node.properties.splice(index, 1)
              return true
            }
            return false
          })
        }
      }
    }
    traverse.default(this.ast, visitor)
    return this
  }
  save() {
    if (!this.file) return
    this.getCode()
    writeFileSync(this.file, this.code, { encoding: 'utf-8' })
  }
}
