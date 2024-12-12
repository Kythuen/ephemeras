import vueJSX from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UnoCSS(), vueJSX()],
  optimizeDeps: {
    exclude: ['vitepress']
  },
  server: {
    host: '0.0.0.0',
    hmr: { overlay: false }
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
