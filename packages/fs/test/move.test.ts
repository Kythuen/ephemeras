import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { moveDir, moveFile, MoveStrategy } from '../src'
import { noDisk } from './utils'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# moveFile()', () => {
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
          await moveFile(...item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    const MOVE_FILE_SRC = '/move_file_src.txt'
    const MOVE_FILE_DEST = '/move_file_dest.txt'
    beforeEach(() => {
      vol.reset()
    })
    it('### base', async () => {
      vol.writeFileSync(MOVE_FILE_SRC, 'src file content')
      expect(vol.existsSync(MOVE_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeFalsy()

      const result = await moveFile(MOVE_FILE_SRC, MOVE_FILE_DEST)
      expect(result).toBeTruthy()

      expect(vol.existsSync(MOVE_FILE_SRC)).toBeFalsy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(MOVE_FILE_DEST, 'utf8')).toBe('src file content')
    })
    it('### {context}', async () => {
      vol.mkdirSync('/tmp')
      vol.writeFileSync('/tmp/move_file_src.txt', 'src file content')
      expect(vol.existsSync('/tmp/move_file_src.txt')).toBeTruthy()
      expect(vol.existsSync('/tmp/move_file_dest.txt')).toBeFalsy()

      const result = await moveFile('move_file_src.txt', 'move_file_dest.txt', {
        context: '/tmp'
      })
      expect(result).toBeTruthy()

      expect(vol.existsSync('/tmp/move_file_src.txt')).toBeFalsy()
      expect(vol.existsSync('/tmp/move_file_dest.txt')).toBeTruthy()
      expect(vol.readFileSync('/tmp/move_file_dest.txt', 'utf8')).toBe(
        'src file content'
      )
    })
    it('### {overwrite}', async () => {
      vol.writeFileSync(MOVE_FILE_SRC, 'src file content')
      vol.writeFileSync(MOVE_FILE_DEST, 'dest file content')
      expect(vol.existsSync(MOVE_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeTruthy()

      const result = await moveFile(MOVE_FILE_SRC, MOVE_FILE_DEST, {
        overwrite: true
      })
      expect(result).toBeTruthy()

      expect(vol.existsSync(MOVE_FILE_SRC)).toBeFalsy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(MOVE_FILE_DEST, 'utf8')).toBe('src file content')
    })
    it('### {strategy}', async () => {
      vol.writeFileSync(MOVE_FILE_SRC, 'src file content')
      expect(vol.existsSync(MOVE_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeFalsy()

      const result = await moveFile(MOVE_FILE_SRC, MOVE_FILE_DEST, {
        strategy: 'general'
      })
      expect(result).toBeTruthy()

      expect(vol.existsSync(MOVE_FILE_SRC)).toBeFalsy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(MOVE_FILE_DEST, 'utf8')).toBe('src file content')
    })
    it('### already exist', async () => {
      vol.writeFileSync(MOVE_FILE_SRC, 'src file content')
      vol.writeFileSync(MOVE_FILE_DEST, 'dest file content')
      expect(vol.existsSync(MOVE_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeTruthy()

      const result = await moveFile(MOVE_FILE_SRC, MOVE_FILE_DEST)
      expect(result).toBeFalsy()

      expect(vol.existsSync(MOVE_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeTruthy()
      expect(vol.readFileSync(MOVE_FILE_DEST, 'utf8')).toBe('dest file content')
    })
    it('### unknown error', async () => {
      vol.writeFileSync(MOVE_FILE_SRC, 'src file content')
      expect(vol.existsSync(MOVE_FILE_SRC)).toBeTruthy()
      expect(vol.existsSync(MOVE_FILE_DEST)).toBeFalsy()

      try {
        await moveFile(MOVE_FILE_SRC, MOVE_FILE_DEST, {
          before: () => {
            throw new Error('unknown error')
          }
        })
      } catch (err: any) {
        expect(err).toBeTruthy()
      }
    })
  })
})

describe('# moveDir()', () => {
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
        params: ['/foo/bar', null]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await moveDir(...item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  for (const strategy of [undefined, 'general'] as MoveStrategy[]) {
    describe('## correct cases', () => {
      const MOVE_DIR_SRC = '/move_dir_src'
      const MOVE_DIR_DEST = '/move_dir_dest'
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
        vol.fromJSON(FILES, MOVE_DIR_SRC)
      })
      it('### base', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(0)
        expect(dest.length).toBe(srcLength)
        expect(add.length).toBe(srcLength)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(0)
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### {context}', async () => {
        expect(vol.existsSync(`${MOVE_DIR_SRC}/sub1`)).toBeTruthy()
        expect(vol.existsSync(`${MOVE_DIR_SRC}/sub4`)).toBeFalsy()

        const { all, src, dest, add, update, skip } = await moveDir(
          'sub1',
          'sub4',
          { strategy, context: MOVE_DIR_SRC }
        )
        expect(vol.existsSync(`${MOVE_DIR_SRC}/sub1`)).toBeFalsy()
        expect(vol.existsSync(`${MOVE_DIR_SRC}/sub4`)).toBeTruthy()
        expect(all.length).toBe(3)
        expect(src.length).toBe(0)
        expect(dest.length).toBe(3)
        expect(add.length).toBe(3)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(0)
        expect(vol.existsSync(`${MOVE_DIR_SRC}/sub1`)).toBeFalsy()
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/sub1/1.txt`)
      })
      it('### {relativize}', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy, relativize: true }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(0)
        expect(dest.length).toBe(srcLength)
        expect(add.length).toBe(srcLength)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(0)
        expect(vol.existsSync(`${MOVE_DIR_SRC}/sub1`)).toBeFalsy()
        expect(noDisk(all[0])).toBe('1.txt')
      })
      it('### {overwrite}', async () => {
        vol.mkdirSync(MOVE_DIR_DEST)
        vol.mkdirSync(`${MOVE_DIR_DEST}/sub1`)
        vol.writeFileSync(`${MOVE_DIR_DEST}/sub1/1.txt`, 'exist content')

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy, overwrite: true }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(0)
        expect(dest.length).toBe(srcLength)
        expect(add.length).toBe(srcLength - 1)
        expect(update.length).toBe(1)
        expect(skip.length).toBe(0)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).toEqual(srcFilesRelative)
        expect(destFilesRelative['sub1/1.txt']).toBe('sub1-1')
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### {includes}', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy, includes: ['**/1.txt'] }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength - 3)
        expect(dest.length).toBe(3)
        expect(add.length).toBe(3)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcLength - 3)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### {excludes}', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy, excludes: ['**/1.txt'] }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(3)
        expect(dest.length).toBe(srcLength - 3)
        expect(add.length).toBe(srcLength - 3)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(3)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### {filter}', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          {
            strategy,
            filter: (path, stat) => stat.isFile() && path.includes('1.txt')
          }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength - 3)
        expect(dest.length).toBe(3)
        expect(add.length).toBe(3)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcLength - 3)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### {beforeEach}', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()

        function eachHandler(src: string) {
          return src
        }
        const mock = vi.fn().mockImplementation(eachHandler)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy, beforeEach: mock, relativize: true }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(0)
        expect(dest.length).toBe(srcLength)
        expect(add.length).toBe(srcLength)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(0)
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(noDisk(all[0])).toBe('1.txt')

        expect(mock).toHaveBeenCalledTimes(srcLength)
        expect(mock.mock.results[3].value).toBe('sub1/1.txt')
        expect(mock.mock.results[9].value).toBe('sub3')
      })
      it('### {afterEach}', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()

        function eachHandler(src: string) {
          return src
        }
        const mock = vi.fn().mockImplementation(eachHandler)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy, afterEach: mock, relativize: true }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(0)
        expect(dest.length).toBe(srcLength)
        expect(add.length).toBe(srcLength)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(0)
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeFalsy()
        expect(noDisk(all[0])).toBe('1.txt')

        expect(mock).toHaveBeenCalledTimes(srcLength)
        expect(mock.mock.results[3].value).toBe('sub1/1.txt')
        expect(mock.mock.results[9].value).toBe('sub3')
      })
      it('### already exist', async () => {
        vol.mkdirSync(MOVE_DIR_DEST)
        vol.mkdirSync(`${MOVE_DIR_DEST}/sub1`)
        vol.writeFileSync(`${MOVE_DIR_DEST}/sub1/1.txt`, 'exist content')

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          { strategy }
        )
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(1)
        expect(dest.length).toBe(srcLength)
        expect(add.length).toBe(srcLength - 1)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(1)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(destFilesRelative['sub1/1.txt']).toBe('exist content')
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### includes filter', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          {
            strategy,
            includes: ['**/1.txt'],
            filter: (path, stat) => stat.isFile() && !path.includes('1.txt')
          }
        )

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength)
        expect(dest.length).toBe(0)
        expect(add.length).toBe(0)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcLength)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### excludes filter', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          {
            strategy,
            excludes: ['**/1.txt'],
            filter: (path, stat) => stat.isFile() && path.includes('1.txt')
          }
        )

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength)
        expect(dest.length).toBe(0)
        expect(add.length).toBe(0)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcLength)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### includes excludes', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          {
            strategy,
            includes: ['**/sub1/**'],
            excludes: ['**/1.txt', '**/2.txt']
          }
        )

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength - 1)
        expect(dest.length).toBe(1)
        expect(add.length).toBe(1)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcLength - 1)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### includes excludes filter', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          {
            strategy,
            includes: ['**/sub1/**', '**/sub2/**'],
            excludes: ['**/1.txt'],
            filter: (path, stat) => stat.isFile() && path.includes('2.txt')
          }
        )

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength - 2)
        expect(dest.length).toBe(2)
        expect(add.length).toBe(2)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcLength - 2)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### includes excludes filter overwrite', async () => {
        vol.mkdirSync(MOVE_DIR_DEST)
        vol.mkdirSync(`${MOVE_DIR_DEST}/sub1`)
        vol.writeFileSync(`${MOVE_DIR_DEST}/sub1/1.txt`, 'exist content')

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcFilesRelative = vol.toJSON(MOVE_DIR_SRC, {}, true)

        const { all, src, dest, add, update, skip } = await moveDir(
          MOVE_DIR_SRC,
          MOVE_DIR_DEST,
          {
            strategy,
            includes: ['**/sub1/**', '**/sub2/**'],
            excludes: ['**/2.txt'],
            filter: (path, stat) => stat.isFile() && path.includes('1.txt'),
            overwrite: true
          }
        )

        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeTruthy()
        const srcLength = Object.keys(FILES).length
        expect(all.length).toBe(srcLength)
        expect(src.length).toBe(srcLength - 2)
        expect(dest.length).toBe(2)
        expect(add.length).toBe(1)
        expect(update.length).toBe(1)
        expect(skip.length).toBe(srcLength - 2)
        const destFilesRelative = vol.toJSON(MOVE_DIR_DEST, {}, true)
        expect(destFilesRelative).not.toEqual(srcFilesRelative)
        expect(destFilesRelative['sub1/1.txt']).toBe('sub1-1')
        expect(noDisk(all[0])).toBe(`${MOVE_DIR_SRC}/1.txt`)
      })
      it('### unknown error', async () => {
        expect(vol.existsSync(MOVE_DIR_SRC)).toBeTruthy()
        expect(vol.existsSync(MOVE_DIR_DEST)).toBeFalsy()

        function eachHandler() {
          throw new Error('unknown error')
        }
        const mock = vi.fn().mockImplementation(eachHandler)

        try {
          await moveDir(MOVE_DIR_SRC, MOVE_DIR_DEST, {
            strategy,
            beforeEach: mock,
            relativize: true
          })
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    })
  }
})
