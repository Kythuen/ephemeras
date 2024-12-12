import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Parser, FileParser, nunjucks, prettier } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# Parse directory', () => {
  const TEST_DIR_SRC = '/test_dir_src'
  const TEST_DIR_DEST = '/test_dir_dest'
  const FILES = {
    '1.txt': '1',
    '2.txt': 'content text',
    '3.txt': '3',
    'sub1/1.txt': 'sub1-1',
    'sub1/2.txt': 'sub1-2',
    'sub1/3.txt': 'sub1-3',
    'sub2/1.txt': 'sub2-1',
    'sub2/2.txt': 'sub2-2',
    'sub2/3.txt': 'sub2-3',
    'sub3': null,
    'sub4/1.ts': `export default { content: 'content text' }`,
    'sub4/2.js': `module.exports          = { content: 'content text' }`,
    'sub4/3.vue': '<template><div>content text</div></template>',
    '{{ name }}.txt': '11111111'
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

    const { src, dest, add, skip, update } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_DEST, {}, true)
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
  it('## {context}', async () => {
    expect(vol.existsSync(`${TEST_DIR_SRC}/sub1`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_DIR_SRC}/sub11`)).toBeFalsy()

    const parser = new Parser({
      source: 'sub1',
      destination: 'sub11',
      context: TEST_DIR_SRC
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(`${TEST_DIR_SRC}/sub1`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_DIR_SRC}/sub11`)).toBeTruthy()
    expect(vol.toJSON(`${TEST_DIR_SRC}/sub1`, {}, true)).toEqual(
      vol.toJSON(`${TEST_DIR_SRC}/sub11`, {}, true)
    )

    expect(src.length).toEqual(
      Object.keys(vol.toJSON(`${TEST_DIR_SRC}/sub1`)).length
    )
    expect(dest.length).toEqual(
      Object.keys(vol.toJSON(`${TEST_DIR_SRC}/sub11`)).length
    )
    expect(add.length).toEqual(
      Object.keys(vol.toJSON(`${TEST_DIR_SRC}/sub11`)).length
    )
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
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
      vol.toJSON(TEST_DIR_DEST, {}, true)
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
    expect(src.some(i => i.includes(TEST_DIR_DEST))).toBeFalsy()
    expect(add.some(i => i.includes(TEST_DIR_DEST))).toBeFalsy()
  })
  it('## {clean}', async () => {
    vol.mkdirSync(TEST_DIR_DEST)
    vol.writeFileSync(`${TEST_DIR_DEST}/exist.txt`, 'exist content')
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST
    })
    parser.set('clean', true)

    const { src, dest, add, skip, update } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )
    expect(vol.existsSync(`${TEST_DIR_DEST}/exist.txt`)).toBeFalsy()

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
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
    expect(skip.length).toBe(0)
    expect(update.length).toBe(1)
  })
  it('## {includes}', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      includes: ['**/1.txt']
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )
    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(3)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
  it('## {excludes}', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      excludes: ['**/1.txt']
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )
    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(src.length - 3)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
  it('## {filter}', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      filter: path => path.includes('1.txt')
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_SRC, {}, true)
    )
    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(3)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
  it('### {beforeEach}', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    function eachHandler(_: string, dest: string) {
      return dest
    }
    const mock = vi.fn().mockImplementation(eachHandler)

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      beforeEach: mock,
      relativize: true
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_DEST, {}, true)
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)

    expect(mock).toHaveBeenCalledTimes(src.length)
  })
  it('### {afterEach}', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    function eachHandler(_: string, dest: string) {
      return dest
    }
    const mock = vi.fn().mockImplementation(eachHandler)

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      afterEach: mock,
      relativize: true
    })

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()
    expect(vol.toJSON(TEST_DIR_SRC, {}, true)).toEqual(
      vol.toJSON(TEST_DIR_DEST, {}, true)
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)

    expect(mock).toHaveBeenCalledTimes(src.length)
  })
  it('### plugin:nunjucks', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST
    })
    parser.use(nunjucks({ name: 'file1', content: 'content text' }))

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()

    expect(vol.readFileSync(`${TEST_DIR_DEST}/2.txt`, 'utf8')).toBe(
      'content text'
    )
    expect(vol.readFileSync(`${TEST_DIR_DEST}/sub4/1.ts`, 'utf8')).toBe(
      `export default { content: 'content text' }`
    )
    expect(vol.readFileSync(`${TEST_DIR_DEST}/sub4/2.js`, 'utf8')).toBe(
      `module.exports          = { content: 'content text' }`
    )
    expect(vol.readFileSync(`${TEST_DIR_DEST}/sub4/3.vue`, 'utf8')).toBe(
      `<template><div>content text</div></template>`
    )

    expect(vol.existsSync(`${TEST_DIR_DEST}/file1.txt`)).toBeTruthy()

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
  it('### plugin:prettier', async () => {
    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeFalsy()

    const parser = new Parser({
      source: TEST_DIR_SRC,
      destination: TEST_DIR_DEST,
      relativize: true
    })
    parser.use(prettier())

    const { src, dest, add, update, skip } = await parser.build()

    expect(vol.existsSync(TEST_DIR_SRC)).toBeTruthy()
    expect(vol.existsSync(TEST_DIR_DEST)).toBeTruthy()

    expect(vol.readFileSync(`${TEST_DIR_DEST}/sub4/1.ts`, 'utf8')).toBe(
      `export default { content: 'content text' }\n`
    )
    expect(vol.readFileSync(`${TEST_DIR_DEST}/sub4/2.js`, 'utf8')).toBe(
      `module.exports = { content: 'content text' }\n`
    )

    expect(src.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_SRC)).length)
    expect(dest.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(add.length).toEqual(Object.keys(vol.toJSON(TEST_DIR_DEST)).length)
    expect(skip.length).toBe(0)
    expect(update.length).toBe(0)
  })
})

