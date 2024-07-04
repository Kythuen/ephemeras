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
import { copy, copyFileForce } from '../src/copy'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/copy')
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'copy_folder_not_exist')
const TEST_FOLDER_SRC = join(TEMP_ROOT, 'copy_folder_src')
const TEST_FOLDER_DEST = join(TEMP_ROOT, 'copy_folder_dest')
const TEST_FILE_SRC = join(TEMP_ROOT, 'copy_file_src.txt')
const TEST_FILE_DEST = join(TEMP_ROOT, 'copy_file_dest.txt')

async function createTestFolder() {
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

describe('# copy.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## copy', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: [],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid path: null',
          params: [null]
        },
        {
          name: '#### invalid src path: null',
          params: [undefined, TEMP_ROOT]
        },
        {
          name: '#### invalid dest path: null',
          params: [TEMP_ROOT, undefined]
        },
        {
          name: '#### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST]
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await copy(...item.params)
          } catch (e) {
            expect(e.message).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', () => {
      describe('#### copy file', () => {
        it('##### copy file base', async () => {
          await Utils.createFile(TEST_FILE_SRC, 'test file content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FILE_SRC,
            TEST_FILE_DEST
          )

          const destExists = await Utils.exists(TEST_FILE_DEST)
          expect(destExists).toBeTruthy()

          const content = await Utils.readFileContent(TEST_FILE_DEST)
          expect(content).toBe('test file content')

          expect(src).toEqual(['copy_file_src.txt'])
          expect(dest).toEqual(['copy_file_dest.txt'])
          expect(add).toEqual(['copy_file_dest.txt'])
          expect(skip).toEqual([])
          expect(update).toEqual([])
        })
        it('##### copy file exist', async () => {
          await Utils.createFile(TEST_FILE_SRC, 'test file content')
          await Utils.createFile(TEST_FILE_DEST, 'test file content dest')

          const { src, dest, add, update, skip } = await copy(
            TEST_FILE_SRC,
            TEST_FILE_DEST
          )

          const destExists = await Utils.exists(TEST_FILE_DEST)
          expect(destExists).toBeTruthy()

          const content = await Utils.readFileContent(TEST_FILE_DEST)
          expect(content).toBe('test file content dest')

          expect(src).toEqual(['copy_file_src.txt'])
          expect(dest).toEqual(['copy_file_dest.txt'])
          expect(add).toEqual([])
          expect(update).toEqual([])
          expect(skip).toEqual(['copy_file_src.txt'])
        })
        it('##### copy file overwrite', async () => {
          await Utils.createFile(TEST_FILE_SRC, 'test file content')
          await Utils.createFile(TEST_FILE_DEST, 'test file content dest')

          const { src, dest, add, update, skip } = await copy(
            TEST_FILE_SRC,
            TEST_FILE_DEST,
            { overwrite: true }
          )

          const destExists = await Utils.exists(TEST_FILE_DEST)
          expect(destExists).toBeTruthy()

          const content = await Utils.readFileContent(TEST_FILE_DEST)
          expect(content).toBe('test file content')

          expect(src).toEqual(['copy_file_src.txt'])
          expect(dest).toEqual(['copy_file_dest.txt'])
          expect(update).toEqual(['copy_file_dest.txt'])
          expect(add).toEqual([])
          expect(skip).toEqual([])
        })
      })
      describe('#### copy folder', () => {
        beforeEach(async () => {
          await createTestFolder()
        })
        afterEach(async () => {
          await Utils.emptyDir(TEMP_ROOT)
        })
        it('##### copy folder base', async () => {
          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          const destExists = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExists).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBe(false)
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(add.length).toBe(destInfo.length)
          expect(skip.length).toBe(0)
          expect(update.length).toBe(0)
        })
        it('##### copy folder exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBe(false)
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(skip.length).toBe(1)
          expect(add.length).toBe(destInfo.length - skip.length)
          expect(update.length).toBe(0)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { overwrite: true }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBe(false)
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(skip.length).toBe(0)
          expect(update.length).toBe(1)
          expect(add.length).toBe(destInfo.length - update.length)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-1')
        })
        it('##### copy folder include', async () => {
          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { includes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(add.length).toBe(3)
          expect(update.length).toBe(0)
          expect(skip.length).toBe(srcInfo.length - add.length)
          expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(skip.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
        })
        it('##### copy folder include exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { includes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)
          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(add.length).toBe(2)
          expect(update.length).toBe(0)
          expect(skip.length).toBe(srcInfo.length - add.length)
          expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder include overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { includes: ['**/1.txt'], overwrite: true }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(add.length).toBe(2)
          expect(update.length).toBe(1)
          expect(skip.length).toBe(srcInfo.length - add.length - 1)
          expect(add.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(skip.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-1')
        })
        it('##### copy folder exclude', async () => {
          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { excludes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(srcInfo.length - 3)
          expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(add.length).toBe(srcInfo.length - 3)
          expect(update.length).toBe(0)
          expect(skip.length).toBe(3)
        })
        it('##### copy folder exclude exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub2'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { excludes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(srcInfo.length - 3)
          expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(add.length).toBe(srcInfo.length - 3 - 1)
          expect(skip.length).toBe(4)
          expect(update.length).toBe(0)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder exclude overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub2'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { excludes: ['**/1.txt'], overwrite: true }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(srcInfo.length - 3)
          expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(add.length).toBe(src.length - 3 - 1)
          expect(skip.length).toBe(3)
          expect(update.length).toBe(1)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub2-2')
        })
        it('##### copy folder filter', async () => {
          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              filter: (path, stats) => stats.isFile() && path.includes('1.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)
          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(3)
          expect(add.length).toBe(3)
          expect(skip.length).toBe(src.length - 3)
          expect(update.length).toBe(0)
        })
        it('##### copy folder filter exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              filter: (path, stats) => stats.isFile() && path.includes('1.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)
          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(3)
          expect(add.length).toBe(3 - 1)
          expect(skip.length).toBe(src.length - 3 + 1)
          expect(update.length).toBe(0)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder filter overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              overwrite: true,
              filter: (path, stats) => stats.isFile() && path.includes('1.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)
          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(3)
          expect(add.length).toBe(3 - 1)
          expect(skip.length).toBe(src.length - 3)
          expect(update.length).toBe(1)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-1')
        })
        it('##### copy folder include exclude', async () => {
          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              includes: ['**/sub1/**'],
              excludes: ['**/1.txt', '**/2.txt']
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(1)
          expect(dest.every(i => i.includes('sub1/3.txt'))).toBeTruthy()
          expect(add.length).toBe(1)
          expect(skip.length).toBe(srcInfo.length - 1)
          expect(update.length).toBe(0)
        })
        it('##### copy folder include exclude filter', async () => {
          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              includes: ['**/sub1/**', '**/sub2/**'],
              excludes: ['**/1.txt'],
              filter: (path, stats) => stats.isFile() && path.includes('2.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(2)
          expect(add.length).toBe(2)
          expect(skip.length).toBe(srcInfo.length - 2)
          expect(update.length).toBe(0)
        })
        it('##### copy folder include exclude filter exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              includes: ['**/sub1/**', '**/sub2/**'],
              excludes: ['**/1.txt'],
              filter: (path, stats) => stats.isFile() && path.includes('2.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(2)
          expect(add.length).toBe(1)
          expect(skip.length).toBe(srcInfo.length - 2 + 1)
          expect(update.length).toBe(0)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder include exclude filter overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { src, dest, add, update, skip } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              overwrite: true,
              includes: ['**/sub1/**', '**/sub2/**'],
              excludes: ['**/1.txt'],
              filter: (path, stats) => stats.isFile() && path.includes('2.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const {
            isDiff,
            src: srcInfo,
            dest: destInfo
          } = await Utils.compareFolderInfo(TEST_FOLDER_SRC, TEST_FOLDER_DEST)

          expect(isDiff).toBeTruthy()
          expect(src.length).toBe(srcInfo.length)
          expect(dest.length).toBe(destInfo.length)
          expect(dest.length).toBe(2)
          expect(add.length).toBe(2 - 1)
          expect(skip.length).toBe(srcInfo.length - 2)
          expect(update.length).toBe(1)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-2')
        })
      })
    })
  })
  describe('## copyFileForce', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: []
        },
        {
          name: '#### invalid path: null',
          params: [null]
        },
        {
          name: '#### invalid src path: undefined',
          params: [undefined, TEMP_ROOT]
        },
        {
          name: '#### invalid dest path: undefined',
          params: [TEMP_ROOT, undefined]
        },
        {
          name: '#### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST]
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await copyFileForce(...item.params)
          } catch (e) {
            expect(e.message).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', () => {
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### correct: copy file', async () => {
        await Utils.createFile(TEST_FILE_SRC, 'exists content')

        await copyFileForce(TEST_FILE_SRC, TEST_FILE_DEST)

        const exist = await Utils.exists(TEST_FILE_DEST)
        expect(exist).toBeTruthy()

        const content = await Utils.readFileContent(TEST_FILE_DEST)
        expect(content).toBe('exists content')
      })
    })
  })
})
