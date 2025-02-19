import vueJSX from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
    vueJSX(),
    groupIconVitePlugin(),
    Components({
      dirs: ['../.vitepress/theme/components/global'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['vue']
    })
  ],
  server: {
    host: '0.0.0.0',
    hmr: { overlay: false }
  },
  ssr: {
    noExternal: ['@white-block/vitepress']
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false,
    sourcemap: false
  }
})
