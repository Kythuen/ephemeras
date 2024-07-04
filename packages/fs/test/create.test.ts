import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createFile, createDir } from '../src/create'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/create')
const TEST_FILE_CREAT = join(TEMP_ROOT, 'create_file.ts')
const TEST_FOLDER_CREAT = join(TEMP_ROOT, 'create_folder')

describe('# create ', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## createFile', () => {
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
          name: '#### invalid content: null',
          params: [TEST_FILE_CREAT, 1]
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await createFile(...item.params)
          } catch (e) {
            expect(e).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', () => {
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      const cases: any = [
        {
          name: '#### correct: not-exists file',
          params: [TEST_FILE_CREAT, 'var a = 1'],
          result: {
            existBefore: false,
            existAfter: true,
            content: 'var a = 1'
          }
        },
        {
          name: '#### correct: exists file',
          before: () => createFile(TEST_FILE_CREAT, 'var a = 1'),
          params: [TEST_FILE_CREAT, `var a = 1; var b = 's'`],
          result: {
            existBefore: true,
            existAfter: true,
            content: 'var a = 1'
          }
        },
        {
          name: '#### correct: exists file overwrite',
          before: () => createFile(TEST_FILE_CREAT, 'var a = 1'),
          params: [
            TEST_FILE_CREAT,
            `var a = 1; var b = 's'`,
            { overwrite: true }
          ],
          result: {
            existBefore: true,
            existAfter: true,
            content: `var a = 1; var b = 's'`
          }
        },
        {
          name: '#### correct: exists file overwrite prettier',
          before: () => createFile(TEST_FILE_CREAT, 'var a = 1'),
          params: [
            TEST_FILE_CREAT,
            `const a    = ''`,
            { overwrite: true, prettier: true }
          ],
          result: {
            existBefore: true,
            existAfter: true,
            content: `const a = "";\n`
          }
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          await item?.before?.()

          const existBefore = await Utils.exists(item.params[0])
          expect(existBefore).toBe(item.result.existBefore)

          // @ts-ignore
          await createFile(...item.params)

          const existAfter = await Utils.exists(item.params[0])
          expect(existAfter).toBe(item.result.existAfter)

          const content = await Utils.readFileContent(item.params[0])
          expect(content).toBe(item.result.content)

          await item?.after?.()
        })
      }
    })
  })
  describe('## createDir', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: undefined
        },
        {
          name: '#### invalid path: null',
          params: null
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await createDir(item.params)
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
      const cases: any = [
        {
          name: '#### correct: not-exists folder',
          params: TEST_FOLDER_CREAT,
          result: {
            existBefore: false,
            existAfter: true
          }
        },
        {
          name: '#### correct: exists folder',
          before: () => createDir(TEST_FOLDER_CREAT),
          params: TEST_FOLDER_CREAT,
          result: {
            existBefore: true,
            existAfter: true
          }
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          await item?.before?.()

          const existBefore = await Utils.exists(item.params)
          expect(existBefore).toBe(item.result.existBefore)

          await createDir(item.params)

          const existAfter = await Utils.exists(item.params)
          expect(existAfter).toBe(item.result.existAfter)

          await item?.after?.()
        })
      }
    })
  })
})
