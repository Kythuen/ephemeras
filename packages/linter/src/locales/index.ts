import i18n from 'i18next'
import { configProfile } from '../utils/profile'
import en from './lang/en'
import zh from './lang/zh'

const lang = configProfile.get('language') || 'en'
i18n.init({
  lng: lang,
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  }
})

export const $t = i18n.t
