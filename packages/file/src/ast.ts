import { AST } from './types'

export function resolve(node: any, key: string | number): AST | null {
  const { type } = node

  if (type === 'ArrayExpression') {
    if (typeof key === 'string') return null
    return node.elements[key]
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
    if (typeof key === 'string' && node.id.name === key) {
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
  return null
}

export function getNodeKey(node: AST) {
  const { type } = node

  if (type === 'VariableDeclarator') {
    return node.id.name
  }
  if (type === 'ObjectProperty') {
    return node.key.name
  }
  return null
}
export function getNodeValue(node: AST) {
  const { type } = node

  if (type === 'VariableDeclarator') {
    return node.init
  }
  if (type === 'ObjectProperty') {
    return node.value
  }
  return node.value || null
}
