import { Stats } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { toUnixPath, getStats, isExists } from '../../src/fs'
import * as Utils from '../utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/common')
const TEST_FOLDER_EXIST = TEMP_ROOT
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'xxxxxx')
const TEST_FILE_EXIST = join(TEMP_ROOT, 'exist_file.txt')
const TEST_FILE_NOT_EXIST = join(TEMP_ROOT, 'not_exist_file.txt')

describe('# common', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
    await Utils.createFile(TEST_FILE_EXIST, 'exist file content')
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## toUnixPath', () => {
    describe.skip('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: undefined,
          error: `Invalid path detected: (undefined).`
        },
        {
          name: '#### invalid path: null',
          params: null,
          error: `Invalid path detected: (null).`
        },
        {
          name: '#### invalid path: number',
          params: 1,
          error: `Invalid path detected: (1).`
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          try {
            // @ts-expect-error
            toUnixPath(item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      const cases = [
        // {
        //   name: '#### correct path: string',
        //   params: 'D:\\xxxx',
        //   result: 'D:/xxxx'
        // },
        {
          name: '#### correct path: Buffer',
          params: Buffer.from('D:\\xxxx'),
          result: 'D:/xxxx'
        },
        {
          name: '#### correct path: URL',
          params: new URL('D:\\xxxx'),
          result: 'd:/xxxx'
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          expect(typeof toUnixPath(item.params)).toBe('string')
          expect(toUnixPath(item.params)).toBe(item.result)
        })
      }
    })
  })
  describe('## getStats', () => {
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
        },
        {
          name: '#### invalid path: not exists',
          params: TEST_FOLDER_NOT_EXIST,
          error: `getStats: (${TEST_FOLDER_NOT_EXIST}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await getStats(item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
      const cases = [
        {
          name: '#### correct path: dir',
          params: TEST_FOLDER_EXIST
        },
        {
          name: '#### correct path: file',
          params: TEST_FILE_EXIST
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          const stats = await getStats(item.params)
          expect(stats).instanceOf(Stats)
        })
      }
    })
  })
  describe('## isExists', () => {
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
            await isExists(item.params)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct params', () => {
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
          const result = await isExists(item.params)
          expect(result).toBe(item.result)
        })
      }
    })
  })
})
