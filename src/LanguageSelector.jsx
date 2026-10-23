import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLanguages } from './i18n';

// Each language shows its own name ("हिन्दी", "Español") so users can find theirs.
const nativeName = code => { try { return new Intl.DisplayNames([code], { type: 'language' }).of(code); } catch { return code; } };

export default function LanguageSelector() {
	const { t, i18n } = useTranslation();
	const [languages, setLanguages] = useState(['en']);
	useEffect(() => { fetchLanguages().then(setLanguages); }, []);
	return <label className="language-selector">
		<i className="fa fa-globe" aria-hidden="true" />
		<span className="sr-only">{t('language.label')}</span>
		<select aria-label={t('language.label')} value={i18n.resolvedLanguage} onChange={e => i18n.changeLanguage(e.target.value)}>
			{languages.map(code => <option key={code} value={code}>{nativeName(code)}</option>)}
		</select>
	</label>;
}
