export type ContentItem =
  | 'Introduction'
  | 'Preview'
  | 'Features'
  | 'GettingStarted'
  | 'LiveDemo'
  | 'Questions'
  | 'Contribution'
  | 'License'

export type SocialBadgeItem = 'npm' | 'juejin' | 'github'
export type BuildBadgeItem = 'codecov' | 'github-actions'
export type LocaleItem = 'en' | 'zh'

export type Options = {
  name: string
  description: string
  logo: string
  contents: ContentItem[]
  addBadges: boolean
  badges: boolean
  social?: SocialBadgeItem[]
  build?: BuildBadgeItem[]
  accounts: boolean
  npm?: string
  juejin?: string
  github?: string
  locales: LocaleItem[]
}
