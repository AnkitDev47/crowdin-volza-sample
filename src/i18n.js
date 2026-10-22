import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Every <code>.json Crowdin downloads into src/locales/ becomes a selectable language — no code change needed.
const files = import.meta.glob('./locales/*.json', { eager: true, import: 'default' });
const resources = Object.fromEntries(Object.entries(files).map(([path, translation]) => [path.match(/([\w-]+)\.json$/)[1], { translation }]));
export const languages = Object.keys(resources);

const PREF_KEY = 'volza-language';
let saved = null;
try { saved = localStorage.getItem(PREF_KEY); } catch { /* storage may be blocked */ }

i18n.on('languageChanged', lng => {
	document.documentElement.lang = lng;
	document.documentElement.dir = i18n.dir(lng);
	try { localStorage.setItem(PREF_KEY, lng); } catch { /* storage may be blocked */ }
});

// Same options as the main app (frontend/feature/multilingual-app): flat keys, English fallback.
i18n.use(initReactI18next).init({
	resources,
	lng: languages.includes(saved) ? saved : 'en',
	fallbackLng: 'en',
	keySeparator: false,
	interpolation: { escapeValue: false },
	react: { useSuspense: false }
});

export default i18n;
