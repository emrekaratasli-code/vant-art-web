import { useLanguage } from '../context/LanguageContext';

export default function OurStory() {
    const { t } = useLanguage();

    return (
        <div className="story-page container">
            <div className="story-content">
                <h1 className="story-title">VANT ART: Zamansız Bir Mirasın Dijital Galerisi</h1>

                <p className="story-text">
                    VANT ART, mücevheri sadece bir aksesuar olarak değil, bedende taşınan bir sanat eseri olarak tanımlar. Her bir parçamız, geleneksel zanaatkarlığın kusursuzluğu ile modern estetiğin cesur çizgilerinin buluştuğu noktada doğar.
                </p>

                <p className="story-text">
                    Bizim için altın ve değerli taşlar, sadece maden değil; bir hikayenin, bir tutkunun ve nesilden nesile aktarılacak bir mirasın sessiz şahitleridir. VANT ART koleksiyonları, seri üretimin ötesinde, her biri bir ruh taşıyan sınırlı sayıdaki kürasyonlardan oluşur.
                </p>

                <p className="story-highlight">
                    Sadece takmıyorsunuz; bir sanat eserini miras alıyorsunuz.
                </p>

                <div className="signature-block">
                    <span className="founder-name">Emre Karataşlı</span>
                    <span className="founder-title">VANT ART Kurucusu</span>
                </div>
            </div>

            <style>{`
                .story-page {
                    min-height: 80vh;
                    padding-top: 4rem;
                    padding-bottom: 4rem;
                    display: flex;
                    justify-content: center;
                }
                .story-content {
                    max-width: 800px;
                    text-align: center;
                    animation: fadeIn 1s ease-out;
                }
                .story-title {
                    font-size: 2.5rem;
                    color: var(--color-accent);
                    margin-bottom: 3rem;
                    line-height: 1.3;
                }
                .story-text {
                    font-size: 1.1rem;
                    color: var(--color-text-muted);
                    margin-bottom: 2rem;
                    line-height: 1.8;
                }
                .story-highlight {
                    font-size: 1.5rem;
                    color: var(--color-text);
                    font-family: var(--font-heading);
                    font-style: italic;
                    margin: 4rem 0;
                    position: relative;
                    padding: 2rem 0;
                }
                .story-highlight::before, .story-highlight::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50px;
                    height: 1px;
                    background: var(--color-accent);
                }
                .story-highlight::before { top: 0; }
                .story-highlight::after { bottom: 0; }

                .signature-block {
                    margin-top: 4rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }
                .founder-name {
                    font-family: var(--font-heading);
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-size: 1.1rem;
                }
                .founder-title {
                    color: var(--color-text-muted);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .story-title { font-size: 1.8rem; }
                    .story-text { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
}
