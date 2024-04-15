import { homedir } from 'node:os'
import { join, basename } from 'node:path'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest'
import { remove } from '../../src/fs'
import * as Utils from '../utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/remove')
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'copy_folder_not_exist')
const TEST_FOLDER_TARGET = join(TEMP_ROOT, 'remove_folder_target')
const TEST_FILE_TARGET = join(TEMP_ROOT, 'remove_file_target.txt')

async function createTestFolder() {
  await Utils.ensureDir(TEST_FOLDER_TARGET)
  await Utils.createFile(join(TEST_FOLDER_TARGET, '1.txt'), '1')
  await Utils.createFile(join(TEST_FOLDER_TARGET, '2.txt'), '2')
  await Utils.createFile(join(TEST_FOLDER_TARGET, '3.txt'), '3')
  await Utils.ensureDir(join(TEST_FOLDER_TARGET, 'sub1'))
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub1/1.txt'), 'sub1-1')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub1/2.txt'), 'sub1-2')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub1/3.txt'), 'sub1-3')
  await Utils.ensureDir(join(TEST_FOLDER_TARGET, 'sub2'))
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub2/1.txt'), 'sub2-1')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub2/2.txt'), 'sub2-2')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub2/3.txt'), 'sub2-3')
  await Utils.ensureDir(join(TEST_FOLDER_TARGET, 'sub3'))
}

describe('# remove.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## remove', () => {
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
          name: '### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST],
          error: `getStats: (${Utils.toUnixPath(TEST_FOLDER_NOT_EXIST)}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await remove(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      beforeEach(async () => {
        await createTestFolder()
      })
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### remove file', async () => {
        await Utils.createFile(TEST_FILE_TARGET, 'target file content')

        const { all, done, undo } = await remove(TEST_FILE_TARGET)

        const existsAfter = await Utils.exists(TEST_FILE_TARGET)
        expect(existsAfter).toBeFalsy()

        expect(all).toEqual([basename(TEST_FILE_TARGET)])
        expect(done).toEqual([basename(TEST_FILE_TARGET)])
        expect(undo).toEqual([])
      })
      it('#### remove folder', async () => {
        const targetItems = Utils.getLeafItems(TEST_FOLDER_TARGET)

        const { all, done, undo } = await remove(TEST_FOLDER_TARGET)

        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeFalsy()

        expect(all.length).toEqual(targetItems.length)
        expect(done.length).toEqual(targetItems.length)
        expect(undo).toEqual([])
      })
      it('#### remove folder includes', async () => {
        const targetItems = Utils.getLeafItems(TEST_FOLDER_TARGET)

        const { all, done, undo } = await remove(TEST_FOLDER_TARGET, {
          includes: ['**/1.txt']
        })

        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeTruthy()

        const targetItemsAfter = await Utils.getLeafItems(TEST_FOLDER_TARGET)
        expect(targetItemsAfter).toEqual([
          '2.txt',
          '3.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])

        expect(all.length).toEqual(targetItems.length)
        expect(done.length).toBe(3)
        expect(done.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(undo.length).toBe(targetItems.length - 3)
        expect(undo.every(i => !i.includes('1.txt'))).toBeTruthy()
      })
      it('#### remove folder excludes', async () => {
        const targetItems = Utils.getLeafItems(TEST_FOLDER_TARGET)

        const { all, done, undo } = await remove(TEST_FOLDER_TARGET, {
          excludes: ['**/1.txt']
        })

        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeTruthy()

        const targetItemsAfter = await Utils.getLeafItems(TEST_FOLDER_TARGET)
        expect(targetItemsAfter).toEqual(['1.txt', 'sub1/1.txt', 'sub2/1.txt'])

        expect(all.length).toEqual(targetItems.length)
        expect(done.length).toBe(targetItems.length - 3)
        expect(done.every(i => !i.includes('1.txt'))).toBeTruthy()
        expect(undo.length).toBe(3)
        expect(undo.every(i => i.includes('1.txt'))).toBeTruthy()
      })
      it('#### remove folder filter', async () => {
        const targetItems = Utils.getLeafItems(TEST_FOLDER_TARGET)

        const { all, done, undo } = await remove(TEST_FOLDER_TARGET, {
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeTruthy()

        const targetItemsAfter = await Utils.getLeafItems(TEST_FOLDER_TARGET)
        expect(targetItemsAfter).toEqual([
          '2.txt',
          '3.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])

        expect(all.length).toEqual(targetItems.length)
        expect(done.length).toBe(3)
        expect(done.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(undo.length).toBe(targetItems.length - 3)
        expect(undo.every(i => !i.includes('1.txt'))).toBeTruthy()
      })
      it('#### remove folder includes excludes', async () => {
        const targetItems = Utils.getLeafItems(TEST_FOLDER_TARGET)

        const { all, done, undo } = await remove(TEST_FOLDER_TARGET, {
          includes: ['**/sub2/**'],
          excludes: ['**/1.txt']
        })

        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeTruthy()

        const targetItemsAfter = await Utils.getLeafItems(TEST_FOLDER_TARGET)
        expect(targetItemsAfter).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/1.txt',
          'sub3'
        ])

        expect(all.length).toEqual(targetItems.length)
        expect(done.length).toBe(2)
        expect(
          done.every(i => i.includes('sub2') && !i.includes('1.txt'))
        ).toBeTruthy()
        expect(undo.length).toBe(targetItems.length - 2)
        expect(
          undo.every(i => !i.includes('sub2') || i.includes('1.txt'))
        ).toBeTruthy()
      })
      it('#### remove folder includes excludes filter', async () => {
        const targetItems = Utils.getLeafItems(TEST_FOLDER_TARGET)

        const { all, done, undo } = await remove(TEST_FOLDER_TARGET, {
          includes: ['**/sub1/**', '**/sub2/**'],
          excludes: ['**/sub2/**'],
          filter: (path, stats) => stats.isFile() && path.includes('1.txt')
        })

        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeTruthy()

        const targetItemsAfter = await Utils.getLeafItems(TEST_FOLDER_TARGET)
        expect(targetItemsAfter).toEqual([
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
        expect(all.length).toEqual(targetItems.length)
        expect(done.length).toBe(1)
        expect(done.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(undo.length).toBe(targetItems.length - 1)
        expect(
          undo.every(i => !(i.includes('1.txt') && i.includes('sub1')))
        ).toBeTruthy()
      })
    })
  })
})
