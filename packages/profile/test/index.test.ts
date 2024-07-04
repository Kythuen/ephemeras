import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Profile } from '../src'
import {
  serializer as serializerIni,
  transformer as transformerIni
} from '../src/format/ini'
import {
  serializer as serializerToml,
  transformer as transformerToml
} from '../src/format/toml'
import {
  serializer as serializerYaml,
  transformer as transformerYaml
} from '../src/format/yaml'
import * as Utils from './utils'
import { beforeEach } from 'node:test'

const TEMP_ROOT = join(homedir(), '.ephemeras/profile/Temp')
const TEST_FILE_NOT_EXIST = join(TEMP_ROOT, 'not_exist_file.json')
const TEST_FILE_JSON = join(TEMP_ROOT, 'config.json')
const TEST_FILE_INI = join(TEMP_ROOT, 'config.ini')
const TEST_FILE_TOML = join(TEMP_ROOT, 'config.toml')
const TEST_FILE_YAML = join(TEMP_ROOT, 'config.yml')

describe('# Profile', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.removeDir(TEMP_ROOT)
  })
  describe('## invalid params', () => {
    const cases = [
      {
        name: '#### invalid path: undefined',
        params: { path: undefined }
      },
      {
        name: '#### invalid path: null',
        params: { path: null }
      },
      {
        name: '#### invalid path: not exists',
        params: { path: TEST_FILE_NOT_EXIST }
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        try {
          // @ts-expect-error
          new Profile(item.params)
        } catch (e: any) {
          expect(e.message).toBeTruthy()
        }
      })
    }
  })
  describe('## correct params', () => {
    describe('### Type', () => {
      beforeEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      const CASES: any = [
        {
          type: 'JSON',
          file: TEST_FILE_JSON,
          serializer: JSON.stringify,
          transformer: JSON.parse
        },
        {
          type: 'INI',
          file: TEST_FILE_INI,
          serializer: serializerIni,
          transformer: transformerIni
        },
        {
          type: 'TOML',
          file: TEST_FILE_TOML,
          serializer: serializerToml,
          transformer: transformerToml
        },
        {
          type: 'YAML',
          file: TEST_FILE_YAML,
          serializer: serializerYaml,
          transformer: transformerYaml
        }
      ]
      for (const item of CASES) {
        it(`#### ${item.type}`, async () => {
          const file = new Profile({
            path: item.file,
            base: TEMP_ROOT,
            serializer: item.serializer,
            transformer: item.transformer
          })
          const fileExist1 = await Utils.exists(item.file)
          expect(fileExist1).toBeTruthy()

          expect(file.getUrl()).toEqual(item.file)
          expect(file.getData()).toEqual({})
          file.set('AA', 'aa')
          expect(file.getData()).toEqual({ AA: 'aa' })
          file.set({ BB: 'bb', CC: 'cc' })
          expect(file.getData()).toEqual({ AA: 'aa', BB: 'bb', CC: 'cc' })
          file.delete('CC')
          expect(file.getData()).toEqual({ AA: 'aa', BB: 'bb' })
          file.clear()
          expect(file.getData()).toEqual({})
          file.remove()

          const fileExist2 = await Utils.exists(item.file)
          expect(fileExist2).toBeFalsy()
        })
      }
    })
  })
})
