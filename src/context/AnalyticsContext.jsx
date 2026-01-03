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
        // Simple aggregation for real events
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

        // Smart Platform Mock Data for "Live" Feel
        const activityData = [
            { time: '09:00', visitors: 120, sales: 5 },
            { time: '12:00', visitors: 350, sales: 25 },
            { time: '15:00', visitors: 450, sales: 42 },
            { time: '18:00', visitors: 620, sales: 68 },
            { time: '21:00', visitors: 210, sales: 15 },
        ];

        const recentActivity = [
            { user: 'Ahmet Y.', action: 'Sepete Ekleme', detail: 'Zultanit Yüzük', time: '2 dk önce' },
            { user: 'Selin K.', action: 'Sipariş', detail: '₺5.400', time: '5 dk önce' },
            { user: 'Misafir', action: 'Ürün İnceleme', detail: 'Safir Kolye', time: '12 dk önce' },
            { user: 'Mehmet A.', action: 'Kayıt Ol', detail: 'Yeni Üye', time: '25 dk önce' },
        ];

        const abandonedCarts = [
            { id: 101, user: 'cansu@mail.com', total: 12500, time: '1 saat önce', items: ['Zümrüt Yüzük', 'Altın Zincir'] },
            { id: 102, user: 'Misafir (IP: 88.2.)', total: 4500, time: '3 saat önce', items: ['Gümüş Bileklik'] },
        ];

        return {
            productViews,
            cartAdds,
            categoryClicks,
            totalEvents: events.length,
            activityData,
            recentActivity,
            abandonedCarts
        };
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent, getStats, events }}>
            {children}
        </AnalyticsContext.Provider>
    );
};
