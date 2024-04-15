import { homedir } from 'node:os'
import { join } from 'node:path'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest'
import { renameMove, generalMove, move } from '../../src/fs'
import * as Utils from '../utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/move')
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'move_folder_not_exist')
const TEST_FOLDER_SRC = join(TEMP_ROOT, 'move_folder_src')
const TEST_FOLDER_DEST = join(TEMP_ROOT, 'move_folder_dest')
const TEST_FILE_SRC = join(TEMP_ROOT, 'move_file_src.txt')
const TEST_FILE_DEST = join(TEMP_ROOT, 'move_file_dest.txt')

async function createTestSrcFolder() {
  await Utils.ensureDir(TEST_FOLDER_SRC)
  await Utils.createFile(join(TEST_FOLDER_SRC, '1.txt'), '1')
  await Utils.createFile(join(TEST_FOLDER_SRC, '2.txt'), '2')
  await Utils.createFile(join(TEST_FOLDER_SRC, '3.txt'), '3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub1'))
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/1.txt'), 'sub1-1')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/2.txt'), 'sub1-2')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/3.txt'), 'sub1-3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub2'))
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/1.txt'), 'sub2-1')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/2.txt'), 'sub2-2')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/3.txt'), 'sub2-3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub3'))
}

async function createTestDestFolder() {
  await Utils.ensureDir(TEST_FOLDER_SRC)
  await Utils.createFile(join(TEST_FOLDER_SRC, '1.txt'), '1')
  await Utils.createFile(join(TEST_FOLDER_SRC, '2.txt'), '2')
  await Utils.createFile(join(TEST_FOLDER_SRC, '3.txt'), '3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub1'))
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/2.txt'), 'sub1-2')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/3.txt'), 'sub1-3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub2'))
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/1.txt'), 'sub2-1')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/3.txt'), 'sub2-3')
}

