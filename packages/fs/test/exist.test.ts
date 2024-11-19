import { vol } from 'memfs'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { exist } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# exits()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: undefined
      },
      {
        name: '### path null',
        params: null
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await exist(item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    beforeAll(() => {
      vol.reset()
      vol.fromJSON({
        '/exist_dir': null,
        '/exist_file.txt': 'exist file content'
      })
    })

    const cases = [
      {
        name: '### directory exist',
        params: '/exist_dir',
        result: true
      },
      {
        name: '### directory not exist',
        params: '/not_exist_dir',
        result: false
      },
      {
        name: '### file exist',
        params: '/exist_file.txt',
        result: true
      },
      {
        name: '### file not exist',
        params: '/not_exist_file.txt',
        result: false
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        const result = await exist(item.params)
        expect(result).toBe(item.result)
      })
    }
  })
})
