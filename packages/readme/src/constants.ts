import { fileURLToPath, resolve } from 'node:url'
import type { Options } from './types'

export const PROJECT_ROOT = resolve(fileURLToPath(import.meta.url), '..')

export const DEFAULT_OPTIONS: Partial<Options> = {
  logo: 'https://cdn.jsdelivr.net/gh/Kythuen/static/logos/ephemeras/black.png',
  contents: [
    'Introduction',
    'Preview',
    'Features',
    'GettingStarted',
    'Questions',
    'Contribution',
    'License'
  ],
  badges: true,
  social: ['npm', 'github', 'juejin'],
  build: ['github-actions', 'codecov'],
  accounts: true,
  npm: 'white-block',
  github: 'Kythuen',
  juejin: '413072101742743',
  locales: ['en']
}
