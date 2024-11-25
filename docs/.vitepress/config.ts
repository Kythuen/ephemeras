import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en',
  base: process.env.PLATFORM === 'Vercel' ? '/' : '/ephemeras/',
  srcDir: 'src',
  title: 'Ephemeras',
  description: 'Make development easier and more efficient',
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
    siteTitle: '',
    logo: { light: '/ephemeras.svg', dark: '/ephemeras_white.svg' },
    nav: [
      { text: 'Guide', link: '/guide/' },
      {
        text: 'Packages',
        items: [
          { text: 'Linter', link: '/linter/' },
          { text: 'Compiler', link: '/compiler/' },
          { text: 'File', link: '/file/' },
          { text: 'File System', link: '/fs/' },
          { text: 'Profile', link: '/profile/' },
          { text: 'Utils', link: '/utils/' }
        ]
      }
    ],
    sidebar: [
      { text: 'Linter', link: '/linter/' },
      { text: 'Compiler', link: '/compiler/' },
      { text: 'File', link: '/file/' },
      { text: 'File System', link: '/fs/' },
      { text: 'Profile', link: '/profile/' },
      { text: 'Utils', link: '/utils/' }
    ],
    // sidebar: {
    //   '/guide/': SidebarGuide,
    //   '/integrations/': SidebarGuide,

    //   '/tools/': SidebarPresets,
    //   '/presets/': SidebarPresets,
    //   '/transformers/': SidebarPresets,
    //   '/extractors/': SidebarPresets,

    //   '/config/': SidebarConfig
    // },
    outline: {
      level: 'deep',
      label: '页面大纲'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kythuen/ephemeras' }
    ],
    search: {
      provider: 'local'
    }
  },
  vite: {
    configFile: 'vite.config.ts'
  }
})
