import { useI18n } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="language-toggle" aria-label={t.language.label}>
      <span>{t.language.label}</span>
      <div>
        <button
          className={language === 'ja' ? 'active' : ''}
          onClick={() => setLanguage('ja')}
          type="button"
        >
          {t.language.japanese}
        </button>
        <button
          className={language === 'en' ? 'active' : ''}
          onClick={() => setLanguage('en')}
          type="button"
        >
          {t.language.english}
        </button>
      </div>
    </div>
  );
}
