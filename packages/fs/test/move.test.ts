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
import { move } from '../src'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/move')
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

describe('# move.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## move', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '### invalid path: undefined',
          params: []
        },
        {
          name: '### invalid path: null',
          params: [null]
        },
        {
          name: '### invalid src path: null',
          params: [undefined, TEMP_ROOT]
        },
        {
          name: '### invalid dest path: null',
          params: [TEMP_ROOT, undefined]
        },
        {
          name: '### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST]
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await move(...item.params)
          } catch (e) {
            expect(e.message).toBeTruthy()
          }
        })
      }
    })
    describe('#### move file', () => {
      it('##### move file base', async () => {
        await Utils.createFile(TEST_FILE_SRC, 'test file content')

        const { src, dest, add, update, skip } = await move(
          TEST_FILE_SRC,
          TEST_FILE_DEST
        )

        const srcExists = await Utils.exists(TEST_FILE_SRC)
        expect(srcExists).toBeFalsy()

        const content = await Utils.readFileContent(TEST_FILE_DEST)
        expect(content).toBe('test file content')

        expect(src).toEqual(['move_file_src.txt'])
        expect(dest).toEqual(['move_file_dest.txt'])
        expect(add).toEqual(['move_file_dest.txt'])
        expect(skip).toEqual([])
        expect(update).toEqual([])
      })
      it('##### move file exist', async () => {
        await Utils.createFile(TEST_FILE_SRC, 'test file content')
        await Utils.createFile(TEST_FILE_DEST, 'test file content dest')

        const { src, dest, add, update, skip } = await move(
          TEST_FILE_SRC,
          TEST_FILE_DEST
        )

        const srcExists = await Utils.exists(TEST_FILE_SRC)
        expect(srcExists).toBeTruthy()

        const content = await Utils.readFileContent(TEST_FILE_DEST)
        expect(content).toBe('test file content dest')

        expect(src).toEqual(['move_file_src.txt'])
        expect(dest).toEqual(['move_file_dest.txt'])
        expect(add).toEqual([])
        expect(update).toEqual([])
        expect(skip).toEqual(['move_file_src.txt'])
      })
      it('##### move file overwrite', async () => {
        await Utils.createFile(TEST_FILE_SRC, 'test file content')
        await Utils.createFile(TEST_FILE_DEST, 'test file content dest')

        const { src, dest, add, update, skip } = await move(
          TEST_FILE_SRC,
          TEST_FILE_DEST,
          { overwrite: true }
        )

        const srcExists = await Utils.exists(TEST_FILE_SRC)
        expect(srcExists).toBeFalsy()

        const content = await Utils.readFileContent(TEST_FILE_DEST)
        expect(content).toBe('test file content')

        expect(src).toEqual(['move_file_src.txt'])
        expect(dest).toEqual(['move_file_dest.txt'])
        expect(update).toEqual(['move_file_dest.txt'])
        expect(add).toEqual([])
        expect(skip).toEqual([])
      })
    })

    describe('#### move folder', () => {
      beforeEach(async () => {
        await createTestSrcFolder()
      })
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### move folder base', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST
        )

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()
        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(destInfo.length)
        expect(skip.length).toBe(0)
        expect(update.length).toBe(0)
      })
      it('#### move folder exist', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub1'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST
        )

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(skip.length).toBe(1)
        expect(add.length).toBe(destInfo.length - skip.length)
        expect(update.length).toBe(0)

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('exists content')
      })
      it('##### move folder overwrite', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { overwrite: true }
        )

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeFalsy()

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(skip.length).toBe(0)
        expect(update.length).toBe(1)
        expect(add.length).toBe(destInfo.length - update.length)

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub1-1')
      })
      it('##### move folder include', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { includes: ['**/1.txt'] }
        )

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(dest.length).toBe(3)
        expect(add.length).toBe(3)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(src.length - add.length)
        expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(skip.every(i => !i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      })
      it('##### move folder include exist', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)
        await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { includes: ['**/1.txt'] }
        )

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(dest.length).toBe(3)
        expect(add.length).toBe(3 - 1)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(src.length - add.length)
        expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('exists content')
      })
      it('##### move folder include overwrite', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)
        await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
        const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { includes: ['**/1.txt'], overwrite: true }
        )

        const srcExists = await Utils.exists(TEST_FOLDER_SRC)
        expect(srcExists).toBeTruthy()

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(dest.length).toBe(3)
        expect(add.length).toBe(3 - 1)
        expect(update.length).toBe(1)
        expect(skip.length).toBe(src.length - add.length - update.length)
        expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub1-1')
      })
      it('##### move folder exclude', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { excludes: ['**/1.txt'] }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)
        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(destInfo.length)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(src.length - add.length - update.length)
        expect(add.every(i => !i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
      })
      it('##### move folder exclude exist', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { excludes: ['**/1.txt'] }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(srcInfo.length - 3 - 1)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(3 + 1)
        expect(add.every(i => !i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('exists content')
      })
      it('##### move folder exclude exist overwrite', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          { excludes: ['**/1.txt'], overwrite: true }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(srcInfo.length - 3 - 1)
        expect(update.length).toBe(1)
        expect(skip.length).toBe(3)
        expect(add.every(i => !i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub2-2')
      })
      it('##### move folder filter', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            filter: (path, stats) => stats.isFile() && path.includes('1.txt')
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(3)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcInfo.length - 3)
        expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
      })
      it('##### move folder filter exist', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/1.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            filter: (path, stats) => stats.isFile() && path.includes('1.txt')
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(2)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcInfo.length - 3 + 1)
        expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('exists content')
      })
      it('##### move folder filter overwrite', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/1.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            filter: (path, stats) => stats.isFile() && path.includes('1.txt'),
            overwrite: true
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(2)
        expect(update.length).toBe(1)
        expect(skip.length).toBe(srcInfo.length - 3)
        expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub2-1')
      })
      it('##### move folder include exclude', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            includes: ['**/sub1/**'],
            excludes: ['**/1.txt', '**/2.txt']
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(1)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcInfo.length - 1)
        expect(add.every(i => i.includes('3.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('3.txt'))).toBeTruthy()
      })
      it('##### move folder include exclude filter', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            includes: ['**/sub1/**', '**/sub2/**'],
            excludes: ['**/1.txt'],
            filter: (path, stats) => stats.isFile() && path.includes('2.txt')
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(2)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcInfo.length - 2)
        expect(add.every(i => i.includes('2.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('2.txt'))).toBeTruthy()
      })
      it('##### move folder include exclude filter exist', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            includes: ['**/sub1/**', '**/sub2/**'],
            excludes: ['**/1.txt'],
            filter: (path, stats) => stats.isFile() && path.includes('2.txt')
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(1)
        expect(update.length).toBe(0)
        expect(skip.length).toBe(srcInfo.length - 1)
        expect(add.every(i => i.includes('2.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('2.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('exists content')
      })
      it('##### move folder include exclude filter overwrite', async () => {
        const srcInfo = Utils.getLeafItems(TEST_FOLDER_SRC)

        const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
        await Utils.ensureDir(join(TEST_FOLDER_DEST, 'sub2'))
        await Utils.createFile(preExistFile, 'exists content')

        const { src, dest, add, update, skip } = await move(
          TEST_FOLDER_SRC,
          TEST_FOLDER_DEST,
          {
            includes: ['**/sub1/**', '**/sub2/**'],
            excludes: ['**/1.txt'],
            filter: (path, stats) => stats.isFile() && path.includes('2.txt'),
            overwrite: true
          }
        )

        const destInfo = Utils.getLeafItems(TEST_FOLDER_DEST)

        expect(src.length).toBe(srcInfo.length)
        expect(dest.length).toBe(destInfo.length)
        expect(add.length).toBe(1)
        expect(update.length).toBe(1)
        expect(skip.length).toBe(srcInfo.length - 1 - 1)
        expect(add.every(i => i.includes('2.txt'))).toBeTruthy()
        expect(dest.every(i => i.includes('2.txt'))).toBeTruthy()

        const content = await Utils.readFileContent(preExistFile)
        expect(content).toBe('sub2-2')
      })
    })
  })
})
