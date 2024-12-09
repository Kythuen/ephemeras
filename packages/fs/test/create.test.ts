import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDir, createFile, createFromJSON } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# createFile()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: []
      },
      {
        name: '### invalid path',
        params: [null]
      },
      {
        name: '### invalid content',
        params: ['create_file.txt', 1]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await createFile(...item.params)
        } catch (e) {
          expect(e).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    beforeEach(() => {
      vol.reset()
    })
    const cases: any = [
      {
        name: '### base',
        params: ['/create_file.txt', 'not exist file'],
        result: {
          existBefore: false,
          existAfter: true,
          content: 'not exist file',
          value: true
        }
      },
      {
        name: '### {context}',
        before: () => vol.mkdirSync('/tmp'),
        params: ['create_file.ts', 'var a = 1', { context: '/tmp' }],
        target: '/tmp/create_file.ts',
        result: {
          existBefore: false,
          existAfter: true,
          content: 'var a = 1',
          value: true
        }
      },
      {
        name: '### {overwrite}',
        before: () => vol.writeFileSync('/create_file.ts', 'var a = 1'),
        params: ['/create_file.ts', 'var b = 2', { overwrite: true }],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'var b = 2',
          value: true
        }
      },
      {
        name: '### {prettier}',
        params: ['/create_file.ts', 'var a     = 1', { prettier: {} }],
        result: {
          existBefore: false,
          existAfter: true,
          content: 'var a = 1;\n',
          value: true
        }
      },
      {
        name: '### exist file',
        before: () => vol.writeFileSync('/create_file.txt', 'exist file'),
        params: ['/create_file.txt'],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'exist file',
          value: false
        }
      },
      {
        name: '### empty content',
        params: ['/create_file.txt'],
        result: {
          existBefore: false,
          existAfter: true,
          content: '',
          value: true
        }
      },
      {
        name: '### already exist & content',
        before: () => vol.writeFileSync('/create_file.ts', 'var a = 1'),
        params: ['/create_file.ts', 'var b = 2'],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'var a = 1',
          value: false
        }
      },
      {
        name: '### already exist & content overwrite prettier',
        before: () => vol.writeFileSync('/create_file.ts', 'var a = 1'),
        params: [
          '/create_file.ts',
          'var b     = 2',
          { overwrite: true, prettier: {} }
        ],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'var b = 2;\n',
          value: true
        }
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        const targetItem = item.target || item.params[0]

        item?.before?.()

        const existBefore = vol.existsSync(targetItem)
        expect(existBefore).toBe(item.result.existBefore)

        // @ts-ignore
        const result = await createFile(...item.params)

        if (item.result.value !== undefined) {
          expect(result).toBe(item.result.value)
        }

        const existAfter = vol.existsSync(targetItem)
        expect(existAfter).toBe(item.result.existAfter)

        const stat = vol.statSync(targetItem)
        if (stat.isFile()) {
          const content = vol.readFileSync(targetItem, 'utf8')
          expect(content).toBe(item.result.content)
        }

        item?.after?.()
      })
    }
  })
})

