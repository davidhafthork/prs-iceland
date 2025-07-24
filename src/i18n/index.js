import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import is from './locales/is.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      is: { translation: is },
      en: { translation: en }
    },
    fallbackLng: 'is',
    debug: false,
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true
    },
    
    // Always default to Icelandic unless explicitly set
    lng: localStorage.getItem('i18nextLng') || 'is'
  });

export default i18n;