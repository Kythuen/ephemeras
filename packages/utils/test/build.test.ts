import { describe, expect, it, beforeAll, afterAll, expectTypeOf } from 'vitest'
import { ensureFileSync, removeSync } from 'fs-extra'
import {
  readPKG,
  getPackageManager,
  getPackageManagers,
  isPnpmWorkspaceRepo,
  isProject
} from '../src/build'
import { PNPM_WORKSPACE_CONFIG_FILES } from '../src/build/constant'

describe('# build', () => {
  describe('## readPKG', () => {
    describe('### fail case', () => {
      beforeAll(() => {
        ensureFileSync('test/temp/error/package.json')
      })
      const cases = [
        {
          name: '#### invalid context type',
          parameters: 111,
          error: '"context" must be a string'
        },
        {
          name: '#### not-exist context',
          parameters: './not-exist',
          error: 'Cannot find package.json file'
        },
        {
          name: '#### error package.json file',
          parameters: './test/temp/error',
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
      afterAll(() => {
        removeSync('test/temp')
      })
    })
    describe('### verify result', () => {
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
      expect(getPackageManager()).toBe('npm')
    })
    describe('### npm', () => {
      beforeAll(() => {
        ensureFileSync('package-lock.json')
      })
      afterAll(() => {
        removeSync('package-lock.json')
      })
      it('#### result', () => {
        expect(getPackageManager()).toBe('npm')
      })
    })
    describe('### yarn', () => {
      beforeAll(() => {
        ensureFileSync('yarn.lock')
      })
      afterAll(() => {
        removeSync('yarn.lock')
      })
      it('#### result', () => {
        expect(getPackageManager()).toBe('yarn')
      })
    })
    describe('### pnpm', () => {
      beforeAll(() => {
        ensureFileSync('pnpm-lock.yaml')
      })
      afterAll(() => {
        removeSync('pnpm-lock.yaml')
      })
      it('#### result', () => {
        expect(getPackageManager()).toBe('pnpm')
      })
    })
  })
  describe('## getPackageManagers', () => {
    it('### result', () => {
      expectTypeOf(getPackageManagers()).toBeArray()
    })
  })
  describe('## isPnpmWorkspaceRepo', () => {
    it('### not pnpm workspace repo', () => {
      expect(isPnpmWorkspaceRepo()).toBeFalsy()
    })
    for (const file of PNPM_WORKSPACE_CONFIG_FILES) {
      describe(`### config file: ${file}`, () => {
        beforeAll(() => {
          ensureFileSync(file)
        })
        afterAll(() => {
          removeSync(file)
        })
        it('#### result', () => {
          expect(isPnpmWorkspaceRepo()).toBeTruthy()
        })
      })
    }
  })
  describe('## isProject', () => {
    it('### no', () => {
      expect(isProject(__dirname)).toBeFalsy()
    })
    it('### yes', () => {
      expect(isProject()).toBeTruthy()
    })
  })
})
