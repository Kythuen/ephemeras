import { Profile } from '@ephemeras/profile'
import i18n from 'i18next'
import en from './lang/en-US'
import zh from './lang/zh-CN'

const configProfile = new Profile({ path: '.ephemeras/linter/config.json' })
const lang = configProfile.get('language') || 'en'

i18n.init({
  lng: lang,
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  }
})

export const $t = i18n.t
