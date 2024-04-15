import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { homedir } from 'node:os'
import { join } from 'node:path'
import * as Utils from './utils'
import { Profile } from '../src/profile'
import {
  serializer as yamlSerializer,
  transformer as yamlTransformer
} from '../src/profile/format/yaml'
import {
  serializer as tomlSerializer,
  transformer as tomlTransformer
} from '../src/profile/format/toml'
import {
  serializer as iniSerializer,
  transformer as iniTransformer
} from '../src/profile/format/ini'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/profile')
const TEST_FILE_NOT_EXIST = join(TEMP_ROOT, 'not-exist')
const TEST_FILE_JSON = join(TEMP_ROOT, 'test.json')
const TEST_FILE_YAML = join(TEMP_ROOT, 'test.yaml')
const TEST_FILE_TOML = join(TEMP_ROOT, 'test.toml')
const TEST_FILE_INI = join(TEMP_ROOT, 'test.ini')

describe('# profile', () => {
  beforeAll(async () => {
    await Utils.createDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## invalid params', () => {
    const cases = [
      {
        name: '### base: invalid type',
        params: { base: 1, path: TEST_FILE_JSON },
        error: 'base directory: "1" is not exists'
      },
      {
        name: '### base: not exist',
        params: { base: 'not-exist', path: TEST_FILE_JSON },
        error: 'base directory: "not-exist" is not exists'
      },
      {
        name: '### path: invalid type',
        params: { path: 1 },
        error:
          'The "path" argument must be of type string. Received type number (1)'
      },
      {
        name: '### path: invalid type',
        params: { path: 'not-a-file' },
        error: 'path: "not-a-file" must be a file'
      },
      {
        name: '### data: invalid type',
        params: { path: TEST_FILE_JSON, data: 1 },
        error: 'invalid params for function set()'
      },
      {
        name: '### transformer: invalid type',
        params: {
          path: TEST_FILE_JSON,
          data: {},
          transformer: 1
        },
        error: 'this.transformer is not a function'
      },
      {
        name: '### transformer: not peer serializer',
        params: {
          path: '.utils-test/setting.yaml',
          data: {},
          transformer: yamlTransformer
        },
        error:
          '"options" contains [transformer] without its required peers [serializer]'
      },
      {
        name: '### serializer: not peer transformer',
        params: {
          path: '.utils-test/setting.yaml',
          data: {},
          serializer: yamlSerializer
        },
        error:
          '"options" contains [serializer] without its required peers [transformer]'
      }
    ]
    for (const item of cases) {
      it(item.name, () => {
        expect(() => {
          // @ts-expect-error
          new Profile(item.params)
        }).toThrowError()
      })
    }
  })
})
