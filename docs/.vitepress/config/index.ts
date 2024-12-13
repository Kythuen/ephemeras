import { defineConfig } from 'vitepress'
import { DESCRIPTION, GITHUB_URL } from './constant'
import { NAV, SIDEBAR } from './routes/en'
import { transformPageData } from '../transform'

export default defineConfig({
  lang: 'en',
  base: process.env.PLATFORM === 'Vercel' ? '/' : '/ephemeras/',
  srcDir: 'src',
  title: 'Ephemeras',
  description: 'Make development easier and more efficient',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true'
      }
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito:wght@800&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style'
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito:wght@800&family=IBM+Plex+Mono:wght@400&display=swap'
      }
    ]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: DESCRIPTION,
      head: [['meta', { name: 'og:description', content: DESCRIPTION }]],
      themeConfig: {
        logo: '/logo.png',
        siteTitle: '',
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
