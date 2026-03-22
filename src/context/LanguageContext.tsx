import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LangCode, SUPPORTED_LANGUAGES, LanguageOption, t, translations } from '../utils/i18n';

interface LanguageContextType {
  lang: LangCode;
  langOption: LanguageOption;
  setLanguage: (code: LangCode) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  langOption: SUPPORTED_LANGUAGES[0],
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');

  useEffect(() => {
    AsyncStorage.getItem('app_language').then(saved => {
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        setLang(saved as LangCode);
      }
    }).catch(() => {});
  }, []);

  const setLanguage = useCallback((code: LangCode) => {
    setLang(code);
    AsyncStorage.setItem('app_language', code).catch(() => {});
  }, []);

  const langOption = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const translate = useCallback((key: keyof typeof translations['en']) => {
    return t(key, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, langOption, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
