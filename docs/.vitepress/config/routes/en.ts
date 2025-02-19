import type { DefaultTheme } from 'vitepress'

export const NAV = [
  // { text: 'Packages', link: '/packages' }
]

const SidebarPackages: DefaultTheme.NavItemWithLink[] = [
  { text: 'File System', link: '/packages/fs' },
  { text: 'Linter', link: '/packages/linter' },
  { text: 'Parser', link: '/packages/parser' },
  { text: 'Profile', link: '/packages/profile' },
  { text: 'Readme', link: '/packages/readme' }
]

/* ------------------------------------ packages/fs ----------------------------------- */
const SidebarFS = [
  { text: 'Guide', link: '/packages/fs' },
  { text: 'Functions', link: '/packages/fs/functions' },
  { text: 'Changelogs', link: '/packages/fs/changelogs' }
]

/* ---------------------------------- packages/linter --------------------------------- */
const SidebarLinter = [
  { text: 'Usage', link: '/packages/linter' },
  { text: 'Changelogs', link: '/packages/linter/changelogs' }
]

/* ---------------------------------- packages/parser --------------------------------- */
const SidebarParser = [
  { text: 'Guide', link: '/packages/parser' },
  { text: 'Plugins', link: '/packages/parser/plugins' },
  { text: 'Types', link: '/packages/parser/types' },
  { text: 'Changelogs', link: '/packages/parser/changelogs' }
]

/* ---------------------------------- packages/profile --------------------------------- */
const SidebarProfile = [
  { text: 'Usage', link: '/packages/profile' },
  { text: 'Changelogs', link: '/packages/profile/changelogs' }
]

/* ---------------------------------- packages/readme --------------------------------- */
const SidebarReadme = [
  { text: 'Usage', link: '/packages/readme' },
  { text: 'Changelogs', link: '/packages/readme/changelogs' }
]

export const SIDEBAR: Record<string, DefaultTheme.SidebarItem[]> = {
  '/packages/fs': [
    { text: 'All', items: SidebarFS },
    { text: 'Packages', items: SidebarPackages }
  ],
  '/packages/linter': [
    { text: 'All', items: SidebarLinter },
    { text: 'Packages', items: SidebarPackages }
  ],
  '/packages/parser': [
    { text: 'All', items: SidebarParser },
    { text: 'Packages', items: SidebarPackages }
  ],
  '/packages/profile': [
    { text: 'All', items: SidebarProfile },
    { text: 'Packages', items: SidebarPackages }
  ],
  '/packages/readme': [
    { text: 'All', items: SidebarReadme },
    { text: 'Packages', items: SidebarPackages }
  ],
  '/': [{ text: 'Packages', items: SidebarPackages }]
}
