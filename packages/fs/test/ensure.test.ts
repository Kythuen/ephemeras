import { vol } from 'memfs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ensureDir, ensureFile } from '../src'

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('# ensureDir()', () => {
  describe('## invalid cases', () => {
    const cases = [
      {
        name: '### no path',
        params: []
      },
      {
        name: '### invalid path',
        params: [null]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await ensureDir(...item.params)
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
        params: ['/ensure_dir'],
        result: {
          existBefore: false,
          existAfter: true,
          value: true
        }
      },
      {
        name: '### {context}',
        params: ['ensure_dir', { context: '/tmp' }],
        target: '/tmp/ensure_dir',
        result: {
          existBefore: false,
          existAfter: true,
          value: true
        }
      },
      {
        name: '### already exist',
        before: () => vol.mkdirSync('/ensure_dir'),
        params: ['/ensure_dir'],
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
        const result = await ensureDir(...item.params)

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

describe('# ensureFile()', () => {
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
        params: ['/', null]
      }
    ]
    for (const item of cases) {
      it(item.name, async () => {
        try {
          // @ts-expect-error
          await ensureFile(...item.params)
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
        params: ['/ensure_file.txt', 'var a = 1'],
        result: {
          existBefore: false,
          existAfter: true,
          content: 'var a = 1',
          value: true
        }
      },
      {
        name: '### {context}',
        params: ['ensure_file.txt', 'var a = 1', { context: '/tmp' }],
        target: '/tmp/ensure_file.txt',
        result: {
          existBefore: false,
          existAfter: true,
          content: 'var a = 1',
          value: true
        }
      },
      {
        name: '### {overwrite}',
        before: () => vol.writeFileSync('/ensure_file.txt', 'var a = 1'),
        params: ['/ensure_file.txt', 'var b = 2', { overwrite: true }],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'var b = 2',
          value: true
        }
      },
      {
        name: '### already exist',
        before: () => vol.writeFileSync('/ensure_file.txt', 'var a = 1'),
        params: ['/ensure_file.txt'],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'var a = 1',
          value: false
        }
      },
      {
        name: '### exist file & content',
        before: () => vol.writeFileSync('/ensure_file.txt', 'var a = 1'),
        params: ['/ensure_file.txt', 'var b = 2'],
        result: {
          existBefore: true,
          existAfter: true,
          content: 'var a = 1',
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
        const result = await ensureFile(...item.params)

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
