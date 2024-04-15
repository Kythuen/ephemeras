import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createFile, createFolder, ensureExists } from '../../src/fs'
import * as Utils from '../utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/ensure')
const TEST_FILE_EXIST = join(TEMP_ROOT, 'exist_file.txt')
const TEST_FILE_ENSURE = join(TEMP_ROOT, 'ensure_file.ts')
const TEST_FOLDER_ENSURE = join(TEMP_ROOT, 'ensure_folder')
const TEST_FOLDER_ENSURE_SPECIAL = join(TEMP_ROOT, '.ensure_folder')

describe('# ensure', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## ensureExists', () => {
    describe('### invalid params', () => {
      beforeAll(async () => {
        await Utils.createFile(TEST_FILE_EXIST, 'exist file content')
      })
      afterAll(async () => {
        await Utils.removeFile(TEST_FILE_EXIST)
      })
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
          name: '### invalid fileContent: null',
          params: [TEST_FILE_EXIST, 'file', 1],
          error: `The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received type number (1)`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await ensureExists(...item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      afterEach(async () => {
        if (await Utils.exists(TEST_FILE_ENSURE)) {
          await Utils.removeFile(TEST_FILE_ENSURE)
        }
        if (await Utils.exists(TEST_FOLDER_ENSURE)) {
          await Utils.removeDir(TEST_FOLDER_ENSURE)
        }
        if (await Utils.exists(TEST_FOLDER_ENSURE_SPECIAL)) {
          await Utils.removeDir(TEST_FOLDER_ENSURE_SPECIAL)
        }
      })
      const cases: any = [
        {
          name: '#### correct: not-exists file',
          params: [TEST_FILE_ENSURE],
          result: {
            existBefore: false,
            existAfter: true,
            content: ''
          }
        },
        {
          name: '#### correct: exists file',
          before: () => createFile(TEST_FILE_ENSURE, 'var a = 1'),
          params: [TEST_FILE_ENSURE],
          result: {
            existBefore: true,
            existAfter: true,
            content: 'var a = 1'
          }
        },
        {
          name: '#### correct: exists file with fileContent',
          before: () => createFile(TEST_FILE_ENSURE, 'var a = 1'),
          params: [TEST_FILE_ENSURE, 'file', 'var b = 2'],
          result: {
            existBefore: true,
            existAfter: true,
            content: 'var b = 2'
          }
        },
        {
          name: '#### correct: not-exists folder',
          params: [TEST_FOLDER_ENSURE],
          result: {
            existBefore: false,
            existAfter: true
          }
        },
        {
          name: '#### correct: exists folder',
          before: () => createFolder(TEST_FOLDER_ENSURE),
          params: [TEST_FOLDER_ENSURE],
          result: {
            existBefore: true,
            existAfter: true
          }
        },
        {
          name: '#### correct: not-exists, special folder name',
          params: [TEST_FOLDER_ENSURE_SPECIAL, 'folder'],
          result: {
            existBefore: false,
            existAfter: true
          }
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          await item?.before?.()

          const existBefore = await Utils.exists(item.params[0])
          expect(existBefore).toBe(item.result.existBefore)

          // @ts-ignore
          await ensureExists(...item.params)

          const existAfter = await Utils.exists(item.params[0])
          expect(existAfter).toBe(item.result.existAfter)

          const stats = await Utils.getStats(item.params[0])
          if (stats.isFile()) {
            const content = await Utils.readFileContent(item.params[0])
            expect(content).toBe(item.result.content)
          }

          await item?.after?.()
        })
      }
    })
  })
})
