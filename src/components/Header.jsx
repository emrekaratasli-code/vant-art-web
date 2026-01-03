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
          height: 70px; /* Reduced visual height slightly to fit thinner bar, but maintained prominence */
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); /* Drop shadow added */
        }
        .logo-img:hover {
          transform: scale(1.05);
        }
        .nav-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.5rem;
        }
        
        .nav-list a {
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          color: var(--color-text);
          font-family: var(--font-heading);
        }
        .nav-list a:hover {
          color: var(--color-accent);
        }

        .lang-switch {
          display: flex;
          gap: 0.5rem;
          color: var(--color-text-muted);
          font-size: 0.7rem; 
          font-weight: 200; /* Extra Thin */
          letter-spacing: 0.05em;
          font-family: var(--font-body);
        }
        .lang-switch button {
          color: var(--color-text-muted);
          transition: color 0.3s;
          font-weight: 300;
        }
        .lang-switch button.active {
          color: var(--color-accent);
          font-weight: 400;
        }
        .lang-switch button:hover {
          color: var(--color-text);
        }
        
        .cart-btn {
          font-size: 0.75rem; /* Smaller */
          color: var(--color-accent);
          font-weight: 300; /* Thinner */
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 1px solid rgba(212, 175, 55, 0.5); /* Thinner border look */
          padding: 0.3rem 1rem;
          transition: all 0.3s ease;
        }
        .cart-btn:hover {
          background: var(--color-accent);
          color: var(--color-bg);
          border-color: var(--color-accent);
        }
        
        @media (max-width: 768px) {
          .header-container {
            grid-template-columns: 1fr auto;
            grid-template-areas: 
              "logo cart"
              "nav nav";
            gap: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .logo-center { grid-area: logo; justify-content: flex-start; }
          .nav-right { grid-area: cart; }
          .nav-left { 
            grid-area: nav; 
            justify-content: flex-start; /* Start for scroll */
            display: block; /* Block for overflow container */
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 5px; /* Space for scrollbar if any */
          }
          .nav-list {
            display: flex;
            gap: 1.5rem;
            white-space: nowrap;
            padding: 0 0.5rem; /* Padding for start/end */
          }
          /* Hide Scrollbar */
          .nav-left::-webkit-scrollbar { display: none; }
          .nav-left { -ms-overflow-style: none; scrollbar-width: none; }

          .logo-img { 
            height: 90px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
          }
        }
      `}</style>
    </header>
  );
}
