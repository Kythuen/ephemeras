import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from 'vitest'
import {
  getPackageManager,
  getPackageManagers,
  isPnpmWorkspaceRepo,
  isProject,
  readPKG
} from '../src/build'
import {
  PM_LOCK_FILES,
  PNPM_WORKSPACE_CONFIG_FILES
} from '../src/build/constant'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/utils/Temp/build/correct')
const TEMP_ROOT_ERROR = join(homedir(), '.ephemeras/utils/Temp/build/error')
const TEST_FILE_PKG = join(TEMP_ROOT, 'package.json')
const TEST_FILE_PKG_ERROR = join(TEMP_ROOT_ERROR, 'package.json')

describe('# build', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
    await Utils.ensureDir(TEMP_ROOT_ERROR)
    await Utils.createFile(TEST_FILE_PKG, `{ name: 'pkg-name' }`)
    await Utils.createFile(TEST_FILE_PKG_ERROR, '1')
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
    await Utils.emptyDir(TEMP_ROOT_ERROR)
  })
  describe('## readPKG', () => {
    describe('### fail cases', () => {
      const cases = [
        {
          name: '#### invalid path: null',
          params: null,
          error: `Cannot read properties of undefined (reading 'toString')`
        },
        {
          name: '#### invalid context type',
          parameters: 111,
          error:
            'Failed to read package.json: The "paths[0]" argument must be of type string. Received type number (111).'
        },
        {
          name: '#### not-exist context',
          parameters: './not-exist',
          error: 'Cannot find package.json file.'
        },
        {
          name: '#### error package.json file',
          parameters: join(TEMP_ROOT_ERROR),
          error: 'Failed to read package.json: Unexpected end of JSON input'
        }
      ]
      for (const item of cases) {
        it(item.name, () => {
          try {
            // @ts-expect-error
            readPKG(item.parameters)
          } catch (e) {
            expect(e.message).toBe(item.error)
          }
        })
      }
    })
    describe('### correct cases', () => {
      it('#### no context', () => {
        const { name } = readPKG()
        expect(name).toBe('@ephemeras/utils')
      })
      it('#### current context', () => {
        const { name } = readPKG('../..')
        expect(name).toBe('@ephemeras/monorepo')
      })
    })
  })
  describe('## getPackageManager', () => {
    it('### not special', () => {
      expect(getPackageManager()).toBe('pnpm')
    })
    const pms = ['npm', 'yarn', 'pnpm']
    for (const pm of pms) {
      describe(`### ${pm}`, async () => {
        beforeAll(async () => {
          await Utils.createFile(join(TEMP_ROOT, PM_LOCK_FILES[pm]))
        })
        afterAll(async () => {
          await Utils.removeFile(join(TEMP_ROOT, PM_LOCK_FILES[pm]))
        })
        it('### result', () => {
          expect(getPackageManager(TEMP_ROOT)).toBe(pm)
        })
      })
    }
  })
  describe('## getPackageManagers', () => {
    it('### result', () => {
      expectTypeOf(getPackageManagers()).toBeArray()
    })
  })
  describe('## isPnpmWorkspaceRepo', async () => {
    it('### falsy', () => {
      expect(isPnpmWorkspaceRepo()).toBeFalsy()
    })
    beforeAll(async () => {
      await Utils.createFile(join(TEMP_ROOT, 'package.json'), '{}')
    })
    for (const file of PNPM_WORKSPACE_CONFIG_FILES) {
      describe(`### config file: ${file}`, async () => {
        beforeAll(async () => {
          await Utils.createFile(join(TEMP_ROOT, file))
        })
        afterAll(async () => {
          await Utils.removeFile(join(TEMP_ROOT, file))
        })
        it('#### result', () => {
          expect(isPnpmWorkspaceRepo(TEMP_ROOT)).toBeTruthy()
        })
      })
    }
    afterAll(async () => {
      await Utils.removeFile(join(TEMP_ROOT, 'package.json'))
    })
  })
  describe('## isProject', () => {
    it('### falsy', async () => {
      if (await Utils.exists(join(TEMP_ROOT, 'package.json'))) {
        await Utils.removeFile(join(TEMP_ROOT, 'package.json'))
      }
      expect(isProject(TEMP_ROOT)).toBeFalsy()
    })
    it('### truthy', async () => {
      expect(isProject()).toBeTruthy()
      if (!(await Utils.exists(join(TEMP_ROOT, 'package.json')))) {
        await Utils.createFile(join(TEMP_ROOT, 'package.json'))
      }
      expect(isProject(TEMP_ROOT)).toBeTruthy()
    })
  })
})
