import { vol } from 'memfs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Parser, nunjucks, prettier } from '../src'
import { noDisk } from './utils'

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
    'sub3': null,
    'sub4/1.ts': 'export default { data: {{ data }} }',
    'sub4/2.js': 'module.exports = { data: {{ data }} }',
    'sub4/3.vue': '<template><div>{{ data }}</div></template>',
    '{{ data }}.txt': '11111111'
  }
  beforeEach(() => {
    vol.reset()
    vol.fromJSON(FILES, TEST_DIR_SRC)
  })
  it('## base', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
  // it('## {clean}', async () => {
  //   vol.mkdirSync(TEST_DIR_DEST)
  //   vol.writeFileSync(`${TEST_DIR_DEST}/redundance.txt`, 'exist content')
  //   expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
  //   expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()

  //   const parser = new Parser({
  //     source: TEST_DIR_SRC,
  //     destination: TEST_DIR_DEST
  //   })
  //   parser.set('clean', true)

  //   await parser.build()

  //   expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
  //   expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
  //   expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
  //     vol.toJSON(TEST_DIR_SRC, {}, true)
  //   )
  //   expect(vol.existsSync(`${TEST_DIR_DEST}/redundance.txt`)).toBeFalsy()
  // })
  it('## {overwrite}', async () => {
    vol.mkdirSync(TEST_DIR_DEST)
    vol.mkdirSync(`${TEST_DIR_DEST}/sub1`)
    vol.writeFileSync(`${TEST_DIR_DEST}/sub1/1.txt`, 'exist content')
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      overwrite: true
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )
    expect(vol.readFileSync(`${TEST_DIR_DEST}/sub1/1.txt`, 'utf8')).toBe(
      'sub1-1'
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(
      Object.keys(vol.toJSON(TEST_DIR_DEST)).length - 1
    )
    expect(add.some(i => i.includes(TEST_DIR_DEST))).toBeFalsy()
    expect(skip.length).toBe(0)
    expect(update.length).toBe(1)
  })
  // it('## {context}', async () => {
  //   expect(vol.existsSync(`${TEST_DIR_SRC}/sub1`)).toBeTruthy()
  //   expect(vol.existsSync(`${TEST_DIR_SRC}/sub11`)).toBeFalsy()

  //   const parser = new Parser({
  //     source: 'sub1',
  //     destination: 'sub11',
  //     context: TEST_DIR_SRC
  //   })

  //   await parser.build()

  //   expect(vol.existsSync(`${TEST_DIR_SRC}/sub1`)).toBeTruthy()
  //   expect(vol.existsSync(`${TEST_DIR_SRC}/sub11`)).toBeTruthy()
  //   expect(vol.toJSON(`${TEST_DIR_SRC}/sub1`, {}, true)).toEqual(
  //     vol.toJSON(`${TEST_DIR_SRC}/sub11`, {}, true)
  //   )
  // })
  it('## {relativize}', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      relativize: true
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.some(i => i.includes(TEST_DIR_DEST))).toBeFalsy()
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
})
