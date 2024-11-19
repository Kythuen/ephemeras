import { vol } from 'memfs'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { readJSON } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# readJSON()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: undefined
      },
      {
        name: '### invalid path',
        params: null
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await readJSON(item.params)
        } catch (e) {
          expect(e).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', async () => {
    beforeAll(() => {
      vol.reset()
      vol.fromJSON({
        '/exist_file.json': `{ "a": 1, "b": "2", "c": true }`
      })
    })
    it('### JSON file', async () => {
      const result = await readJSON('/exist_file.json')
      expect(result).toEqual({ a: 1, b: '2', c: true })
    })
    it('### not exist JSON file', async () => {
      const result = await readJSON('/not_exist_file.json')
      expect(result).toEqual({})
    })
  })
})
