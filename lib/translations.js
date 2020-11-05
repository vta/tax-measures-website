import en from '../locales/en/common.json'
import es from '../locales/es/common.json'

const translations = {
  en,
  es
}

export const trans = (id, locale) => {
  const defaultLocale = 'en'

  if (translations[locale] && translations[locale][id]) {
    return translations[locale][id]
  }

  if (translations[defaultLocale][id]) {
    return translations[defaultLocale][id]
  }

  return 'Unknown translation'
}
