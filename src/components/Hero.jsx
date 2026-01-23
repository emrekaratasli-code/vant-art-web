import { useState } from 'react';
import logo from '../assets/VANT.png';
import { useLanguage } from '../context/LanguageContext';
import DropListModal from './DropListModal';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { language } = useLanguage();
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  const content = {
    TR: {
      headline: "WEARABLE ART",
      subhead: "Çağdaş kültür. Atölye işçiliği. Sınırlı üretim.",
      manifesto: "VANT bir takı markası değildir. Sanat, kimlik ve zanaat kesişiminde var olan parçalar yaratıyoruz.",
      ctaPrimary: "Evrene Gir",
      ctaSecondary: "Son Koleksiyon"
    },
    EN: {
      headline: "WEARABLE ART",
      subhead: "Contemporary culture. Studio craft. Limited release.",
      manifesto: "VANT is not a jewelry brand. We create pieces that exist at the intersection of art, identity, and craftsmanship.",
      ctaPrimary: "Enter the Universe",
      ctaSecondary: "Latest Collection"
    }
  };

  const t = content[language] || content['EN'];

  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-content">
        <img
          src={logo}
          alt="VANT"
          className="hero-logo"
          fetchPriority="high"
          loading="eager"
        />

        <h1 className="hero-headline">{t.headline}</h1>
        <p className="hero-subtitle">{t.subhead}</p>
        <p className="hero-manifesto">{t.manifesto}</p>

        <div className="hero-actions">
          <button onClick={() => setIsDropModalOpen(true)} className="hero-cta primary">
            {t.ctaPrimary}
          </button>
          <Link to="/?category=all" className="hero-cta secondary">
            {t.ctaSecondary}
          </Link>
        </div>

        {/* Dual Image Showcase: Jewelry + Apparel */}
        <div className="hero-showcase">
          <div className="showcase-item">
            <img
              src="https://images.unsplash.com/photo-1599643477877-5313557d87bc?q=80&w=600&auto=format&fit=crop"
              alt="Jewelry Detail"
              loading="lazy"
            />
            <span className="showcase-label">Jewelry</span>
          </div>
          <div className="showcase-item">
            <img
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop"
              alt="Wearable Art"
              loading="lazy"
            />
            <span className="showcase-label">Wearable Art</span>
          </div>
        </div>
      </div>

      <DropListModal isOpen={isDropModalOpen} onClose={() => setIsDropModalOpen(false)} />

      <style>{`
        .hero {
          min-height: 95vh;
          background: 
            linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)),
            url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .hero-overlay {
 position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, 
            rgba(0,0,0,0.2) 0%, 
            rgba(0,0,0,0.8) 100%);
          z-index: 0;
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 var(--spacing-sm);
          max-width: 900px;
        }
        
        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hero-logo {
          height: 140px;
          margin-bottom: var(--spacing-md);
          animation: fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          width: auto;
          filter: drop-shadow(0 0 20px rgba(0,0,0,0.8));
        }

        .hero-headline {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 7vw, 5rem);
          margin-bottom: 1rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: #fff;
          opacity: 0;
          animation: fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
        }
        
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          margin-bottom: 1.5rem;
          font-weight: 300;
          color: #e0e0e0;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards;
        }
        
        .hero-manifesto {
          font-family: var(--font-script);
          font-size: clamp(1.1rem, 2.2vw, 1.5rem);
          font-style: italic;
          line-height: 1.8;
          max-width: 650px;
          margin-bottom: var(--spacing-lg);
          color: #d0d0d0;
          opacity: 0;
          animation: fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: var(--spacing-xl);
          opacity: 0;
          animation: fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s forwards;
        }
        
        .hero-cta {
          display: inline-block;
          padding: 1rem 2.5rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          border: 1px solid var(--color-accent);
          cursor: pointer;
        }
        
        .hero-cta.primary {
           background: var(--color-accent);
           color: #000;
           border-color: var(--color-accent);
        }
        .hero-cta.primary:hover {
          background: var(--color-accent-hover);
          border-color: var(--color-accent-hover);
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.5);
          transform: translateY(-2px);
        }

        .hero-cta.secondary {
          background: transparent;
          color: #fff;
          border-color: rgba(255,255,255,0.4);
        }
        .hero-cta.secondary:hover {
           border-color: #fff;
           background: rgba(255,255,255,0.1);
        }
        
        /* Dual Showcase */
        .hero-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 700px;
          width: 100%;
          opacity: 0;
          animation: fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 1s forwards;
        }
        
        .showcase-item {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-sm);
          aspect-ratio: 4/5;
        }
        
        .showcase-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .showcase-item:hover img {
          transform: scale(1.08);
        }
        
        .showcase-label {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          padding: 0.5rem 1.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .hero {
            min-height: 90vh;
          }
          .hero-logo { height: 100px; }
          .hero-headline { font-size: 2rem; }
          .hero-subtitle { font-size: 0.9rem; }
          .hero-manifesto { font-size: 1rem; margin-bottom: var(--spacing-md); }
          .hero-actions { 
            flex-direction: column; 
            width: 100%;
            max-width: 300px;
          }
          .hero-cta {
            width: 100%;
          }
          .hero-showcase {
            grid-template-columns: 1fr;
            gap: 1rem;
            max-width: 350px;
          }
        }
      `}</style>
    </section>
  );
}
