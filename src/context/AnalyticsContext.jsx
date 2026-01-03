import { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
    const [events, setEvents] = useState(() => {
        try {
            const saved = localStorage.getItem('vant_analytics');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('vant_analytics', JSON.stringify(events));
    }, [events]);

    const trackEvent = (eventName, data = {}) => {
        const newEvent = {
            id: Date.now(),
            event: eventName,
            timestamp: new Date().toISOString(),
            data
        };
        // Keep only last 1000 events to avoid quota issues
        setEvents(prev => [newEvent, ...prev].slice(0, 1000));
        console.log(`[Analytics] ${eventName}`, data);
    };

    const getStats = () => {
        // Simple aggregation
        const productViews = {};
        const cartAdds = {};
        const categoryClicks = {};

        events.forEach(e => {
            if (e.event === 'view_product') {
                const name = e.data.productName;
                if (!productViews[name]) productViews[name] = 0;
                productViews[name]++;
            }
            if (e.event === 'add_to_cart') {
                const name = e.data.productName;
                if (!cartAdds[name]) cartAdds[name] = 0;
                cartAdds[name]++;
            }
            if (e.event === 'category_click') {
                const cat = e.data.category;
                if (!categoryClicks[cat]) categoryClicks[cat] = 0;
                categoryClicks[cat]++;
            }
        });

        return { productViews, cartAdds, categoryClicks, totalEvents: events.length };
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent, getStats, events }}>
            {children}
        </AnalyticsContext.Provider>
    );
};
