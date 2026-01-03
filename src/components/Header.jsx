import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/VANT.png';


const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export default function Header() {
  const { toggleCart, cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="container header-container">
        <nav className="nav-left">
          <ul className="nav-list">
            <li><Link to="/">{t('collection')}</Link></li>
            <li><a href="#rings">{language === 'TR' ? 'YÜZÜKLER' : 'Rings'}</a></li>
            <li><a href="#necklaces">{language === 'TR' ? 'KOLYELER' : 'Necklaces'}</a></li>
            <li><a href="#earrings">{language === 'TR' ? 'KÜPELER' : 'Earrings'}</a></li>
            <li><a href="#bracelets">{language === 'TR' ? 'BİLEKLİKLER' : 'Bracelets'}</a></li>
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
            <CartIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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
        
        .nav-right {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          align-items: center;
        }
        .lang-switch {
          display: flex;
          gap: 0.5rem;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          align-items: center;
        }
        .lang-switch button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-family: var(--font-heading);
          padding: 0;
          transition: color 0.3s;
        }
        .lang-switch button.active, .lang-switch button:hover {
          color: var(--color-accent);
        }
        .cart-btn {
          background: none;
          border: none;
          color: var(--color-accent);
          cursor: pointer;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          transition: color 0.3s;
          display: flex;
          align-items: center;
          position: relative;
        }
        .cart-btn:hover {
          color: #fff;
        }
        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #d4af37;
            color: #000;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
            border: 2px solid #000;
        }

        @media (max-width: 768px) {
          .header-container {
            display: flex;
            justify-content: space-between;
          }
           .nav-left { display: none; }
          .logo-img { 
            height: 126px; /* Increased by 40% */
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
          }
        }
      `}</style>
    </header>
  );
}
