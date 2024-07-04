import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { exists } from '../src/exist'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/common')
const TEST_FOLDER_EXIST = TEMP_ROOT
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'xxxxxx')
const TEST_FILE_EXIST = join(TEMP_ROOT, 'exist_file.txt')
const TEST_FILE_NOT_EXIST = join(TEMP_ROOT, 'not_exist_file.txt')

describe('# exist.ts', () => {
  describe('## exists', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: undefined,
          error:
            'The "path" argument must be of type string or an instance of Buffer or URL. Received undefined'
        },
        {
          name: '#### invalid path: null',
          params: null,
          error:
            'The "path" argument must be of type string or an instance of Buffer or URL. Received null'
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await exists(item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      beforeAll(async () => {
        await Utils.ensureDir(TEMP_ROOT)
        await Utils.createFile(TEST_FILE_EXIST, 'exist file content')
      })
      afterAll(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      const cases = [
        {
          name: '#### correct path: folder exist',
          params: TEST_FOLDER_EXIST,
          result: true
        },
        {
          name: '#### correct path: folder not exist',
          params: TEST_FOLDER_NOT_EXIST,
          result: false
        },
        {
          name: '#### correct path: file exist',
          params: TEST_FILE_EXIST,
          result: true
        },
        {
          name: '#### correct path: file not exist',
          params: TEST_FILE_NOT_EXIST,
          result: false
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          const result = await exists(item.params)
          expect(result).toBe(item.result)
        })
      }
    })
  })
})
