import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const consented = localStorage.getItem('vant_cookie_consent');
        if (!consented) {
            setTimeout(() => setVisible(true), 2000);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('vant_cookie_consent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-content">
                <p>
                    VANT ART deneyiminizi kişiselleştirmek ve "sanat eseri" niteliğindeki hizmetimizi sunmak için çerezleri kullanıyoruz.
                </p>
                <button onClick={accept} className="accept-btn">KABUL ET</button>
            </div>
            <style>{`
                .cookie-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: rgba(18, 18, 18, 0.95);
                    border-top: 1px solid var(--color-accent);
                    padding: 1.5rem 1rem;
                    z-index: 999;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
                    animation: slideUp 0.5s ease-out;
                }
                .cookie-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    text-align: center;
                }
                @media(min-width: 768px) {
                    .cookie-content {
                        flex-direction: row;
                        justify-content: space-between;
                        text-align: left;
                    }
                }
                .cookie-content p {
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                    font-family: var(--font-body);
                    line-height: 1.5;
                    max-width: 800px;
                }
                .accept-btn {
                    background: var(--color-accent);
                    color: #000;
                    padding: 0.5rem 2rem;
                    border-radius: var(--radius-sm);
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    white-space: nowrap;
                }
                .accept-btn:hover {
                    background: #fff;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
