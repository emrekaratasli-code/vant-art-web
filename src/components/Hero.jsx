import logo from '../assets/VANT.png';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

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
        {/* Title removed as requested, using Logo only */}
        <p className="hero-subtitle">{t('heroSubtitle')}</p>
        <div className="hero-actions">
          <a href="#shop" className="hero-cta">{t('heroCta')}</a>
        </div>
      </div>
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
          height: 300px; /* Increased massively */
          margin-bottom: var(--spacing-md);
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          width: auto;
          filter: drop-shadow(0 0 20px rgba(0,0,0,0.8)); /* Strong drop shadow for distinct look */
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-lg);
          font-weight: 300;
          color: #e0e0e0;
          letter-spacing: 0.05em;
          max-width: 600px;
          opacity: 0;
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards; /* Delay */
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .hero-cta {
          display: inline-block;
          padding: 1rem 3rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.8rem;
          transition: all 0.5s ease;
          opacity: 0;
          animation: fadeUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 1s forwards; /* Delay */
        }
        
        .hero-cta:hover {
          background: var(--color-accent);
          color: var(--color-bg);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }

        @media (max-width: 768px) {
          .hero-logo { height: 200px; }
        }
      `}</style>
    </section>
  );
}
