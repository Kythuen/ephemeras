import { AST } from './types'

export function resolve(node: any, key: string): AST {
  const { type } = node

  if (type === 'ArrayExpression') {
    for (const item of node.elements) {
      const result = resolve(item, key)
      if (result) return result
    }
  }

  if (type === 'Property') {
    if (node.key.name === key) {
      return node
    }
  }
  if (type === 'ObjectProperty') {
    if (node.key.name === key) {
      return node
    }
    return resolve(node.value, key)
  }
  if (type === 'ObjectExpression') {
    for (const item of node.properties) {
      const result = resolve(item, key)
      if (result) return result
    }
  }

  if (type === 'VariableDeclarator') {
    if (node.id.name === key) {
      return node
    }
    return resolve(node.init, key)
  }

  if (type === 'VariableDeclaration') {
    return resolve(node.declarations[0], key)
  }

  if (type === 'ExportNamedDeclaration') {
    return resolve(node.declaration, key)
  }

  if (type === 'ExportDefaultDeclaration') {
    return resolve(node.declaration[0], key)
  }

  if (type === 'Program') {
    for (const item of node.body) {
      const result = resolve(item, key)
      if (result) return result
    }
  }
  if (type === 'File') {
    return resolve(node.program, key)
  }
  return null as unknown as AST
}

export function getNodeKey(node: any) {
  const { type } = node

  if (type === 'VariableDeclarator') {
    return node.id.name
  }
  if (type === 'ObjectProperty') {
    return node.key.name
  }
  return null
}
