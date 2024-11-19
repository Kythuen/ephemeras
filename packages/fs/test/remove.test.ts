import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { removeDir, removeFile } from '../src'
import { noDisk } from './utils'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# removeFile()', () => {
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
          await removeFile(...item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const REMOVE_FILE = '/remove_file.txt'
    beforeEach(() => {
      vol.reset()
    })
    it('### base', async () => {
      vol.writeFileSync(REMOVE_FILE, 'remove file content')
      expect(vol.existsSync(REMOVE_FILE)).toBeTruthy()

      const result = await removeFile(REMOVE_FILE)
      expect(result).toBeTruthy()

      expect(vol.existsSync(REMOVE_FILE)).toBeFalsy()
    })
    it('### {context}', async () => {
      const REMOVE_FILE = 'remove_file.txt'
      vol.mkdirSync('/tmp')
      vol.writeFileSync('/tmp/remove_file.txt', 'remove file content')
      expect(vol.existsSync('/tmp/remove_file.txt')).toBeTruthy()

      const result = await removeFile(REMOVE_FILE, {
        context: '/tmp'
      })

      expect(result).toBeTruthy()
      expect(vol.existsSync('/tmp/remove_file.txt')).toBeFalsy()
    })
    it('### file not exist', async () => {
      expect(vol.existsSync('remove_file.txt')).toBeFalsy()

      const result = await removeFile('remove_file.txt')
      expect(result).toBeFalsy()

      expect(vol.existsSync('remove_file.txt')).toBeFalsy()
    })
  })
})

describe('# removeDir()', () => {
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
          await removeDir(...item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const REMOVE_DIR = '/remove_dir'
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
      vol.fromJSON(FILES, REMOVE_DIR)
    })
    it('### base', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR)

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(REMOVE_DIR)).toBeFalsy()
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/1.txt`)
    })
    it('### {context}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir('sub1', {
        context: REMOVE_DIR
      })

      expect(all.length).toBe(3)
      expect(done.length).toBe(3)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(`${REMOVE_DIR}/sub1`)).toBeFalsy()
      expect(Object.keys(vol.toJSON()).length).toBe(7)
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/sub1/1.txt`)
    })
    it('### {relativize}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        relativize: true
      })

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)

      expect(all.every(i => !i.includes(REMOVE_DIR))).toBeTruthy()
      expect(done.every(i => !i.includes(REMOVE_DIR))).toBeTruthy()
      expect(vol.existsSync(REMOVE_DIR)).toBeFalsy()
      expect(noDisk(all[0])).toBe('1.txt')
    })
    it('### {includes}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        includes: ['**/1.txt']
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 3)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(3)
      expect(skip.length).toBe(srcLength - 3)
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/1.txt`)
    })
    it('### {excludes}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        excludes: ['**/1.txt']
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength - 3)
      expect(skip.length).toBe(3)
      expect(Object.keys(vol.toJSON()).length).toBe(3)
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/1.txt`)
    })
    it('### {filter}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        filter: (path, stat) => stat.isFile() && path.includes('1.txt')
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 3)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(3)
      expect(skip.length).toBe(srcLength - 3)
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/1.txt`)
    })
    it('### {beforeEach}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      function eachHandler(path: string) {
        return path
      }
      const mock = vi.fn().mockImplementation(eachHandler)

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        beforeEach: mock,
        relativize: true
      })

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(REMOVE_DIR)).toBeFalsy()
      expect(noDisk(all[0])).toBe('1.txt')

      expect(mock).toHaveBeenCalledTimes(srcLength)
      expect(mock.mock.results[3].value).toBe('sub1/1.txt')
      expect(mock.mock.results[9].value).toBe('sub3')
    })
    it('### {afterEach}', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      function eachHandler(path: string) {
        return path
      }
      const mock = vi.fn().mockImplementation(eachHandler)

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        afterEach: mock,
        relativize: true
      })

      const srcLength = Object.keys(FILES).length
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(srcLength)
      expect(skip.length).toBe(0)
      expect(vol.existsSync(REMOVE_DIR)).toBeFalsy()
      expect(noDisk(all[0])).toBe('1.txt')

      expect(mock).toHaveBeenCalledTimes(srcLength)
      expect(mock.mock.results[3].value).toBe('sub1/1.txt')
      expect(mock.mock.results[9].value).toBe('sub3')
    })
    it('### includes excludes', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        includes: ['**/sub2/**'],
        excludes: ['**/1.txt']
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 2)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(2)
      expect(skip.length).toBe(srcLength - 2)
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/1.txt`)
    })
    it('### includes excludes filter', async () => {
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()

      const { all, done, skip } = await removeDir(REMOVE_DIR, {
        includes: ['**/sub1/**', '**/sub2/**'],
        excludes: ['**/sub2/**'],
        filter: (path, stat) => stat.isFile() && path.includes('1.txt')
      })

      const srcLength = Object.keys(FILES).length
      expect(vol.existsSync(REMOVE_DIR)).toBeTruthy()
      expect(Object.keys(vol.toJSON()).length).toBe(srcLength - 1)
      expect(all.length).toBe(srcLength)
      expect(done.length).toBe(1)
      expect(skip.length).toBe(srcLength - 1)
      expect(noDisk(all[0])).toBe(`${REMOVE_DIR}/1.txt`)
    })
  })
})