describe('# createDir()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: undefined
      },
      {
        name: '### invalid path',
        params: null
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await createDir(item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    beforeEach(() => {
      vol.reset()
    })
    const cases: any = [
      {
        name: '### base',
        params: ['create_dir'],
        result: {
          existBefore: false,
          existAfter: true,
          value: true
        }
      },
      {
        name: '### {context}',
        params: ['create_dir', { context: '/tmp' }],
        before: () => vol.mkdirSync('/tmp'),
        target: '/tmp/create_dir',
        result: {
          existBefore: false,
          existAfter: true,
          value: true
        }
      },
      {
        name: '### already exist',
        before: () => vol.mkdirSync('/create_dir'),
        params: ['/create_dir'],
        result: {
          existBefore: true,
          existAfter: true,
          value: false
        }
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        const targetItem = item.target || item.params[0]
        item?.before?.()

        const existBefore = vol.existsSync(targetItem)
        expect(existBefore).toBe(item.result.existBefore)

        // @ts-ignore
        const result = await createDir(...item.params)

        if (item.result.value !== undefined) {
          expect(result).toBe(item.result.value)
        }

        const existAfter = vol.existsSync(targetItem)
        expect(existAfter).toBe(item.result.existAfter)

        item?.after?.()
      })
    }
  })
})
describe('# createFromJSON()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: undefined
      },
      {
        name: '### invalid path',
        params: null
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await createFromJSON(item.params)
        } catch (err: any) {
          expect(err).toBeTruthy()
        }
      })
    }
  })
  describe('## correct cases', () => {
    beforeEach(() => {
      vol.reset()
    })
    const TEST_DIR = '/test_dir'
    const FILES = {
      '1.txt': '1',
      '2.txt': '2',
      '3.txt': '3',
      'sub1/1.txt': 'sub1-1',
      'sub1/2.txt': 'sub1-2',
      'sub1/3.txt': 'sub1-3',
      'sub2/1.txt': 'sub2-1',
      'sub2/2.txt': 'sub2-2',
      'sub2/3.txt': 'sub2-3',
      'sub3': null
    }
    const FILES_FULL_PATH = {
      '/test_dir/1.txt': '1',
      '/test_dir/2.txt': '2',
      '/test_dir/3.txt': '3',
      '/test_dir/sub1/1.txt': 'sub1-1',
      '/test_dir/sub1/2.txt': 'sub1-2',
      '/test_dir/sub1/3.txt': 'sub1-3',
      '/test_dir/sub2/1.txt': 'sub2-1',
      '/test_dir/sub2/2.txt': 'sub2-2',
      '/test_dir/sub2/3.txt': 'sub2-3',
      '/test_dir/sub3': null
    }
    const EXPECT_RESULT = {
      '/test_dir/1.txt': '1',
      '/test_dir/2.txt': '2',
      '/test_dir/3.txt': '3',
      '/test_dir/sub1/1.txt': 'sub1-1',
      '/test_dir/sub1/2.txt': 'sub1-2',
      '/test_dir/sub1/3.txt': 'sub1-3',
      '/test_dir/sub2/1.txt': 'sub2-1',
      '/test_dir/sub2/2.txt': 'sub2-2',
      '/test_dir/sub2/3.txt': 'sub2-3',
      '/test_dir/sub3': null
    }
    it('### base', async () => {
      expect(vol.existsSync(TEST_DIR)).toBeFalsy()

      const { all, done, skip } = await createFromJSON(FILES_FULL_PATH)

      expect(vol.existsSync(TEST_DIR)).toBeTruthy()
      expect(vol.toJSON()).toEqual(EXPECT_RESULT)
      expect(all.length).toBe(Object.keys(FILES_FULL_PATH).length)
      expect(done.length).toBe(all.length)
      expect(skip.length).toBe(0)
      expect(done.every(i => i.includes(TEST_DIR))).toBeTruthy()
    })
    it('### {context}', async () => {
      expect(vol.existsSync(TEST_DIR)).toBeFalsy()

      const { all, done, skip } = await createFromJSON(FILES, {
        context: TEST_DIR
      })

      expect(vol.existsSync(TEST_DIR)).toBeTruthy()
      expect(vol.toJSON()).toEqual(EXPECT_RESULT)
      expect(all.length).toBe(Object.keys(FILES).length)
      expect(done.length).toBe(all.length)
      expect(skip.length).toBe(0)
      expect(done.every(i => i.includes(TEST_DIR))).toBeTruthy()
    })
    it('### {relativize}', async () => {
      expect(vol.existsSync(TEST_DIR)).toBeFalsy()

      const { all, done, skip } = await createFromJSON(FILES, {
        context: TEST_DIR,
        relativize: true
      })

      expect(vol.existsSync(TEST_DIR)).toBeTruthy()
      expect(vol.toJSON()).toEqual(EXPECT_RESULT)
      expect(all.length).toBe(Object.keys(FILES).length)
      expect(done.length).toBe(all.length)
      expect(skip.length).toBe(0)
      expect(done.some(i => i.includes(TEST_DIR))).toBeFalsy()
    })
    it('### {overwrite}', async () => {
      vol.mkdirSync(TEST_DIR)
      vol.mkdirSync(`${TEST_DIR}/sub1`)
      vol.writeFileSync(`${TEST_DIR}/sub1/1.txt`, 'exist content')

      expect(vol.existsSync(TEST_DIR)).toBeTruthy()
      expect(vol.toJSON()).toEqual({
        [`${TEST_DIR}/sub1/1.txt`]: 'exist content'
      })

      const { all, done, skip } = await createFromJSON(FILES, {
        context: TEST_DIR,
        overwrite: true
      })

      expect(vol.existsSync(TEST_DIR)).toBeTruthy()
      expect(vol.toJSON()).toEqual(EXPECT_RESULT)
      expect(all.length).toBe(Object.keys(FILES).length)
      expect(done.length).toBe(all.length)
      expect(skip.length).toBe(0)
    })
    it('### nest', async () => {
      const FILES_NEST = {
        '1.txt': '1',
        '2.txt': '2',
        '3.txt': '3',
        'sub1': {
          '1.txt': 'sub1-1',
          '2.txt': 'sub1-2',
          '3.txt': 'sub1-3'
        },
        'sub2/1.txt': 'sub2-1',
        'sub2/2.txt': 'sub2-2',
        'sub2/3.txt': 'sub2-3',
        'sub3': null
      }
      expect(vol.existsSync(TEST_DIR)).toBeFalsy()

      const { all, done, skip } = await createFromJSON(FILES_NEST, {
        context: TEST_DIR,
        relativize: true
      })

      expect(vol.existsSync(TEST_DIR)).toBeTruthy()
      expect(vol.toJSON()).toEqual(EXPECT_RESULT)
      expect(all.length).toBe(Object.keys(FILES).length)
      expect(done.length).toBe(all.length)
      expect(skip.length).toBe(0)
      expect(done.some(i => i.includes(TEST_DIR))).toBeFalsy()
    })
  })
})
