import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['@babel/types']
      }
    },
    alias: [
      {
        find: '@ephemeras/fs',
        replacement: `${resolve(__dirname, '../fs/src')}/`
      }
    ]
  }
})
