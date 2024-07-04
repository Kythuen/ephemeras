/**
 * Convert path to unix path.
 *
 * @usage https://kythuen.github.io/ephemeras/fs/toUnixPath
 * @param path Path to convert, `string`.1
 * @returns Convert result, `string`.
 *
 * @example
 * import { toUnixPath } from '@ephemeras/fs'
 *
 * const unixPath = toUnixPath(path)
 */
export function toUnixPath(path: string) {
  return path.replace(/\\/g, '/')
}

/**
 * Get relative path from base path.
 *
 * @usage https://kythuen.github.io/ephemeras/fs/toRelativePath
 * @param path Source path, `string`.
 * @param base Base path, `string`.
 *
 * @example
 * import { toRelativePath } from '@ephemeras/fs'
 *
 * const relativePath = await toRelativePath('/abc/b/1.txt', '/abc')
 * console.log(relativePath)    // b/1.txt
 */
export function toRelativePath(path: string, base?: string) {
  return base ? path.substring(base.length + 1) : path
}

/**
 * Error handling wrapper for Promise.
 *
 * @usage https://kythuen.github.io/ephemeras/fs/to
 * @param promise Promise to wrapper, `Promise<any>`.
 * @returns Format return, `Promise<[E, undefined] | [null, R]>`.
 *
 * @example
 * import { to } from '@ephemeras/shared'
 *
 * async function run() {
 *   const [err, res] = await to(xxx(3000))
 * }
 */
export function to<T = any, U = any>(
  promise: Promise<T>
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      return [err, undefined]
    })
}
