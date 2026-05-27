import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { AnalysisStatus, Classification } from '../types';
import { Language, translations } from './translations';

const LANGUAGE_STORAGE_KEY = 'dn-ipm-language';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)['ja'];
  weekLabel: (weekOffset: number) => string;
  riskLabel: (grade?: Classification) => string;
  riskState: (grade: Classification) => string;
  riskPolicy: (grade: Classification) => string;
  statusLabel: (status?: AnalysisStatus | string) => string;
  treatmentNote: (note?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const normalizeLanguage = (value: string | null): Language => (value === 'en' ? 'en' : 'ja');

const readInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ja';
  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
};

const isAnalyzedText = (status?: string) =>
  Boolean(status && (status.includes('解析済') || status.toLowerCase().includes('analyzed')));

const isAnalyzingText = (status?: string) =>
  Boolean(status && (status.includes('解析中') || status.toLowerCase().includes('analyzing')));

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);
  const t = translations[language];

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      weekLabel: (weekOffset: number) =>
        t.weeks[String(weekOffset) as keyof typeof t.weeks] ?? String(weekOffset),
      riskLabel: (grade?: Classification) => (grade ? t.risk[grade].label : '-'),
      riskState: (grade: Classification) => t.risk[grade].state,
      riskPolicy: (grade: Classification) => t.risk[grade].policy,
      statusLabel: (status?: AnalysisStatus | string) => {
        if (isAnalyzedText(status)) return t.common.analyzed;
        if (isAnalyzingText(status)) return t.common.analyzing;
        return t.common.unanalyzed;
      },
      treatmentNote: (note?: string) => {
        if (!note) return '-';
        if (note.includes('周辺')) return t.treatments.surrounding;
        if (note.includes('予防')) return t.treatments.preventive;
        return t.treatments.local;
      },
    }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useI18n must be used within LanguageProvider');
  }
  return value;
}
