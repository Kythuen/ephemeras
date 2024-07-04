import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['@babel/types']
      }
    },
    deps: {
      interopDefault: false
    },
    coverage: {
      provider: 'v8'
    }
  }
})
