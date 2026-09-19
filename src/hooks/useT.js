import { useSelector } from 'react-redux';
import { translations } from '../i18n/translations';

export default function useT() {
  const lang = useSelector((s) =>
    s.auth.user?.onboardingCompleted ? s.auth.user.language : s.onboarding.language
  ) || 'en';

  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
    Object.entries(params).forEach(([k, v]) => { str = str.replaceAll(`{${k}}`, v); });
    return str;
  };

  // Profession / topic ka naam slug se (kind = 'profession' | 'topic')
  const tn = (kind, item) => (item ? translations[lang]?.[`${kind}.${item.slug}`] ?? item.name : '');

  return { t, tn, lang };
}