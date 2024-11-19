import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { emptyDir } from '../src'
import { noDisk } from './utils'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# emptyDir()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: []
      },
      {
        name: '### invalid path',
        params: [null]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await emptyDir(...item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const EMPTY_DIR = '/empty_dir'
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
      vol.fromJSON(FILES, EMPTY_DIR)
    })
    it('### base', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR)

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(vol.readdirSync(EMPTY_DIR).length).toBe(0)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/1.txt`)
    })
    it('### {context}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir('sub1', {
        context: EMPTY_DIR
      })

      expect(all.length).toBe(3)
      expect(done.length).toBe(3)
      expect(skip.length).toBe(0)

      expect(vol.existsSync(`${EMPTY_DIR}/sub1`)).toBeTruthy()
      expect(vol.readdirSync(`${EMPTY_DIR}/sub1`).length).toBe(0)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/sub1/1.txt`)
    })
    it('### {relativize}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        relativize: true
      })

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)

      expect(all.every(i => !i.includes(EMPTY_DIR))).toBeTruthy()
      expect(done.every(i => !i.includes(EMPTY_DIR))).toBeTruthy()
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(vol.readdirSync(EMPTY_DIR).length).toBe(0)
      expect(noDisk(all[0])).toBe('1.txt')
    })
    it('### {includes}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        includes: ['**/1.txt']
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 3)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(3)
      expect(skip.length).toBe(srcLength - 3)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/1.txt`)
    })
    it('### {excludes}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        excludes: ['**/1.txt']
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength - 3)
      expect(skip.length).toBe(3)
      expect(Object.keys(vol.toJSON()).length).toBe(3)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/1.txt`)
    })
    it('### {filter}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        filter: (path, stat) => stat.isFile() && path.includes('1.txt')
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 3)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(3)
      expect(skip.length).toBe(srcLength - 3)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/1.txt`)
    })
    it('### {beforeEach}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      function eachHandler(src: string) {
        return src
      }
      const mock = vi.fn().mockImplementation(eachHandler)

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        beforeEach: mock,
        relativize: true
      })

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(vol.readdirSync(EMPTY_DIR).length).toBe(0)
      expect(noDisk(all[0])).toBe('1.txt')

      expect(mock).toHaveBeenCalledTimes(srcLength)
      expect(mock.mock.results[3].value).toBe('sub1/1.txt')
      expect(mock.mock.results[9].value).toBe('sub3')
    })
    it('### {afterEach}', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      function eachHandler(src: string) {
        return src
      }
      const mock = vi.fn().mockImplementation(eachHandler)

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        afterEach: mock,
        relativize: true
      })

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(vol.readdirSync(EMPTY_DIR).length).toBe(0)
      expect(noDisk(all[0])).toBe('1.txt')

      expect(mock).toHaveBeenCalledTimes(srcLength)
      expect(mock.mock.results[3].value).toBe('sub1/1.txt')
      expect(mock.mock.results[9].value).toBe('sub3')
    })
    it('### includes excludes', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        includes: ['**/sub2/**'],
        excludes: ['**/1.txt']
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 2)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(2)
      expect(skip.length).toBe(srcLength - 2)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/1.txt`)
    })
    it('### includes excludes filter', async () => {
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()

      const { all, done, skip } = await emptyDir(EMPTY_DIR, {
        includes: ['**/sub1/**', '**/sub2/**'],
        excludes: ['**/sub2/**'],
        filter: (path, stat) => stat.isFile() && path.includes('1.txt')
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(EMPTY_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 1)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(1)
      expect(skip.length).toBe(srcLength - 1)
      expect(noDisk(all[0])).toBe(`${EMPTY_DIR}/1.txt`)
    })
  })
})
