import { readdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest'
import { emptyDir } from '../src/empty'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/fs/Temp/empty')
const TEST_FOLDER_NOT_EXIST = join(TEMP_ROOT, 'copy_folder_not_exist')
const TEST_FOLDER_TARGET = join(TEMP_ROOT, 'remove_folder_target')

async function createTestFolder() {
  await Utils.ensureDir(TEST_FOLDER_TARGET)
  await Utils.createFile(join(TEST_FOLDER_TARGET, '1.txt'), '1')
  await Utils.createFile(join(TEST_FOLDER_TARGET, '2.txt'), '2')
  await Utils.createFile(join(TEST_FOLDER_TARGET, '3.txt'), '3')
  await Utils.ensureDir(join(TEST_FOLDER_TARGET, 'sub1'))
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub1/1.txt'), 'sub1-1')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub1/2.txt'), 'sub1-2')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub1/3.txt'), 'sub1-3')
  await Utils.ensureDir(join(TEST_FOLDER_TARGET, 'sub2'))
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub2/1.txt'), 'sub2-1')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub2/2.txt'), 'sub2-2')
  await Utils.createFile(join(TEST_FOLDER_TARGET, 'sub2/3.txt'), 'sub2-3')
  await Utils.ensureDir(join(TEST_FOLDER_TARGET, 'sub3'))
}

describe('# empty.ts', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.emptyDir(TEMP_ROOT)
  })
  describe('## empty', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '### invalid path: undefined',
          params: []
        },
        {
          name: '### invalid path: null',
          params: [null]
        },
        {
          name: '### invalid path: not exist',
          params: [TEST_FOLDER_NOT_EXIST]
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await emptyDir(...item.params)
          } catch (e) {
            expect(e.message).toBeTruthy()
          }
        })
      }
    })
    describe('### correct params', () => {
      beforeEach(async () => {
        await createTestFolder()
      })
      afterEach(async () => {
        await Utils.emptyDir(TEMP_ROOT)
      })
      it('#### empty folder', async () => {
        await emptyDir(TEST_FOLDER_TARGET)
        const existsAfter = await Utils.exists(TEST_FOLDER_TARGET)
        expect(existsAfter).toBeTruthy()

        const list = await readdir(TEST_FOLDER_TARGET)
        expect(list.length).toBe(0)
      })
    })
  })
})
