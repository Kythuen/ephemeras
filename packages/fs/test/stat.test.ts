import { vol } from 'memfs'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { stat } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# stat()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: undefined
      },
      {
        name: '### invalid path',
        params: null
      },
      {
        name: '### not exist path',
        params: '/not_exist'
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await stat(item.params)
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
        '/tmp/exist_dir': null,
        '/exist_file.txt': 'exist file content'
      })
    })

    const cases = [
      {
        name: '### directory',
        params: ['/exist_dir'],
        type: 'isFile'
      },
      {
        name: '### file',
        params: ['/exist_file.txt'],
        type: 'isDirectory'
      },
      {
        name: '### {context}',
        params: ['/exist_file.txt', { context: '/tmp' }],
        type: 'isDirectory'
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        // @ts-ignore
        const targetStat = await stat(...item.params)
        // @ts-ignore
        expect(targetStat[item.type]).toBeTruthy()
      })
    }
  })
})
