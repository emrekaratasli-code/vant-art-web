import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

// WebView-safe hook: Returns fallback if context not available
export const useLanguage = () => {
    const context = useContext(LanguageContext);

    // If context is undefined (WebView timing issues), return safe fallback
    if (!context) {
        console.warn('⚠️ LanguageContext not available, using fallback');
        return {
            language: 'EN',
            toggleLanguage: () => { },
            t: (key) => key,
            formatPrice: (amount) => `$${amount}`
        };
    }

    return context;
};

import { translations, RATES } from '../data/translations';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('TR');

    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    const formatPrice = (amount) => {
        const config = RATES[language];
        const value = amount * config.rate;
        // Format accordingly
        return language === 'TR'
            ? `${config.symbol}${value.toLocaleString('tr-TR')}`
            : `${config.symbol}${value.toLocaleString('en-US')}`;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, formatPrice }}>
            {children}
        </LanguageContext.Provider>
    );
};
