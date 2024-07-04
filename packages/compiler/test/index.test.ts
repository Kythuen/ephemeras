import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Complier, nunjucks, prettier } from '../src'
import * as Utils from './utils'

const TEMP_ROOT = join(homedir(), '.ephemeras/compiler/Temp')
const TEST_FOLDER_SRC = join(TEMP_ROOT, 'src')
const TEST_FOLDER_DEST = join(TEMP_ROOT, 'dest')

async function createTestFolder() {
  await Utils.ensureDir(TEST_FOLDER_SRC)
  await Utils.createFile(join(TEST_FOLDER_SRC, '1.txt'), '1')
  await Utils.createFile(join(TEST_FOLDER_SRC, '2.txt'), '{{ data }}')
  await Utils.createFile(join(TEST_FOLDER_SRC, '3.txt'), '3')
  for (let i = 0; i < 10; i++) {
    await Utils.ensureDir(join(TEST_FOLDER_SRC, `sub${i}`))
    await Utils.createFile(join(TEST_FOLDER_SRC, `sub${i}/1.txt`), `sub${i}-1`)
    await Utils.createFile(join(TEST_FOLDER_SRC, `sub${i}/2.txt`), '{{ data }}')
    await Utils.createFile(join(TEST_FOLDER_SRC, `sub${i}/3.txt`), `sub${i}-3`)
  }
  await Utils.ensureDir(join(TEST_FOLDER_SRC, 'sub3'))
}

describe('# Base', () => {
  beforeAll(async () => {
    await Utils.ensureDir(TEMP_ROOT)
  })
  afterAll(async () => {
    await Utils.removeDir(TEMP_ROOT)
  })
  it('## Compile folder', async () => {
    await createTestFolder()
    Utils.getLeafItems(TEST_FOLDER_SRC)
    const srcExists = await Utils.exists(TEST_FOLDER_SRC)
    expect(srcExists).toBeTruthy()

    const compiler = new Complier({
      context: TEMP_ROOT,
      source: 'src',
      destination: 'dest',
      data: { data: '1111111' }
    })

    compiler.set('clean', true)

    compiler.use(nunjucks()).use(prettier({ excludes: ['**/*.txt'] }))

    await compiler.build()

    const content2 = await readFile(join(TEST_FOLDER_DEST, '2.txt'), {
      encoding: 'utf-8'
    })
    expect(content2).toBe('1111111')
  }, 60000)
})