describe('# Parse file', () => {
  const TEST_FILE_SRC = '/test_file_src'
  const TEST_FILE_DEST = '/test_file_dest'
  const FILES: Record<string, string> = {
    '1.txt': '1',
    '2.ts': `export default { content: 'content text' }`,
    '3.js': `module.exports          = { content: 'content text' }`,
    '4.vue': '<template><div>content text</div></template>',
    'template.txt': '{{ content }}'
  }
  beforeEach(() => {
    vol.reset()
    vol.fromJSON(FILES, TEST_FILE_SRC)
  })
  it('## base', async () => {
    for (const file in FILES) {
      expect(vol.existsSync(`${TEST_FILE_SRC}/${file}`)).toBeTruthy()
      expect(vol.existsSync(`${TEST_FILE_DEST}/${file}`)).toBeFalsy()

      const parser = new FileParser({
        source: `${TEST_FILE_SRC}/${file}`,
        destination: `${TEST_FILE_DEST}/${file}`
      })

      const result = await parser.build()

      expect(result).toBe(true)
      expect(vol.existsSync(`${TEST_FILE_SRC}/${file}`)).toBeTruthy()
      expect(vol.existsSync(`${TEST_FILE_DEST}/${file}`)).toBeTruthy()
      expect(vol.readFileSync(`${TEST_FILE_DEST}/${file}`, 'utf8')).toBe(
        FILES[file]
      )
    }
  })
  it('## base', async () => {
    for (const file in FILES) {
      expect(vol.existsSync(`${TEST_FILE_SRC}/${file}`)).toBeTruthy()
      expect(vol.existsSync(`${TEST_FILE_DEST}/${file}`)).toBeFalsy()

      const parser = new FileParser({
        source: `${TEST_FILE_SRC}/${file}`,
        destination: `${TEST_FILE_DEST}/${file}`
      })

      const result = await parser.build()

      expect(result).toBe(true)
      expect(vol.existsSync(`${TEST_FILE_SRC}/${file}`)).toBeTruthy()
      expect(vol.existsSync(`${TEST_FILE_DEST}/${file}`)).toBeTruthy()
      expect(vol.readFileSync(`${TEST_FILE_DEST}/${file}`, 'utf8')).toBe(
        FILES[file]
      )
    }
  })
  it('## {context}', async () => {
    const TEST_FILE_DEST = 'test_file_src_sub'
    for (const file in FILES) {
      expect(vol.existsSync(`${TEST_FILE_SRC}/${file}`)).toBeTruthy()
      expect(vol.existsSync(`${TEST_FILE_DEST}/${file}`)).toBeFalsy()

      const parser = new FileParser({
        source: file,
        destination: `${TEST_FILE_DEST}/${file}`,
        context: TEST_FILE_SRC
      })

      const result = await parser.build()

      expect(result).toBe(true)
      expect(vol.existsSync(`${TEST_FILE_SRC}/${file}`)).toBeTruthy()
      expect(
        vol.existsSync(`${TEST_FILE_SRC}/${TEST_FILE_DEST}/${file}`)
      ).toBeTruthy()
      expect(
        vol.readFileSync(`${TEST_FILE_SRC}/${TEST_FILE_DEST}/${file}`, 'utf8')
      ).toBe(FILES[file])
    }
  })
  it('## {overwrite}', async () => {
    vol.mkdirSync(TEST_FILE_DEST)
    vol.writeFileSync(`${TEST_FILE_DEST}/1.txt`, 'exist content')
    expect(vol.existsSync(`${TEST_FILE_SRC}/1.txt`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_FILE_DEST}/1.txt`)).toBeTruthy()

    const parser = new FileParser({
      source: `${TEST_FILE_SRC}/1.txt`,
      destination: `${TEST_FILE_DEST}/1.txt`,
      overwrite: true
    })

    const result = await parser.build()

    expect(result).toBe(true)
    expect(vol.existsSync(`${TEST_FILE_SRC}/1.txt`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_FILE_DEST}/1.txt`)).toBeTruthy()
    expect(vol.readFileSync(`${TEST_FILE_DEST}/1.txt`, 'utf8')).toBe('1')
  })
  it('## plugin:nunjucks', async () => {
    expect(vol.existsSync(`${TEST_FILE_SRC}/template.txt`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_FILE_DEST}/1.txt`)).toBeFalsy()

    const parser = new FileParser({
      source: `${TEST_FILE_SRC}/template.txt`,
      destination: `${TEST_FILE_DEST}/1.txt`
    })
    parser.use(nunjucks({ name: 'file1', content: 'content text' }))

    const result = await parser.build()

    expect(result).toBe(true)
    expect(vol.existsSync(`${TEST_FILE_SRC}/template.txt`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_FILE_DEST}/1.txt`)).toBeTruthy()
    expect(vol.readFileSync(`${TEST_FILE_DEST}/1.txt`, 'utf8')).toBe(
      'content text'
    )
  })
  it('## plugin:prettier', async () => {
    expect(vol.existsSync(`${TEST_FILE_SRC}/3.js`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_FILE_DEST}/3.js`)).toBeFalsy()

    const parser = new FileParser({
      source: `${TEST_FILE_SRC}/3.js`,
      destination: `${TEST_FILE_DEST}/3.js`
    })
    parser.use(prettier())

    const result = await parser.build()

    expect(result).toBe(true)
    expect(vol.existsSync(`${TEST_FILE_SRC}/3.js`)).toBeTruthy()
    expect(vol.existsSync(`${TEST_FILE_DEST}/3.js`)).toBeTruthy()
    expect(vol.readFileSync(`${TEST_FILE_DEST}/3.js`, 'utf8')).toBe(
      `module.exports = { content: 'content text' }\n`
    )
  })
})
