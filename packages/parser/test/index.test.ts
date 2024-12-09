import { vol } from 'memfs'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Parser, nunjucks, prettier } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# Parse directory', () => {
  const TEST_DIR_SRC = '/test_dir_src'
  const TEST_DIR_DEST = '/test_dir_dest'
  const FILES = {
    '1.txt': '1',
    '2.txt': '{{ data }}',
    '3.txt': '3',
    'sub1/1.txt': 'sub1-1',
    'sub1/2.txt': 'sub1-2',
    'sub1/3.txt': 'sub1-3',
    'sub2/1.txt': 'sub2-1',
    'sub2/2.txt': 'sub2-2',
    'sub2/3.txt': 'sub2-3',
    'sub3': null
  }
  beforeEach(() => {
    vol.reset()
    vol.fromJSON(FILES, TEST_DIR_SRC)
  })
  it('## Parse folder', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      data: { data: '1111111' }
    })
    parser.set('clean', true)

    parser.use(nunjucks()).use(prettier())

    await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON()).toEqual({})

    // const content2 = await readFile(join(TEST_DIR_DEST, '2.txt'), {
    //   encoding: 'utf-8'
    // })
    // expect(content2).toBe('1111111')
  })
})
