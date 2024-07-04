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
    ]
  }
})
