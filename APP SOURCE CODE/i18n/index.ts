// i18n configuration — TRD §22
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  // Placeholder languages — architecture ready per PRD §20
  bn: { translation: en }, // Bengali — falls back to English
  ta: { translation: en }, // Tamil
  te: { translation: en }, // Telugu
  kn: { translation: en }, // Kannada
  gu: { translation: en }, // Gujarati
  pa: { translation: en }, // Punjabi
  ml: { translation: en }, // Malayalam
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
