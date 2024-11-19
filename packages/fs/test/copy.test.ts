import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { copyDir, copyFile } from '../src'
import { noDisk } from './utils'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# copyFile()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: []
      },
      {
        name: '### invalid src',
        params: [null]
      },
      {
        name: '### invalid dest',
        params: ['/exist_file.txt', null]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await copyFile(...item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const COPY_FILE_SRC = '/copy_file_src.txt'
    const COPY_FILE_DEST = '/copy_file_dest.txt'
    beforeEach(() => {
      vol.reset()
    })
    it('### base', async () => {
      vol.writeFileSync(COPY_FILE_SRC, 'src file content')
      expect(vol.existsSync(COPY_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_FILE_DEST)).toBeFalsy()

      const result = await copyFile(COPY_FILE_SRC, COPY_FILE_DEST)
      expect(result).toBeTruthy()

      expect(vol.existsSync(COPY_FILE_SRC)).toBeTruthy()
      expect(vol.readFileSync(COPY_FILE_SRC, 'utf8')).toBe('src file content')

      expect(vol.existsSync(COPY_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(COPY_FILE_DEST, 'utf8')).toBe('src file content')
    })
    it('### {overwrite}', async () => {
      vol.writeFileSync(COPY_FILE_SRC, 'src file content')
      vol.writeFileSync(COPY_FILE_DEST, 'dest file content')
      expect(vol.existsSync(COPY_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_FILE_DEST)).toBeTruthy()

      const result = await copyFile(COPY_FILE_SRC, COPY_FILE_DEST, {
        overwrite: true
      })
      expect(result).toBeTruthy()

      expect(vol.existsSync(COPY_FILE_SRC)).toBeTruthy()
      expect(vol.readFileSync(COPY_FILE_SRC, 'utf8')).toBe('src file content')

      expect(vol.existsSync(COPY_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(COPY_FILE_DEST, 'utf8')).toBe('src file content')
    })
    it('### {context}', async () => {
      vol.mkdirSync('/tmp')
      vol.writeFileSync(`/tmp/copy_file_src.txt`, 'src file content')
      expect(vol.existsSync('/tmp/copy_file_src.txt')).toBeTruthy()
      expect(vol.existsSync('/tmp/copy_file_dest.txt')).toBeFalsy()

      const result = await copyFile('copy_file_src.txt', 'copy_file_dest.txt', {
        context: '/tmp'
      })
      expect(result).toBeTruthy()

      expect(vol.existsSync('/tmp/copy_file_src.txt')).toBeTruthy()
      expect(vol.existsSync('/tmp/copy_file_dest.txt')).toBeTruthy()
      expect(vol.readFileSync('/tmp/copy_file_dest.txt', 'utf8')).toBe(
        'src file content'
      )
    })
    it('### already exist', async () => {
      vol.writeFileSync(COPY_FILE_SRC, 'src file content')
      vol.writeFileSync(COPY_FILE_DEST, 'dest file content')
      expect(vol.existsSync(COPY_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_FILE_DEST)).toBeTruthy()

      const result = await copyFile(COPY_FILE_SRC, COPY_FILE_DEST)
      expect(result).toBeFalsy()

      expect(vol.existsSync(COPY_FILE_SRC)).toBeTruthy()
      expect(vol.readFileSync(COPY_FILE_SRC, 'utf8')).toBe('src file content')

      expect(vol.existsSync(COPY_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(COPY_FILE_DEST, 'utf8')).toBe('dest file content')
    })
    it('### context overwrite', async () => {
      vol.mkdirSync('/tmp')
      vol.writeFileSync(`/tmp/copy_file_src.txt`, 'src file content')
      vol.writeFileSync('/tmp/copy_file_dest.txt', 'dest file content')
      expect(vol.existsSync('/tmp/copy_file_src.txt')).toBeTruthy()
      expect(vol.existsSync('/tmp/copy_file_dest.txt')).toBeTruthy()

      const result = await copyFile('copy_file_src.txt', 'copy_file_dest.txt', {
        overwrite: true,
        context: '/tmp'
      })
      expect(result).toBeTruthy()

      expect(vol.existsSync('/tmp/copy_file_src.txt')).toBeTruthy()
      expect(vol.readFileSync('/tmp/copy_file_src.txt', 'utf8')).toBe(
        'src file content'
      )

      expect(vol.existsSync('/tmp/copy_file_dest.txt')).toBeTruthy()
      expect(vol.readFileSync('/tmp/copy_file_dest.txt', 'utf8')).toBe(
        'src file content'
      )
    })
  })
})

describe('# copyDir()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: []
      },
      {
        name: '### invalid src',
        params: [null]
      },
      {
        name: '### invalid dest',
        params: ['/exist_dir', null]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await copyDir(...item.params)
        } catch (e) {
          expect(e).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const COPY_DIR_SRC = '/copy_dir_src'
    const COPY_DIR_DEST = '/copy_dir_dest'
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
      vol.fromJSON(FILES, COPY_DIR_SRC)
    })
    it('### base', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength)
      expect(add.length).toBe(srcLength)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(0)
      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      const srcFilesRelative = vol.toJSON(COPY_DIR_SRC, {}, true)
      expect(destFilesRelative).toEqual(srcFilesRelative)
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### {relativize}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { relativize: true }
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength)
      expect(add.length).toBe(srcLength)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(0)
      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      const srcFilesRelative = vol.toJSON(COPY_DIR_SRC, {}, true)
      expect(destFilesRelative).toEqual(srcFilesRelative)
      expect(noDisk(src[0])).toBe('1.txt')
    })
    it('### {context}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(`${COPY_DIR_SRC}/sub4`)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir('sub1', 'sub4', {
        context: COPY_DIR_SRC
      })

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(`${COPY_DIR_SRC}/sub4`)).toBeTruthy()
      expect(src.length).toBe(3)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(0)
      const destFilesRelative = vol.toJSON(`${COPY_DIR_SRC}/sub4`, {}, true)
      const srcFilesRelative = vol.toJSON(`${COPY_DIR_SRC}/sub1`, {}, true)
      expect(destFilesRelative).toEqual(srcFilesRelative)
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/sub1/1.txt`)
    })
    it('### {overwrite}', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { overwrite: true }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      const srcFilesRelative = vol.toJSON(COPY_DIR_SRC, {}, true)
      expect(destFilesRelative).toEqual(srcFilesRelative)
      // expect(destFilesRelative).toEqual({})

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength)
      expect(add.length).toBe(srcLength - 1)
      expect(update.length).toBe(1)
      expect(skip.length).toBe(0)
      expect(destFilesRelative['sub1/1.txt']).toBe('sub1-1')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### {includes}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { includes: ['**/1.txt'] }
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 3)
      expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(skip.every(i => !i.includes('1.txt'))).toBeTruthy()
      expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### {excludes}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { excludes: ['**/1.txt'] }
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength - 3)
      expect(add.length).toBe(srcLength - 3)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(3)
      expect(add.every(i => !i.includes('1.txt'))).toBeTruthy()
      expect(skip.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### {filter}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          filter: (path, stat) => stat.isFile() && path.includes('1.txt')
        }
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 3)
      expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(skip.every(i => !i.includes('1.txt'))).toBeTruthy()
      expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### {beforeEach}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      function eachHandler(_: string, dest: string) {
        return dest
      }
      const mock = vi.fn().mockImplementation(eachHandler)

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { beforeEach: mock, relativize: true }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      const srcFilesRelative = vol.toJSON(COPY_DIR_SRC, {}, true)
      expect(destFilesRelative).toEqual(srcFilesRelative)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength)
      expect(add.length).toBe(srcLength)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(0)
      expect(noDisk(src[0])).toBe('1.txt')

      expect(mock).toHaveBeenCalledTimes(srcLength)
      expect(mock.mock.results[3].value).toBe('sub1/1.txt')
      expect(mock.mock.results[9].value).toBe('sub3')
    })
    it('### {afterEach}', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      function eachHandler(_: string, dest: string) {
        return dest
      }
      const mock = vi.fn().mockImplementation(eachHandler)

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { afterEach: mock, relativize: true }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      const srcFilesRelative = vol.toJSON(COPY_DIR_SRC, {}, true)
      expect(destFilesRelative).toEqual(srcFilesRelative)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength)
      expect(add.length).toBe(srcLength)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(0)
      expect(noDisk(src[0])).toBe('1.txt')

      expect(mock).toHaveBeenCalledTimes(srcLength)
      expect(mock.mock.results[3].value).toBe('sub1/1.txt')
      expect(mock.mock.results[9].value).toBe('sub3')
    })
    it('### already exist', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength)
      expect(add.length).toBe(srcLength - 1)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(1)
      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      const srcFilesRelative = vol.toJSON(COPY_DIR_SRC, {}, true)
      expect(destFilesRelative).not.toEqual(srcFilesRelative)
      expect(destFilesRelative['sub1/1.txt']).toBe('exist content')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### exist includes', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { includes: ['**/1.txt'] }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3 - 1)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 3 + 1)
      expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(skip.filter(i => i.includes('1.txt')).length).toBe(1)
      expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)

      expect(destFilesRelative['sub1/1.txt']).toBe('exist content')
    })
    it('### exist includes overwrite', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { includes: ['**/1.txt'], overwrite: true }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3 - 1)
      expect(update.length).toBe(1)
      expect(skip.length).toBe(srcLength - 3)
      expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(skip.filter(i => i.includes('1.txt')).length).toBe(0)
      expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(destFilesRelative['sub1/1.txt']).toBe('sub1-1')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### exist excludes', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub2`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub2/2.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { excludes: ['**/1.txt'] }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength - 3)
      expect(add.length).toBe(srcLength - 3 - 1)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(3 + 1)
      expect(add.every(i => !i.includes('1.txt'))).toBeTruthy()
      expect(skip.filter(i => i.includes('1.txt')).length).toBe(3)
      expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()

      expect(destFilesRelative['sub2/2.txt']).toBe('exist content')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### exist excludes overwrite', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub2`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub2/2.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        { excludes: ['**/1.txt'], overwrite: true, relativize: true }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(srcLength - 3)
      expect(add.length).toBe(srcLength - 3 - 1)
      expect(update.length).toBe(1)
      expect(skip.length).toBe(3)
      expect(add.every(i => !i.includes('1.txt'))).toBeTruthy()
      expect(skip.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()

      expect(destFilesRelative['sub2/2.txt']).toBe('sub2-2')
      expect(noDisk(src[0])).toBe('1.txt')
    })
    it('### exist filter', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          filter: (path, stat) => stat.isFile() && path.includes('1.txt')
        }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3 - 1)
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 3 + 1)
      expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(skip.filter(i => i.includes('1.txt')).length).toBe(1)
      expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

      expect(destFilesRelative['sub1/1.txt']).toBe('exist content')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### exist filter overwrite', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          filter: (path, stat) => stat.isFile() && path.includes('1.txt'),
          overwrite: true
        }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(3)
      expect(add.length).toBe(3 - 1)
      expect(update.length).toBe(1)
      expect(skip.length).toBe(srcLength - 3)
      expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(skip.filter(i => i.includes('1.txt')).length).toBe(0)
      expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      expect(destFilesRelative['sub1/1.txt']).toBe('sub1-1')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### includes excludes', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          includes: ['**/sub1/**'],
          excludes: ['**/1.txt', '**/2.txt']
        }
      )

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(1)
      expect(add.length).toBe(1)
      expect(
        add.every(
          i =>
            i.includes('sub1') && !i.includes('1.txt') && !i.includes('2.txt')
        )
      ).toBeTruthy()
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 3 + 2)
      expect(
        skip.every(
          i => i.includes('1.txt') || i.includes('2.txt') || !i.includes('sub1')
        )
      ).toBeTruthy()
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### includes excludes filter', async () => {
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeFalsy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          includes: ['**/sub1/**', '**/sub2/**'],
          excludes: ['**/1.txt'],
          filter: (path, stat) => stat.isFile() && path.includes('2.txt')
        }
      )
      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(6 - 2 - 2)
      expect(add.length).toBe(dest.length)
      expect(
        add.every(
          i =>
            (i.includes('sub1') || i.includes('sub2') || i.includes('2.txt')) &&
            !i.includes('1.txt')
        )
      ).toBeTruthy()
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 6 + 2 + 2)
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### exist includes excludes filter', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/2.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          includes: ['**/sub1/**', '**/sub2/**'],
          excludes: ['**/1.txt'],
          filter: (path, stat) => stat.isFile() && path.includes('2.txt')
        }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(2)
      expect(add.length).toBe(dest.length - 1)
      expect(
        add.every(
          i =>
            (i.includes('sub1') || i.includes('sub2') || i.includes('2.txt')) &&
            !i.includes('1.txt')
        )
      ).toBeTruthy()
      expect(update.length).toBe(0)
      expect(skip.length).toBe(srcLength - 6 + 2 + 2 + 1)

      expect(destFilesRelative['sub1/2.txt']).toBe('exist content')
      expect(noDisk(src[0])).toBe(`${COPY_DIR_SRC}/1.txt`)
    })
    it('### exist includes excludes filter overwrite relativize', async () => {
      vol.mkdirSync(COPY_DIR_DEST)
      vol.mkdirSync(`${COPY_DIR_DEST}/sub1`)
      vol.writeFileSync(`${COPY_DIR_DEST}/sub1/2.txt`, 'exist content')

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()

      const { src, dest, add, update, skip } = await copyDir(
        COPY_DIR_SRC,
        COPY_DIR_DEST,
        {
          overwrite: true,
          includes: ['**/sub1/**', '**/sub2/**'],
          excludes: ['**/1.txt'],
          filter: (path, stat) => stat.isFile() && path.includes('2.txt'),
          relativize: true
        }
      )

      const destFilesRelative = vol.toJSON(COPY_DIR_DEST, {}, true)

      expect(vol.existsSync(COPY_DIR_SRC)).toBeTruthy()
      expect(vol.existsSync(COPY_DIR_DEST)).toBeTruthy()
      const srcLength = Object.keys(FILES).length
      expect(src.length).toBe(srcLength)
      expect(dest.length).toBe(2)
      expect(add.length).toBe(dest.length - 1)
      expect(
        add.every(
          i =>
            (i.includes('sub1') || i.includes('sub2') || i.includes('2.txt')) &&
            !i.includes('1.txt')
        )
      ).toBeTruthy()
      expect(update.length).toBe(1)
      expect(skip.length).toBe(srcLength - 6 + 2 + 2)

      expect(destFilesRelative['sub1/2.txt']).toBe('sub1-2')
      expect(noDisk(src[0])).toBe('1.txt')
    })
  })
})
