import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

export const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof zhCN;

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
