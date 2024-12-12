import type { DefaultTheme } from 'vitepress'

const SidebarGuides: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide' },
  { text: 'Overview', link: '/guide/overview' },
  { text: 'Colors', link: '/guide/colors' }
]

const SidebarPackages: DefaultTheme.NavItemWithLink[] = [
  { text: 'Linter', link: '/linter/' },
  { text: 'Compiler', link: '/compiler/' },
  { text: 'File', link: '/file/' },
  { text: 'File System', link: '/fs/' },
  { text: 'Profile', link: '/profile/' },
  { text: 'Utils', link: '/utils/' }
]

const SidebarFS = [
  { text: 'Getting Started', link: '/fs/guide' },
  { text: 'Functions', link: '/fs/functions' }
]

const SidebarTP = [
  { text: 'Getting Started', link: '/parser/guide' },
  { text: 'Plugins', link: '/parser/plugins' },
  { text: 'Types', link: '/parser/types' }
]

export const SIDEBAR: Record<string, DefaultTheme.SidebarItem[]> = {
  '/guide': [{ text: 'Packages', items: SidebarGuides }],
  '/packages/': [{ text: 'Packages', items: SidebarPackages }],
  '/fs/': [
    { text: 'Guides', items: SidebarFS },
    { text: 'Packages', items: SidebarPackages }
  ],
  '/parser/': [
    { text: 'Guides', items: SidebarTP },
    { text: 'Packages', items: SidebarPackages }
  ]
}

export const NAV = [
  { text: 'Guide', link: '/guide' },
  { text: 'Packages', link: '/packages' }
]
