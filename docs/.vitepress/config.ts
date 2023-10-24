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
        items: [
          { text: '快速开始', link: '/utils/index' },
          { text: '参数校验', link: '/utils/features/validate' },
          { text: '构建工具', link: '/utils/features/build' },
          { text: '配置文件', link: '/utils/features/profile' },
          { text: '项目配置', link: '/utils/features/config' }
        ]
      },
      {
        text: 'Linter',
        items: [{ text: '快速开始', link: '/linter/index' }]
      }
    ],
    outline: {
      level: 'deep',
      label: '页面大纲'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kythuen/ephemeras' }
    ]
  }
})
