import { describe, expect, it } from 'vitest'
import { to, toRelativePath, toUnixPath } from '../src/common'

describe('# common', () => {
  describe('## toUnixPath', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: undefined,
          error: `Cannot read properties of undefined (reading 'replace')`
        },
        {
          name: '#### invalid path: null',
          params: null,
          error: `Cannot read properties of null (reading 'replace')`
        },
        {
          name: '#### invalid path: number',
          params: 1,
          error: `path.replace is not a function`
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          try {
            // @ts-expect-error
            toUnixPath(item.params)
          } catch (e: any) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      const cases = [
        {
          name: '#### correct path: string',
          params: 'D:\\xxxx',
          result: 'D:/xxxx'
        },
        {
          name: '#### correct path: Buffer',
          params: Buffer.from('D:\\xxxx').toString(),
          result: 'D:/xxxx'
        },
        {
          name: '#### correct path: URL',
          params: new URL('D:\\xxxx').href,
          result: 'd:/xxxx'
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          expect(typeof toUnixPath(item.params)).toBe('string')
          expect(toUnixPath(item.params)).toBe(item.result)
        })
      }
    })
  })
  describe('## toRelativePath', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: [undefined, undefined],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid path: null',
          params: [null, null],
          error: `Invalid path detected: (null).`
        },
        {
          name: '#### invalid path: number',
          params: [1, 1],
          error: `Invalid path detected: (1).`
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          try {
            // @ts-expect-error
            toRelativePath(item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      const cases = [
        {
          name: '#### correct path: string',
          params: ['D:\\xxxx\\sub\\1.txt', 'D:\\xxxx'],
          result: 'sub\\1.txt'
        },
        {
          name: '#### correct path: Buffer',
          params: [Buffer.from('D:\\xxxx\\sub\\1.txt').toString(), 'D:\\xxxx'],
          result: 'sub\\1.txt'
        },
        {
          name: '#### correct path: URL',
          params: [
            Buffer.from('D:\\xxxx\\sub\\1.txt').toString(),
            'D:\\xxxx\\sub'
          ],
          result: '1.txt'
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          // @ts-expect-error
          expect(typeof toRelativePath(...item.params)).toBe('string')
          // @ts-expect-error
          expect(toRelativePath(...item.params)).toBe(item.result)
        })
      }
    })
  })
  describe('## to', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: undefined
        },
        {
          name: '#### invalid path: null',
          params: null
        },
        {
          name: '#### invalid path: number',
          params: 1
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await to(item.params)
          } catch (e) {
            expect(e).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', () => {
      it('#### resolve', async () => {
        const [err, data] = await to(new Promise(resolve => resolve('1')))
        expect(err).toBeFalsy()
        expect(data).toBe('1')
      })
      it('#### reject', async () => {
        const [err, data] = await to(
          new Promise((resolve, reject) => reject('error 1'))
        )
        expect(err).toEqual('error 1')
        expect(data).toBeFalsy()
      })
    })
  })
})
