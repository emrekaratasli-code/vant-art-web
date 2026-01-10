import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function useSettings() {
    return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        // Load from local storage
        const saved = localStorage.getItem('vant_settings');
        const parsed = saved ? JSON.parse(saved) : {};

        // Default to active, and force active if requested (ensuring it starts ON)
        return {
            maintenanceMode: false,
            ...parsed,
            showSocialProof: true // Enforce true default or override
        };
    });

    useEffect(() => {
        localStorage.setItem('vant_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}
