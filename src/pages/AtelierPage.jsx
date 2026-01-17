import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import logo from '../assets/VANT.png';

export default function AtelierPage() {
    const { language } = useLanguage();

    const content = {
        TR: {
            title: "ATÖLYE",
            subtitle: "Sanat ve zanaatın buluştuğu yer.",
            videoAlt: "Atölye üretim süreci",
            blocks: [
                { title: "MATERYAL", text: "Sadece en saf 925 ayar gümüş ve etik kaynaklı doğal taşlar kullanılır." },
                { title: "SÜREÇ", text: "Her parça, mum modellemeden son cilaya kadar elde şekillendirilir." },
                { title: "KALİTE", text: "Kusursuz işçilik ve detaylara gösterilen özen, VANT imzasını taşır." }
            ],
            cta: "KOLEKSİYONU KEŞFET"
        },
        EN: {
            title: "THE ATELIER",
            subtitle: "Where art meets craftsmanship.",
            videoAlt: "Atelier production process",
            blocks: [
                { title: "MATERIALS", text: "Only the purest 925 sterling silver and ethically sourced natural stones." },
                { title: "PROCESS", text: "Every piece is hand-sculpted from wax modeling to the final polish." },
                { title: "QUALITY", text: "Impeccable craftsmanship and attention to detail define the VANT signature." }
            ],
            cta: "DISCOVER COLLECTION"
        }
    };

    const t = content[language] || content['EN'];

    return (
        <div className="atelier-page">
            <div className="container">
                <div className="atelier-header">
                    <img src={logo} alt="VANT" className="atelier-logo" />
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                {/* Video / Visual Slot */}
                <div className="atelier-visual">
                    <div className="visual-placeholder">
                        <span>VIDEO / PROCESS SEQUENCE</span>
                        {/* 
                TODO: Replace with actual video tag when asset is ready.
                <video src="..." autoPlay loop muted playsInline />
            */}
                    </div>
                </div>

                {/* 3 Blocks */}
                <div className="atelier-blocks">
                    {t.blocks.map((block, idx) => (
                        <div key={idx} className="atelier-block">
                            <h3>{block.title}</h3>
                            <p>{block.text}</p>
                        </div>
                    ))}
                </div>

                <div className="atelier-action">
                    <Link to="/" className="cta-btn">{t.cta}</Link>
                </div>
            </div>
            <style>{`
        .atelier-page {
          padding: 4rem 1rem;
          background: #050505; /* Slightly darker than main bg for mood */
          color: var(--color-text);
          min-height: 80vh;
        }
        .atelier-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .atelier-logo {
          height: 40px;
          margin-bottom: 1rem;
          opacity: 0.8;
        }
        .atelier-header h1 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-accent);
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }
        .atelier-header p {
          color: var(--color-text-muted);
          font-size: 1.1rem;
          font-family: var(--font-heading); /* Serif for elegance */
          font-style: italic;
        }

        .atelier-visual {
          width: 100%;
          max-width: 800px;
          margin: 0 auto 5rem;
          aspect-ratio: 16/9;
          background: #111;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .visual-placeholder {
          color: var(--color-text-muted);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          border: 1px dashed #333;
          padding: 2rem;
        }

        .atelier-blocks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto 5rem;
          text-align: center;
        }
        .atelier-block h3 {
          color: var(--color-accent);
          font-size: 1rem;
          margin-bottom: 1rem;
          letter-spacing: 0.15em;
        }
        .atelier-block p {
          color: var(--color-text-muted);
          line-height: 1.6;
          font-size: 0.95rem;
          max-width: 300px;
          margin: 0 auto;
        }

        .atelier-action {
          text-align: center;
          padding-bottom: 3rem;
        }
        .cta-btn {
          display: inline-block;
          padding: 1rem 3rem;
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.8rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        .cta-btn:hover {
          background: var(--color-accent);
          color: var(--color-bg);
        }
      `}</style>
        </div>
    );
}
