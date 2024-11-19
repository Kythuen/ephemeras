import { relative, resolve, join } from 'node:path'
import { readdirSync } from 'node:fs'
import type { BaseOptions } from './types'

/**
 * Convert path to unix format.
 * {@link https://kythuen.github.io/ephemeras/fs/unixPath | View Details}
 *
 * @param path Path to convert.
 * @returns Unix format path.
 *
 * @example
 * unixPath('abc/ab/c')        //--> 'abc/ab/c'
 * unixPath('abc\\ab\\c')      //--> 'abc/ab/c'
 */
export function unixPath(path: string) {
  return path.replace(/\\/g, '/')
}

/**
 * Get relative path from base path.
 * {@link https://kythuen.github.io/ephemeras/fs/relativePath | View Details}
 *
 * @param path Source path.
 * @param base Base path.
 * @returns Relative path from base.
 *
 * @example
 * relativePath('/abc/b/1.txt', '/abc')      //--> 'b/1.txt'
 * relativePath('/abc/b/1.txt', 'abc\\b')    //--> '1.txt'
 */
export function relativePath(path: string, base?: string) {
  const resolvePath = unixPath(path)
  if (!base) return resolvePath
  const resolveBase = unixPath(base)
  return resolvePath.includes(resolveBase)
    ? unixPath(relative(resolveBase, resolvePath))
    : resolvePath
}

export type GetLeafsOptions = {
  /**
   * Empty directory in result.
   * @default true
   */
  emptyDir: boolean
} & BaseOptions
/**
 * Get leaf of a directory.
 * {@link https://kythuen.github.io/ephemeras/fs/getLeafs | View Details}
 *
 * @param path Source path.
 * @param options See {@link GetLeafsOptions }.
 * @returns Leaf items list of the directory.
 *
 * @example
 * getLeafs('/foo/bar')      //--> ['1.txt', 'sub1/1.txt', ...]
 */
export function getLeafs(path: string, options?: Partial<GetLeafsOptions>) {
  const { context = process.cwd() } = options || {}

  const resolvePath = unixPath(resolve(context, path))

  return doLeaf(resolvePath, options || {}, resolvePath)
}
function doLeaf(path: string, options: Partial<GetLeafsOptions>, root: string) {
  const { emptyDir = true, relativize } = options

  const items = readdirSync(path, { withFileTypes: true })
  if (!items.length) {
    if (emptyDir) {
      return [relativize ? relativePath(path, root) : unixPath(path)]
    }
    return []
  }

  const result: string[] = items.flatMap(item => {
    const filePath = join(path, item.name)
    if (item.isDirectory()) {
      return [...doLeaf(filePath, options, root)]
    }
    return [relativize ? relativePath(filePath, root) : unixPath(filePath)]
  })

  return result
}