describe('# move', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## renameMove', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '### invalid path: undefined',
          params: [],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid path: null',
          params: [null],
          error: `Invalid path detected: (null).`
        },
        {
          name: '### invalid src path: null',
          params: [undefined, TEMP_ROOT],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid dest path: null',
          params: [TEMP_ROOT, undefined],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST],
          error: `getStats: (${TEST_FOLDER_NOT_EXIST}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await renameMove(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      beforeEach(async () => {
        await createTestSrcFolder()
      })
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### correct: base', async () => {
        const srcItems = Utils.getLeafItems(TEST_FOLDER_SRC)

        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItems)
      })
      it('#### correct: exist same', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')
        const srcItemsBefore = Utils.getLeafItems(TEST_FOLDER_SRC)
        const destItemsBefore = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItemsBefore).toEqual(['sub1/1.txt'])

        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual(['sub1/1.txt'])
        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItemsBefore)
      })
      it('#### correct: overwrite', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        const srcItemsBefore = Utils.getLeafItems(TEST_FOLDER_SRC)
        const destItemsBefore = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItemsBefore).toEqual(['sub1/1.txt'])

        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, { overwrite: true })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItemsBefore)

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub1-1')
      })
      it('#### correct: includes', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('sub1'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => i.includes('sub1'))).toBeTruthy()
      })
      it('#### correct: excludes', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          excludes: ['**/sub1/**']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => i.includes('sub1'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => !i.includes('sub1'))).toBeTruthy()
      })
      it('#### correct: filter', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('1.txt'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => i.includes('1.txt'))).toBeTruthy()
      })
      it('#### correct: includes excludes', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**'],
          excludes: ['**/2.txt']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('sub/2.txt'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub1/1.txt', 'sub1/3.txt'])
      })
      it('#### correct: includes filter', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub1/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/1.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: excludes filter', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          excludes: ['**/sub1/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['1.txt', 'sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: includes excludes filter', async () => {
        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**', '**/sub2/**', '**/sub3/**'],
          excludes: ['**/sub1/**', '**/sub3/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: includes excludes filter overwrite', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**', '**/sub2/**', '**/sub3/**'],
          excludes: ['**/sub1/**', '**/sub3/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt'),
          overwrite: true
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub2-1')
      })
    })
  })
  describe.only('## generalMove', () => {
    describe.skip('### invalid params', () => {
      const cases = [
        {
          name: '### invalid path: undefined',
          params: [],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid path: null',
          params: [null],
          error: `Invalid path detected: (null).`
        },
        {
          name: '### invalid src path: null',
          params: [undefined, TEMP_ROOT],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid dest path: null',
          params: [TEMP_ROOT, undefined],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST],
          error: `getStats: (${Utils.toUnixPath(TEST_FOLDER_NOT_EXIST)}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await generalMove(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe.only('### correct params', () => {
      beforeEach(async () => {
        await createTestSrcFolder()
      })
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### correct: base', async () => {
        const srcItems = Utils.getLeafItems(TEST_FOLDER_SRC)

        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItems)
      })
      it('#### correct: exist same', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')
        const srcItemsBefore = Utils.getLeafItems(TEST_FOLDER_SRC)
        const destItemsBefore = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItemsBefore).toEqual(['sub1/1.txt'])

        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual(['sub1/1.txt'])
        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItemsBefore)
      })
      it('#### correct: overwrite', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        const srcItemsBefore = Utils.getLeafItems(TEST_FOLDER_SRC)
        const destItemsBefore = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItemsBefore).toEqual(['sub1/1.txt'])

        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          overwrite: true
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItemsBefore)

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub1-1')
      })
      it('#### correct: includes', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('sub1'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => i.includes('sub1'))).toBeTruthy()
      })
      it('#### correct: excludes', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          excludes: ['**/sub1/**']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => i.includes('sub1'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => !i.includes('sub1'))).toBeTruthy()
      })
      it('#### correct: filter', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('1.txt'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => i.includes('1.txt'))).toBeTruthy()
      })
      it('#### correct: includes excludes', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**'],
          excludes: ['**/2.txt']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('sub/2.txt'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub1/1.txt', 'sub1/3.txt'])
      })
      it('#### correct: includes filter', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub1/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/1.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: excludes filter', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          excludes: ['**/sub1/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['1.txt', 'sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: includes excludes filter', async () => {
        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**', '**/sub2/**', '**/sub3/**'],
          excludes: ['**/sub1/**', '**/sub3/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: includes excludes filter overwrite', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        await generalMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**', '**/sub2/**', '**/sub3/**'],
          excludes: ['**/sub1/**', '**/sub3/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt'),
          overwrite: true
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub2-1')
      })
    })
  })
  describe('## move', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '### invalid path: undefined',
          params: [],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid path: null',
          params: [null],
          error: `Invalid path detected: (null).`
        },
        {
          name: '### invalid src path: null',
          params: [undefined, TEMP_ROOT],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid dest path: null',
          params: [TEMP_ROOT, undefined],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST],
          error: `getStats: (${Utils.toUnixPath(TEST_FOLDER_NOT_EXIST)}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await generalMove(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      beforeEach(async () => {
        await createTestSrcFolder()
      })
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### correct: base', async () => {
        const srcItems = Utils.getLeafItems(TEST_FOLDER_SRC)

        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItems)
      })
      it('#### correct: exist same', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')
        const srcItemsBefore = Utils.getLeafItems(TEST_FOLDER_SRC)
        const destItemsBefore = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItemsBefore).toEqual(['sub1/1.txt'])

        await renameMove(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual(['sub1/1.txt'])
        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItemsBefore)
      })
      it('#### correct: overwrite', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        const srcItemsBefore = Utils.getLeafItems(TEST_FOLDER_SRC)
        const destItemsBefore = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItemsBefore).toEqual(['sub1/1.txt'])

        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          overwrite: true
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(srcItemsBefore)

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub1-1')
      })
      it('#### correct: includes', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('sub1'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => i.includes('sub1'))).toBeTruthy()
      })
      it('#### correct: excludes', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          excludes: ['**/sub1/**']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => i.includes('sub1'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => !i.includes('sub1'))).toBeTruthy()
      })
      it('#### correct: filter', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('1.txt'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems.every(i => i.includes('1.txt'))).toBeTruthy()
      })
      it('#### correct: includes excludes', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**'],
          excludes: ['**/2.txt']
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter.every(i => !i.includes('sub/2.txt'))).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub1/1.txt', 'sub1/3.txt'])
      })
      it('#### correct: includes filter', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub1/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/1.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: excludes filter', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          excludes: ['**/sub1/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['1.txt', 'sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: includes excludes filter', async () => {
        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**', '**/sub2/**', '**/sub3/**'],
          excludes: ['**/sub1/**', '**/sub3/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### correct: includes excludes filter overwrite', async () => {
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        await move(TEST_FOLDER_SRC, TEST_FOLDER_DEST, {
          includes: ['**/sub1/**', '**/sub2/**', '**/sub3/**'],
          excludes: ['**/sub1/**', '**/sub3/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt'),
          overwrite: true
        })

        const destExists = await Utils.exists(TEST_FOLDER_DEST)
        expect(destExists).toBeTruthy()
        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destItems = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(destItems).toEqual(['sub2/1.txt'])

        const srcItemsAfter = Utils.getLeafItems(TEST_FOLDER_SRC)
        expect(srcItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub2-1')
      })
    })
  })
})
