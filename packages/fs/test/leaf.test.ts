import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getLeafs } from '../src/leaf'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/leaf')
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'not_exist')
const TEST_FOLDER_SRC = join(TEMP_ROOT, 'src')

async function createTestFolder() {
  await Utils.ensureDir(TEST_FOLDER_SRC)
  await Utils.createFile(join(TEST_FOLDER_SRC, '1.txt'), '1')
  await Utils.createFile(join(TEST_FOLDER_SRC, '2.txt'), '2')
  await Utils.createFile(join(TEST_FOLDER_SRC, '3.txt'), '3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub1'))
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/1.txt'), 'sub1-1')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/2.txt'), 'sub1-2')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub1/3.txt'), 'sub1-3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub2'))
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/1.txt'), 'sub2-1')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/2.txt'), 'sub2-2')
  await Utils.createFile(join(TEST_FOLDER_SRC, 'sub2/3.txt'), 'sub2-3')
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub3'))
}

describe('# leaf.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## getLeaf', () => {
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
          name: '#### invalid src path: null',
          params: [undefined, TEMP_ROOT]
        },
        {
          name: '#### invalid dest path: null',
          params: [TEMP_ROOT, undefined]
        },
        {
          name: '#### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST, TEST_FOLDER_NOT_EXIST]
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await getLeafs(...item.params)
          } catch (e) {
            expect(e.message).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', () => {
      it('#### no base', async () => {
        await createTestFolder()

        const result = getLeafs(TEST_FOLDER_SRC)

        expect(result).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/1.txt',
          'sub2/2.txt',
          'sub2/3.txt',
          'sub3'
        ])
      })
      it('#### with base', async () => {
        await createTestFolder()

        const result = getLeafs(TEST_FOLDER_SRC, TEMP_ROOT)

        expect(result).toEqual([
          'src/1.txt',
          'src/2.txt',
          'src/3.txt',
          'src/sub1/1.txt',
          'src/sub1/2.txt',
          'src/sub1/3.txt',
          'src/sub2/1.txt',
          'src/sub2/2.txt',
          'src/sub2/3.txt',
          'src/sub3'
        ])
      })
      it('#### with options', async () => {
        await createTestFolder()

        const result = getLeafs(TEST_FOLDER_SRC, TEST_FOLDER_SRC, {
          emptyDir: false
        })

        expect(result).toEqual([
          '1.txt',
          '2.txt',
          '3.txt',
          'sub1/1.txt',
          'sub1/2.txt',
          'sub1/3.txt',
          'sub2/1.txt',
          'sub2/2.txt',
          'sub2/3.txt'
        ])
      })
    })
  })
})
