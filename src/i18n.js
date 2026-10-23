import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations come from the DB via TranslationApi (seeded from src/locales/*.json).
// Dev: Vite proxies /controllers to the API. Elsewhere: set VITE_API_URL to the API origin.
const API = `${import.meta.env.VITE_API_URL ?? ''}/controllers/TranslationHandler.ashx`;

export const fetchLanguages = () => fetch(`${API}?action=languages`)
	.then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
	.catch(err => { console.warn('TranslationApi unreachable (is `dotnet run --project backend/TranslationApi` running?):', err); return ['en']; });

// Minimal i18next backend: one GET per language, fetched on first use. A missing language falls back to English.
const dbBackend = {
	type: 'backend',
	read(lng, _ns, callback) {
		fetch(`${API}?action=get&lang=${encodeURIComponent(lng)}`)
			.then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
			.then(data => callback(null, data), err => callback(err, false));
	}
};

const PREF_KEY = 'volza-language';
let saved = null;
try { saved = localStorage.getItem(PREF_KEY); } catch { /* storage may be blocked */ }

i18n.on('languageChanged', lng => {
	document.documentElement.lang = lng;
	document.documentElement.dir = i18n.dir(lng);
	try { localStorage.setItem(PREF_KEY, lng); } catch { /* storage may be blocked */ }
});

// Same options as the main app (frontend/feature/multilingual-app): flat keys, English fallback.
export const i18nReady = i18n.use(dbBackend).use(initReactI18next).init({
	lng: saved || 'en',
	fallbackLng: 'en',
	keySeparator: false,
	interpolation: { escapeValue: false },
	react: { useSuspense: false }
});

export default i18n;
