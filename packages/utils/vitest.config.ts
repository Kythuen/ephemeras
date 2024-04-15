import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['@babel/types']
      }
    }
    // include: [
    //   // 'test/build.test.ts',
    //   // 'test/config.test.ts',
    //   // 'test/fs/common.test.ts',
    //   // 'test/fs/copy.test.ts',
    //   // 'test/fs/create.test.ts',
    //   // 'test/fs/ensure.test.ts',
    //   'test/fs/move.test.ts'
    //   // 'test/fs/remove.test.ts',
    //   // 'test/profile.test.ts',
    //   // 'test/validate.test.ts',
    // ]
  }
})
