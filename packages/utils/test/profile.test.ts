import { afterAll, describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { homedir } from 'node:os'
import { existsSync, removeSync } from 'fs-extra'
import { Profile } from '../src/profile'
import {
  serializer as yamlSerializer,
  transformer as yamlTransformer
} from '../src/profile/format/yaml'
import {
  serializer as tomlSerializer,
  transformer as tomlTransformer
} from '../src/profile/format/toml'
import {
  serializer as iniSerializer,
  transformer as iniTransformer
} from '../src/profile/format/ini'

describe('# profile', () => {
  describe('## invalid params', () => {
    const cases = [
      {
        name: '### base: invalid type',
        params: { base: 1, path: 'utils-test/temp/setting.json' },
        error: '"base" must be a string'
      },
      {
        name: '### base: not exist',
        params: { base: 'not-exist', path: 'utils-test/temp/setting.json' },
        error: 'base directory: "not-exist" is not exists'
      },
      {
        name: '### path: invalid type',
        params: { path: 1 },
        error: '"path" must be a string'
      },
      {
        name: '### path: invalid type',
        params: { path: 'not-a-file' },
        error: 'path: "not-a-file" must be a file'
      },
      {
        name: '### data: invalid type',
        params: { path: '.utils-test/setting.json', data: 1 },
        error: '"data" must be of type object'
      },
      {
        name: '### transformer: invalid type',
        params: {
          path: '.utils-test/setting.json',
          data: {},
          transformer: 1
        },
        error: '"transformer" must be of type function'
      },
      {
        name: '### transformer: not peer serializer',
        params: {
          path: '.utils-test/setting.yaml',
          data: {},
          transformer: yamlTransformer
        },
        error:
          '"options" contains [transformer] without its required peers [serializer]'
      },
      {
        name: '### serializer: not peer transformer',
        params: {
          path: '.utils-test/setting.yaml',
          data: {},
          serializer: yamlSerializer
        },
        error:
          '"options" contains [serializer] without its required peers [transformer]'
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        expect(() => {
          // @ts-expect-error
          new Profile(item.params)
        }).toThrowError(item.error)
      })
    }
  })
  describe('## verify result', () => {
    describe('### create file', () => {
      const cases = [
        {
          name: '#### json',
          params: {
            path: '.utils-test/setting.json',
            data: {
              a: '1'
            }
          },
          url: resolve(homedir(), '.utils-test/setting.json')
        },
        {
          name: '#### yaml',
          params: {
            path: '.utils-test/setting.yaml',
            data: {
              a: '1',
              b: 2,
              c: [1, 2, 3, 4],
              d: {
                d1: 'd1Value',
                d2: 'd1Value',
                d3: {
                  d31: 'd31Value'
                }
              }
            },
            serializer: yamlSerializer,
            transformer: yamlTransformer
          },
          url: resolve(homedir(), '.utils-test/setting.yaml')
        },
        {
          name: '#### toml',
          params: {
            path: '.utils-test/setting.toml',
            data: {
              a: '1',
              b: 2,
              c: [1, 2, 3, 4],
              d: {
                d1: 'd1Value',
                d2: 'd1Value',
                d3: {
                  d31: 'd31Value'
                }
              }
            },
            serializer: tomlSerializer,
            transformer: tomlTransformer
          },
          url: resolve(homedir(), '.utils-test/setting.toml')
        },
        {
          name: '#### ini',
          params: {
            path: '.utils-test/setting.ini',
            data: {
              a: '1',
              b: 2,
              c: [1, 2, 3, 4],
              d: {
                d1: 'd1Value',
                d2: 'd1Value',
                d3: {
                  d31: 'd31Value'
                }
              }
            },
            serializer: iniSerializer,
            transformer: iniTransformer
          },
          url: resolve(homedir(), '.utils-test/setting.ini')
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          const file = new Profile(item.params)
          expect(file.getUrl()).toBe(item.url)
          expect(file.getData()).toEqual(item.params.data)
          file.remove()
        })
      }
    })
    describe('### update file', () => {
      it('### correct', () => {
        const file = new Profile({
          path: '.utils-test/setting.json',
          data: {
            a: '1',
            b: 1,
            c: false,
            d: [1, 2, { d1: 'd1Value' }],
            e: { e1: 'e1Value' }
          }
        })
        expect(file.get('d')[2].d1).toBe('d1Value')
        expect(file.get('e').e1).toBe('e1Value')
        expect(file.getData()).toEqual({
          a: '1',
          b: 1,
          c: false,
          d: [1, 2, { d1: 'd1Value' }],
          e: { e1: 'e1Value' }
        })
        file.delete('e')
        expect(file.getData()).toEqual({
          a: '1',
          b: 1,
          c: false,
          d: [1, 2, { d1: 'd1Value' }]
        })
        file.clear()
        expect(file.getData()).toEqual({})
        file.remove()
        const filepath = file.getUrl()
        expect(existsSync(filepath)).toBeFalsy()
      })
      it('## error', () => {
        const file = new Profile({
          path: '.utils-test/setting.json'
        })
        expect(() => {
          // @ts-expect-error
          file.set([], 1111)
        }).toThrowError('invalid params for function set()')
        file.remove()
      })
    })
    describe('### file already exist', () => {
      it('#### test already file data', () => {
        new Profile({
          path: '.utils-test/setting.json',
          data: { a: 'history data' }
        })
        const file = new Profile({ path: '.utils-test/setting.json' })
        expect(file.get('a')).toBe('history data')
      })
    })
  })
  afterAll(() => {
    removeSync(resolve(homedir(), '.utils-test'))
  })
})
