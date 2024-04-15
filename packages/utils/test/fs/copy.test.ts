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
import { copy, copyFileForce } from '../../src/fs'
import * as Utils from '../utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/copy')
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
          params: [null],
          error: `Invalid path detected: (null).`
        },
        {
          name: '#### invalid src path: null',
          params: [undefined, TEMP_ROOT],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid dest path: null',
          params: [TEMP_ROOT, undefined],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST],
          error: `getStats: (${Utils.toUnixPath(TEST_FOLDER_NOT_EXIST)}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await copy(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      describe('#### copy file', () => {
        it('##### copy file base', async () => {
          await Utils.createFile(TEST_FILE_SRC, 'test file content')

          const { all, done, undo, modify } = await copy(
            TEST_FILE_SRC,
            TEST_FILE_DEST
          )

          const destExists = await Utils.exists(TEST_FILE_DEST)
          expect(destExists).toBeTruthy()

          const content = await Utils.readFileContent(TEST_FILE_DEST)
          expect(content).toBe('test file content')

          expect(all).toEqual(['copy_file_src.txt'])
          expect(done).toEqual(['copy_file_src.txt'])
          expect(undo).toEqual([])
          expect(modify).toEqual(['copy_file_dest.txt'])
        })
        it('##### copy file exist', async () => {
          await Utils.createFile(TEST_FILE_SRC, 'test file content')
          await Utils.createFile(TEST_FILE_DEST, 'test file content dest')

          const { all, done, undo, modify } = await copy(
            TEST_FILE_SRC,
            TEST_FILE_DEST
          )

          const destExists = await Utils.exists(TEST_FILE_DEST)
          expect(destExists).toBeTruthy()

          const content = await Utils.readFileContent(TEST_FILE_DEST)
          expect(content).toBe('test file content dest')

          expect(all).toEqual(['copy_file_src.txt'])
          expect(done).toEqual([])
          expect(undo).toEqual(['copy_file_src.txt'])
          expect(modify).toEqual([])
        })
        it('##### copy file overwrite', async () => {
          await Utils.createFile(TEST_FILE_SRC, 'test file content')
          await Utils.createFile(TEST_FILE_DEST, 'test file content dest')

          const { all, done, undo, modify } = await copy(
            TEST_FILE_SRC,
            TEST_FILE_DEST,
            { overwrite: true }
          )

          const destExists = await Utils.exists(TEST_FILE_DEST)
          expect(destExists).toBeTruthy()

          const content = await Utils.readFileContent(TEST_FILE_DEST)
          expect(content).toBe('test file content')

          expect(all).toEqual(['copy_file_src.txt'])
          expect(done).toEqual(['copy_file_src.txt'])
          expect(undo).toEqual([])
          expect(modify).toEqual(['copy_file_dest.txt'])
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
          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          const destExists = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExists).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBe(false)
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(dest.length)
          expect(undo.length).toEqual(0)
          expect(modify.length).toEqual(dest.length)
        })
        it('##### copy folder exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBe(false)
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(dest.length - 1)
          expect(undo.length).toEqual(1)
          expect(modify.length).toEqual(dest.length - 1)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { overwrite: true }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBe(false)
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(dest.length)
          expect(undo.length).toEqual(0)
          expect(modify.length).toEqual(dest.length)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-1')
        })
        it('##### copy folder include', async () => {
          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { includes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBeTruthy()
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(3)
          expect(undo.length).toEqual(src.length - 3)
          expect(modify.length).toEqual(dest.length)
          expect(done.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(undo.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(modify.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
        })
        it('##### copy folder include exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { includes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(2)
          expect(undo.length).toEqual(src.length - 2)
          expect(modify.length).toEqual(dest.length - 1)
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(done.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(
            undo.includes(Utils.addFolderName('sub1/1.txt', TEST_FOLDER_SRC))
          ).toBeTruthy()
          expect(modify.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder include overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { includes: ['**/1.txt'], overwrite: true }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBeTruthy()
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(3)
          expect(undo.length).toEqual(src.length - 3)
          expect(modify.length).toEqual(dest.length)
          expect(done.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(undo.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(modify.every(i => i.includes('1.txt'))).toBeTruthy()
          expect(dest.every(i => i.includes('1.txt'))).toBeTruthy()

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-1')
        })
        it('##### copy folder exclude', async () => {
          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { excludes: ['**/1.txt'] }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBeTruthy()
          expect(dest.length).toBe(src.length - 3)
          expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(src.length - 3)
          expect(undo.length).toEqual(3)
          expect(modify.length).toEqual(dest.length)
        })
        it('##### copy folder exclude exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub2'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              excludes: ['**/1.txt']
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBeTruthy()
          expect(dest.length).toBe(src.length - 3)
          expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(src.length - 4)
          expect(undo.length).toEqual(4)
          expect(modify.length).toEqual(dest.length - 1)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder exclude overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub2'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub2/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            { excludes: ['**/1.txt'], overwrite: true }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBeTruthy()
          expect(dest.length).toBe(src.length - 3)
          expect(dest.every(i => !i.includes('1.txt'))).toBeTruthy()
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(src.length - 3)
          expect(undo.length).toEqual(3)
          expect(modify.length).toEqual(dest.length)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub2-2')
        })
        it('##### copy folder filter', async () => {
          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              filter: (path, stats) => stats.isFile() && path.includes('1.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(dest).toEqual(['1.txt', 'sub1/1.txt', 'sub2/1.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(3)
          expect(undo.length).toEqual(src.length - 3)
          expect(modify.length).toEqual(3)
        })
        it('##### copy folder filter exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              filter: (path, stats) => stats.isFile() && path.includes('1.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(dest).toEqual(['1.txt', 'sub1/1.txt', 'sub2/1.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(2)
          expect(undo.length).toEqual(src.length - 2)
          expect(modify.length).toEqual(2)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy folder filter overwrite', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/1.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              overwrite: true,
              filter: (path, stats) => stats.isFile() && path.includes('1.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(dest).toEqual(['1.txt', 'sub1/1.txt', 'sub2/1.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(3)
          expect(undo.length).toEqual(src.length - 3)
          expect(modify.length).toEqual(3)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('sub1-1')
        })
        it('##### copy folder include exclude', async () => {
          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              includes: ['**/sub1/**'],
              excludes: ['**/1.txt', '**/2.txt']
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )

          expect(isDiff).toBeTruthy()
          expect(dest.length).toBe(1)
          expect(dest).toEqual(['sub1/3.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(1)
          expect(undo.length).toEqual(src.length - 1)
          expect(modify.length).toEqual(1)
        })
        it('##### copy include exclude filter', async () => {
          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              includes: ['**/sub1/**', '**/sub3/**'],
              excludes: ['**/1.txt'],
              filter: (path, stats) => stats.isFile() && path.includes('2.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(dest).toEqual(['sub1/2.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(1)
          expect(undo.length).toEqual(src.length - 1)
          expect(modify.length).toEqual(1)
        })
        it('##### copy include exclude filter exist', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              includes: ['**/sub1/**', '**/sub3/**'],
              excludes: ['**/1.txt'],
              filter: (path, stats) => stats.isFile() && path.includes('2.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(dest).toEqual(['sub1/2.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(0)
          expect(undo.length).toEqual(src.length)
          expect(modify.length).toEqual(0)

          const content = await Utils.readFileContent(preExistFile)
          expect(content).toBe('exists content')
        })
        it('##### copy include exclude filter', async () => {
          await Utils.createDir(join(TEST_FOLDER_DEST, 'sub1'))
          const preExistFile = join(TEST_FOLDER_DEST, 'sub1/2.txt')
          await Utils.createFile(preExistFile, 'exists content')

          const { all, done, undo, modify } = await copy(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST,
            {
              overwrite: true,
              includes: ['**/sub1/**', '**/sub3/**'],
              excludes: ['**/1.txt'],
              filter: (path, stats) => stats.isFile() && path.includes('2.txt')
            }
          )

          const destExist = await Utils.exists(TEST_FOLDER_DEST)
          expect(destExist).toBeTruthy()

          const { isDiff, src, dest } = await Utils.compareFolderInfo(
            TEST_FOLDER_SRC,
            TEST_FOLDER_DEST
          )
          expect(isDiff).toBeTruthy()
          expect(dest).toEqual(['sub1/2.txt'])
          expect(all.length).toEqual(src.length)
          expect(done.length).toEqual(1)
          expect(undo.length).toEqual(src.length - 1)
          expect(modify.length).toEqual(1)

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
          params: [],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid path: null',
          params: [null],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid src path: undefined',
          params: [undefined, TEMP_ROOT],
          error: `The "src" argument must be of type string or an instance of Buffer or URL. Received undefined`
        },
        {
          name: '#### invalid dest path: undefined',
          params: [TEMP_ROOT, undefined],
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST],
          error: `ENOENT: no such file or directory, copyfile '${TEST_FOLDER_NOT_EXIST}' -> '${TEST_FOLDER_NOT_EXIST}'`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await copyFileForce(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
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
