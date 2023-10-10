import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.PLATFORM === 'Vercel' ? '/' : '/ephemeras/',
  srcDir: 'contents',
  title: 'Ephemeras',
  description: 'Make development easier and more efficient',
  themeConfig: {
    siteTitle: '',
    logo: { light: '/ephemeras.svg', dark: '/ephemeras_white.svg' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Utils', link: '/utils/index' },
      { text: 'Linter', link: '/linter/index' }
    ],
    sidebar: [
      {
        text: 'Utils',
        items: [{ text: 'Getting Started', link: '/utils/index' }]
      },
      {
        text: 'Linter',
        items: [{ text: 'Getting Started', link: '/linter/index' }]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kythuen/ephemeras' }
    ]
  }
})
