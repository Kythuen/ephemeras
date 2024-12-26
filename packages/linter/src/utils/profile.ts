import { Profile } from '@ephemeras/profile'

export const profile = new Profile({ path: '.ephemeras/linter/preset.json' })
export const configProfile = new Profile({
  path: '.ephemeras/linter/config.json'
})
