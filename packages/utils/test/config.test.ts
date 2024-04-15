import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { defineConfig, loadConfig } from '../src/config'

import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/config')
const TEST_FILE_NOT_EXIST = join(TEMP_ROOT, 'not-exist')
const TEST_FILE_CONFIG_1 = join(TEMP_ROOT, 'test1.config.json')
const TEST_FILE_CONFIG_2 = join(TEMP_ROOT, 'test2.config.ts')

describe.only('# config', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe.only('## loadConfig', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### no params',
          params: [],
          error:
            'The "paths[1]" argument must be of type string. Received undefined'
        },
        {
          name: '#### invalid file type',
          params: [1],
          error:
            'The "paths[1]" argument must be of type string. Received type number (1)'
        },
        {
          name: '#### invalid files type',
          params: [TEST_FILE_NOT_EXIST, 1],
          error: `config file "${TEST_FILE_NOT_EXIST}" not found`
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await loadConfig(...item.params)
          } catch (error) {
            expect(error.message).toBe(item.error)
          }
        })
      }
    })
    describe.only('### verify result', async () => {
      beforeAll(async () => {
        await Utils.createFile(
          TEST_FILE_CONFIG_1,
          `{ "a1": 1, "b1": "1", "c1": true }`
        )
        await Utils.createFile(
          TEST_FILE_CONFIG_2,
          `export default { a2: 2, b2: '2', c2: false }`
        )
      })
      afterAll(async () => {
        await Utils.removeFile(TEST_FILE_CONFIG_1)
        await Utils.removeFile(TEST_FILE_CONFIG_2)
      })
      const cases = [
        {
          name: '#### file not exist',
          params: [TEST_FILE_NOT_EXIST],
          error: `config file "${TEST_FILE_NOT_EXIST}" not found`
        },
        {
          name: '#### no files',
          params: [TEST_FILE_NOT_EXIST, { files: [] }],
          error: `config file "${TEST_FILE_NOT_EXIST}" not found`
        },
        {
          name: '#### not exist file/files',
          params: ['not-exist', { files: ['not-exist1'] }],
          error: 'no file available found: neither "file" nor "files"'
        },
        {
          name: '#### use file',
          params: [
            'test1.config.json',
            {
              files: ['test2.config.ts'],
              context: TEMP_ROOT
            }
          ],
          file: TEST_FILE_CONFIG_1,
          data: {
            a1: 1,
            b1: '1',
            c1: true
          }
        },
        {
          name: '#### use file and context',
          params: [
            'test1.config.json',
            {
              context: TEMP_ROOT
            }
          ],
          file: TEST_FILE_CONFIG_1,
          data: {
            a1: 1,
            b1: '1',
            c1: true
          }
        },
        {
          name: '#### use file in files by order',
          params: [
            'not-exist',
            {
              files: ['test2.config.ts'],
              context: TEMP_ROOT
            }
          ],
          file: TEST_FILE_CONFIG_2,
          data: {
            a2: 2,
            b2: '2',
            c2: false
          }
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          if (item.error) {
            try {
              // @ts-expect-error
              await loadConfig(...item.params)
            } catch (error) {
              expect(error.message).toBe(item.error)
            }
          } else {
            // @ts-ignore
            const { file, data } = await loadConfig(...item.params)
            expect(file).toBe(item.file)
            // const propsData = item.prop ? data[item.prop] : data
            expect(data).toEqual(item.data)
          }
        })
      }
    })
  })
  describe('## defineConfig', () => {
    it('### return value', async () => {
      const result = defineConfig({ a: 1, b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })
  })
})
