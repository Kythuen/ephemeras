import i18next from 'i18next'
import en from './lang/en-US'
import zh from './lang/zh-CN'

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  }
})

export const $t = i18next.t
export const { changeLanguage } = i18next
