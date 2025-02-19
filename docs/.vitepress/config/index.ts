import { defineConfig } from 'vitepress'
import { transformPageData } from './transform/data'
import { DESCRIPTION, GITHUB_URL, TITLE } from './constant'
import { NAV, SIDEBAR } from './routes/en'

export default defineConfig({
  lang: 'en',
  base: process.env.PLATFORM === 'Vercel' ? '/' : '/ephemeras/',
  srcDir: 'src',
  title: TITLE,
  description: 'Make development easier and more efficient',
  cleanUrls: true,
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/ephemeras/favicon.svg' }
    ]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    footer: {
      copyright:
        'Copyright © 2023-present <a href="https://github.com/Kythuen">Kythuen</a>. All rights reserved.'
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: DESCRIPTION,
      head: [['meta', { name: 'og:description', content: DESCRIPTION }]],
      themeConfig: {
        logo: { dark: '/ephemeras_white.svg', light: '/ephemeras.svg' },
        nav: NAV,
        socialLinks: [{ icon: 'github', link: GITHUB_URL }],
        sidebar: SIDEBAR
      }
    }
  },
  vite: {
    configFile: 'vite.config.ts'
  },
  transformPageData
})
