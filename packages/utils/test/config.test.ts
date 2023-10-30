import { describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { loadConfig, defineConfig } from '../src/config'

describe('# config', () => {
  describe('## loadConfig', () => {
    describe('### invalid params', () => {
      const cases = [
        {
          name: '#### no params',
          params: [],
          error: '"file" is required'
        },
        {
          name: '#### invalid file type',
          params: [1],
          error: '"file" must be a string'
        },
        {
          name: '#### invalid files type',
          params: ['not-exist', 1],
          error: '"options" must be of type object'
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          try {
            // @ts-expect-error
            await loadConfig(...item.params)
          } catch (error) {
            expect(error.message).toBe(item.error)
          }
        })
      }
    })
    describe('### verify result', () => {
      const cases = [
        {
          name: '#### file not exist',
          params: ['not-exist'],
          error: `config file "${resolve(process.cwd(), 'not-exist')}" not found`
        },
        {
          name: '#### no files',
          params: ['not-exist', { files: [] }],
          error: `config file "${resolve(process.cwd(), 'not-exist')}" not found`
        },
        {
          name: '#### not exist file/files',
          params: ['not-exist', { files: ['not-exist1'] }],
          error: 'no file available found: neither "file" nor "files"'
        },
        {
          name: '#### use file',
          params: [
            'tsconfig.json',
            {
              files: ['tsup.config.ts', 'vitest.config.ts']
            }
          ],
          file: resolve(process.cwd(), 'tsconfig.json'),
          data: {
            compilerOptions: {
              module: 'CommonJS',
              target: 'ES2015',
              moduleResolution: 'node',
              outDir: 'dist',
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              strict: true,
              skipLibCheck: true,
              resolveJsonModule: true
            },
            include: ['src']
          }
        },
        {
          name: '#### use file and context',
          params: [
            'tsconfig.json',
            {
              context: '.'
            }
          ],
          file: resolve(process.cwd(), 'tsconfig.json'),
          data: {
            compilerOptions: {
              module: 'CommonJS',
              target: 'ES2015',
              moduleResolution: 'node',
              outDir: 'dist',
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              strict: true,
              skipLibCheck: true,
              resolveJsonModule: true
            },
            include: ['src']
          }
        },
        {
          name: '#### use file in files by order',
          params: [
            'not-exist',
            {
              files: ['tsup.config.ts', 'vitest.config.ts']
            }
          ],
          file: resolve(process.cwd(), 'tsup.config.ts'),
          prop: 'tsup',
          data: {
            entry: ['src/**/*.ts'],
            format: ['cjs', 'esm'],
            dts: true,
            splitting: true,
            clean: true,
            shims: false
          }
        }
      ]
      for (const item of cases) {
        it(item.name, async () => {
          if (item.error) {
            try {
              // @ts-expect-error
              await loadConfig(...item.params)
            } catch (error) {
              expect(error.message).toBe(item.error)
            }
          } else {
            // @ts-ignore
            const { file, data } = await loadConfig(...item.params)
            expect(file).toBe(item.file)
            const propsData = item.prop ? data[item.prop] : data
            expect(propsData).toEqual(item.data)
          }
        })
      }
    })
  })
  describe('## defineConfig', () => {
    it('### return value', async () => {
      const result = defineConfig({ a: 1, b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })
  })
})
