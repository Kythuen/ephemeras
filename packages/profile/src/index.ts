import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, extname, resolve } from 'node:path'

export type ProfileData = Record<string, any>
export type ProfileTransformer = (text: string, ...args: any[]) => any
export type ProfileSerializer = (data: any, ...args: any[]) => string

export type ProfileOptions = {
  path: string
  base?: string
  data?: ProfileData
  serializer?: ProfileSerializer
  transformer?: ProfileTransformer
}

/**
 * Easy to manage a profile
 *
 * @examples
 * ```
 * import { Profile } from '@ephemeras/profile'
 *
 * const file = new Profile({ path: '.white-block/cli/config.json' })
 *
 * // file.getUrl(): get file path
 * // file.getData(): get file data
 * // file.get(propName): get data by propName
 * // file.set({}): set data by subData
 * // file.set(propName, data): set data by propName
 * // file.delete(propName): delete data by propName
 * // file.clear(): clear file data
 * // file.remove(): remove file
 * ```
 */
export class Profile {
  private url: string
  private data: ProfileData

  private transformer: ProfileTransformer = JSON.parse
  private serializer: ProfileSerializer = JSON.stringify

  constructor(options: ProfileOptions) {
    const { base, path, data, transformer, serializer } = options
    if (base && !existsSync(base)) {
      throw Error(`base directory: "${base}" is not exists`)
    }
    if (path && !extname(path)) {
      throw Error(`path: "${path}" must be a file`)
    }
    if (extname(path) !== '.json' && !transformer) {
      throw Error(
        `detect path: ${path} not json file, please offer the transformer & serializer for your file`
      )
    }
    const baseDir = base || homedir()
    const url = resolve(baseDir, path)
    this.url = url

    if (serializer) {
      this.serializer = serializer
    }
    if (transformer) {
      this.transformer = transformer
    }

    if (!existsSync(this.url)) {
      mkdirSync(dirname(this.url), { recursive: true })
      writeFileSync(this.url, extname(path) === '.json' ? '{}' : '', {
        encoding: 'utf-8'
      })
    }

    const fileContent =
      readFileSync(this.url, 'utf-8') || (extname(path) === '.json' ? '{}' : '')

    const fileData = this.transformer(fileContent)
    this.data = data || fileData || {}
    this.set(this.data)
  }

  private sync(syncType: 'get' | 'set' = 'get') {
    if (syncType === 'get') {
      const data = this.transformer(readFileSync(this.url, 'utf-8'))
      this.data = data
    } else {
      writeFileSync(this.url, this.serializer(this.data))
    }
  }

  public getData() {
    return this.data
  }

  public getUrl() {
    return this.url
  }

  public get(prop: string) {
    this.sync('get')
    return this.data[prop]
  }

  public set(prop: string, value: any): ProfileData
  public set(data: ProfileData): ProfileData
  public set(propOrData: string | ProfileData, propValue?: any) {
    if (typeof propOrData === 'string') {
      this.data[propOrData] = propValue
    } else if (
      Object.prototype.toString.call(propOrData) === '[object Object]'
    ) {
      this.data = {
        ...this.data,
        ...propOrData
      }
    } else {
      throw Error('invalid params for function set()')
    }
    this.sync('set')
    return this.data
  }

  public delete(prop: string) {
    delete this.data[prop]
    this.sync('set')
    return this.data
  }

  public clear() {
    this.data = {}
    this.sync('set')
    return this.data
  }

  public remove() {
    unlinkSync(this.url)
  }
}
