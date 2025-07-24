import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'is' ? 'en' : 'is';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors rounded-md hover:bg-zinc-800"
      aria-label="Toggle language"
    >
      <span className={i18n.language === 'is' ? 'text-white' : 'text-zinc-500'}>
        IS
      </span>
      <span className="text-zinc-600">/</span>
      <span className={i18n.language === 'en' ? 'text-white' : 'text-zinc-500'}>
        EN
      </span>
    </button>
  );
}