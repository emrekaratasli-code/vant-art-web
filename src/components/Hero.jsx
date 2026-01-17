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
      headline: "Studio-made jewelry. Limited by design.",
      subhead: "Atölyemizden çıkan, az sayıda üretilmiş özel parçalar. Erken erişim için Drop List'e katılın.",
      ctaPrimary: "Drop List'e Katıl",
      ctaSecondary: "Atölyeyi Keşfet"
    },
    EN: {
      headline: "Studio-made jewelry. Limited by design.",
      subhead: "Small-batch pieces crafted in our atelier—get early access via the Drop List.",
      ctaPrimary: "Join the Drop List",
      ctaSecondary: "Inside the Atelier"
    }
  };

  const t = content[language] || content['EN'];

  return (
    <section className="hero">
      <div className="hero-content">
        <img
          src={logo}
          alt="VANT ART"
          className="hero-logo"
          fetchPriority="high"
          loading="eager"
        />
        <h1 className="hero-headline">{t.headline}</h1>
        <p className="hero-subtitle">{t.subhead}</p>
        <div className="hero-actions">
          <button onClick={() => setIsDropModalOpen(true)} className="hero-cta primary">
            {t.ctaPrimary}
          </button>
          <Link to="/atelier" className="hero-cta secondary">
            {t.ctaSecondary}
          </Link>
        </div>
      </div>

      <DropListModal isOpen={isDropModalOpen} onClose={() => setIsDropModalOpen(false)} />

      <style>{`
        .hero {
          height: 90vh;
          background-image: url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop');
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
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 var(--spacing-sm);
        }
        
        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hero-logo {
          height: 180px; 
          margin-bottom: var(--spacing-md);
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          width: auto;
          filter: drop-shadow(0 0 20px rgba(0,0,0,0.8));
        }

        .hero-headline {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #fff;
          opacity: 0;
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-lg);
          font-weight: 300;
          color: #e0e0e0;
          letter-spacing: 0.05em;
          max-width: 600px;
          opacity: 0;
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          opacity: 0;
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 1s forwards;
        }
        
        .hero-cta {
          display: inline-block;
          padding: 1rem 2rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.8rem;
          transition: all 0.5s ease;
          text-decoration: none;
          border: 1px solid var(--color-accent);
          cursor: pointer;
        }
        
        .hero-cta.primary {
           background: rgba(212, 175, 55, 0.1);
           color: var(--color-accent);
        }
        .hero-cta.primary:hover {
          background: var(--color-accent);
          color: var(--color-bg);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }

        .hero-cta.secondary {
          background: transparent;
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }
        .hero-cta.secondary:hover {
           border-color: #fff;
           background: rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
          .hero-logo { height: 120px; }
          .hero-headline { font-size: 1.8rem; }
          .hero-subtitle { font-size: 0.95rem; }
          .hero-actions { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}
