import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { readJSON } from '../src/read'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/common')
const TEST_FILE = join(TEMP_ROOT, 'exist_file.json')
const TEST_FILE_TXT = join(TEMP_ROOT, 'exist_file.txt')
const TEST_FILE_NOT_EXIST = join(TEMP_ROOT, 'not_exist_file.txt')

describe('# read.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
    await Utils.createFile(TEST_FILE, '{ "a": 1, "b": "2", "c": true }')
    await Utils.createFile(TEST_FILE_TXT, '{ "a": 1, "b": "2", "c": true }')
  })
  afterAll(async () => {
    await Utils.removeDir(TEMP_ROOT)
  })
  describe('## readJSON', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### invalid path: undefined',
          params: undefined
        },
        {
          name: '#### invalid path: null',
          params: null
        },
        {
          name: '#### invalid path: number',
          params: 1
        },
        {
          name: '#### invalid path: not exist',
          params: TEST_FILE_NOT_EXIST
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await readJSON(item.params)
          } catch (e) {
            expect(e).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', async () => {
      it('#### JSON file', async () => {
        const result = await readJSON(TEST_FILE)
        expect(result).toEqual({ a: 1, b: '2', c: true })
      })
      it('#### Not JSON file', async () => {
        const result = await readJSON(TEST_FILE_TXT)
        expect(result).toEqual({})
      })
    })
  })
})
