// src/i18n/index.ts
import { createContext, useContext } from 'react';
import es from './translations.es';
import en from './translations.en';

export type Lang = 'es' | 'en';
export type Translations = typeof es;

const translations: Record<Lang, Translations> = { es, en };

export interface I18nContextType {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nContextType>({
  lang: 'es',
  t: es,
  setLang: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function getTranslation(lang: Lang): Translations {
  return translations[lang];
}
