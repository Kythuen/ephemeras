import { Stats } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { stats } from '../src/stat'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/stat')
const TEST_FOLDER_EXIST = TEMP_ROOT
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'xxxxxx')
const TEST_FILE_EXIST = join(TEMP_ROOT, 'exist_file.txt')

describe('# stat.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
    await Utils.createFile(TEST_FILE_EXIST, 'exist file content')
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## stat', () => {
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
          error: `stats: (${TEST_FOLDER_NOT_EXIST}) not exists.`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await stats(item.params)
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
          const targetStats = await stats(item.params)
          expect(targetStats).instanceOf(Stats)
        })
      }
    })
  })
})
