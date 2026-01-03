import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/VANT.png';


export default function Header() {
  const { toggleCart, cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="container header-container">
        <nav className="nav-left">
          <ul className="nav-list">
            <li><Link to="/">{t('collection')}</Link></li>
            <li><a href="#rings">{language === 'TR' ? 'Yüzükler' : 'Rings'}</a></li>
            <li><a href="#necklaces">{language === 'TR' ? 'Kolyeler' : 'Necklaces'}</a></li>
            <li><a href="#earrings">{language === 'TR' ? 'Küpeler' : 'Earrings'}</a></li>
            <li><a href="#bracelets">{language === 'TR' ? 'Bileklikler' : 'Bracelets'}</a></li>
          </ul>
        </nav>

        <div className="logo-center">
          <Link to="/" className="logo-link">
            <img src={logo} alt="VANT ART" className="logo-img" />
          </Link>
        </div>

        <div className="nav-right">
          <div className="lang-switch">
            <button
              className={language === 'TR' ? 'active' : ''}
              onClick={() => toggleLanguage('TR')}
            >TR</button>
            <span className="separator">|</span>
            <button
              className={language === 'EN' ? 'active' : ''}
              onClick={() => toggleLanguage('EN')}
            >EN</button>
          </div>
          <button className="cart-btn" onClick={toggleCart} aria-label="Open Cart">
            {t('cart')} ({cartCount})
          </button>
        </div>
      </div>
      <style>{`
        .header {
          padding: 0.5rem 0; /* Reduced padding for slimmer look */
          background: rgba(18, 18, 18, 0.98);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-border);
        }
        .header-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: auto;
        }
        .nav-left .nav-list {
          display: flex;
          gap: var(--spacing-md);
        }
        .logo-center {
          display: flex;
          justify-content: center;
        }
          .logo-img {
          height: 100px; /* Increased by 40% */
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); /* Drop shadow added */
        }
        .logo-img:hover {
          transform: scale(1.05);
        }
        
        /* ... */

        @media (max-width: 768px) {
           /* ... */
          .logo-img { 
            height: 126px; /* Increased by 40% */
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
          }
        }
      `}</style>
    </header>
  );
}
