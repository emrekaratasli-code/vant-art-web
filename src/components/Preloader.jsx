import { useEffect, useState } from 'react';
import logo from '../assets/VANT.png';

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Minimum load time for effect
        const timer = setTimeout(() => {
            setFade(true);
            setTimeout(() => setLoading(false), 800); // Wait for fade out
        }, 2000); // 2 seconds display

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className={`preloader ${fade ? 'fade-out' : ''}`}>
            <div className="preloader-content">
                <img src={logo} alt="VANT ART" className="preloader-logo" />
                <div className="progress-line"></div>
            </div>
            <style>{`
                .preloader {
                    position: fixed;
                    inset: 0;
                    background: #000;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.8s ease;
                }
                .preloader.fade-out {
                    opacity: 0;
                    pointer-events: none;
                }
                .preloader-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }
                .preloader-logo {
                    width: 150px;
                    filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4));
                    animation: pulseLogo 2s infinite ease-in-out;
                }
                .progress-line {
                    width: 0;
                    height: 2px;
                    background: var(--color-accent);
                    animation: expandLine 2s ease-out forwards;
                }
                
                @keyframes pulseLogo {
                    0% { opacity: 0.6; transform: scale(0.95); }
                    50% { opacity: 1; transform: scale(1.05); }
                    100% { opacity: 0.6; transform: scale(0.95); }
                }
                @keyframes expandLine {
                    0% { width: 0; opacity: 0; }
                    50% { opacity: 1; }
                    100% { width: 200px; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
