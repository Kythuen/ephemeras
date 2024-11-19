import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['@babel/types']
      }
    },
    include: [
      '**/test/common.test.ts',
      '**/test/exist.test.ts',
      '**/test/stat.test.ts',
      '**/test/read.test.ts',
      '**/test/ensure.test.ts',
      '**/test/create.test.ts',
      '**/test/copy.test.ts',
      '**/test/remove.test.ts',
      '**/test/empty.test.ts',
      '**/test/move.test.ts'
    ],
    alias: [
      { find: '@ephemeras/fs', replacement: `${resolve(__dirname, 'src')}/` }
    ]
  }
})
