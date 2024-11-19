import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { relativePath, unixPath, getLeafs } from '../src'
import { noDisk } from './utils'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# unixPath()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: undefined
      },
      {
        name: '### path null',
        params: null
      },
      {
        name: '### path number',
        params: 1
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        try {
          // @ts-expect-error
          unixPath(item.params)
        } catch (e: any) {
          expect(e).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const cases = [
      {
        name: '### path win32',
        params: 'D:\\xxxx\\xxx',
        result: 'D:/xxxx/xxx'
      },
      {
        name: '### path posix',
        params: 'xxxx/xxx/xx',
        result: 'xxxx/xxx/xx'
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        expect(typeof unixPath(item.params)).toBe('string')
        expect(unixPath(item.params)).toBe(item.result)
      })
    }
  })
})

describe('# relativePath()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: [undefined, undefined]
      },
      {
        name: '### path null',
        params: [null, null]
      },
      {
        name: '### path number',
        params: [1, 1]
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        try {
          // @ts-expect-error
          relativePath(item.params)
        } catch (e) {
          expect(e).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const cases = [
      {
        name: '### paths: win32',
        params: ['D:\\xxxx\\sub\\1.txt', 'D:\\xxxx'],
        result: 'sub/1.txt'
      },
      {
        name: '### paths: posix',
        params: ['/xxxx/xxx/xx/x.txt', '/xxxx'],
        result: 'xxx/xx/x.txt'
      },
      {
        name: '### paths: posix & win32',
        params: ['xxxx/xxx/xx/x.txt', 'xxxx\\xxx'],
        result: 'xx/x.txt'
      },
      {
        name: '### paths: diff',
        params: ['xxxx/xxx/xx/x.txt', 'aaaa\\xxx'],
        result: 'xxxx/xxx/xx/x.txt'
      },
      {
        name: '### paths: no base path',
        params: ['xxxx/xxx/xx/x.txt'],
        result: 'xxxx/xxx/xx/x.txt'
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        // @ts-ignore
        expect(relativePath(...item.params)).toBe(item.result)
      })
    }
  })
})

describe('# getLeafs()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: [undefined]
      },
      {
        name: '### invalid path',
        params: [null]
      },
      {
        name: '### path number',
        params: [1]
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        try {
          // @ts-expect-error
          getLeafs(item.params)
        } catch (e) {
          expect(e).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const GET_LEAF_DIR = '/get_leaf_dir'
    const FILES = {
      '1.txt': '1',
      '2.txt': '2',
      '3.txt': '3',
      'sub1/1.txt': 'sub1-1',
      'sub1/2.txt': 'sub1-2',
      'sub1/3.txt': 'sub1-3',
      'sub2/1.txt': 'sub2-1',
      'sub2/2.txt': 'sub2-2',
      'sub2/3.txt': 'sub2-3',
      'sub3': null
    }
    beforeEach(() => {
      vol.reset()
      vol.fromJSON(FILES, GET_LEAF_DIR)
    })
    it('### base', async () => {
      expect(vol.existsSync(GET_LEAF_DIR)).toBeTruthy()
      const result = getLeafs(GET_LEAF_DIR)
      expect(result.length).toBe(
        Object.keys(vol.toJSON(GET_LEAF_DIR, {}, true)).length
      )
      expect(noDisk(result[0])).toEqual('/get_leaf_dir/1.txt')
    })
    it('### {context}', async () => {
      expect(vol.existsSync(GET_LEAF_DIR)).toBeTruthy()

      const result = getLeafs('sub1', {
        context: GET_LEAF_DIR,
        relativize: true
      })

      expect(result).toEqual(
        Object.keys(vol.toJSON(`${GET_LEAF_DIR}/sub1`, {}, true))
      )
      expect(noDisk(result[0])).toEqual('1.txt')
    })
    it('### {relativize}', async () => {
      expect(vol.existsSync(GET_LEAF_DIR)).toBeTruthy()
      const result = getLeafs(GET_LEAF_DIR, { relativize: true })
      expect(result).toEqual(Object.keys(vol.toJSON(GET_LEAF_DIR, {}, true)))
      expect(noDisk(result[0])).toEqual('1.txt')
    })
    it('### {emptyDir}', async () => {
      expect(vol.existsSync(GET_LEAF_DIR)).toBeTruthy()

      const result = getLeafs(GET_LEAF_DIR, {
        emptyDir: false
      })

      expect(result.includes('sub3')).toBeFalsy()
      expect(noDisk(result[0])).toEqual(`${GET_LEAF_DIR}/1.txt`)
    })
  })
})
