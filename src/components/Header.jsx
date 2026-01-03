import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/VANT.png';


const ShoppingBagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
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
            <ShoppingBagIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
      <style>{`
        .header {
          padding: 0.5rem 0;
          background: rgba(18, 18, 18, 0.98);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-border);
        }
        .header-container {
          display: grid;
          /* PC Layout: 1fr - auto - 1fr ensures center is centered, sides take space */
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: auto;
          min-height: 80px;
        }
        
        /* Navigation Links */
        .nav-left .nav-list {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap; /* Safety wrap if too many items */
        }
        .nav-left a {
          font-size: 0.9rem;
          white-space: nowrap;
          color: var(--color-text);
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        
        /* Logo */
        .logo-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logo-img {
          height: 80px; /* Reduced specific size for clean look */
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
        }
        .logo-img:hover {
          transform: scale(1.05);
        }
        
        /* Right Side Actions */
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
          font-weight: bold;
        }
        .cart-btn {
          background: none;
          border: none;
          color: var(--color-accent);
          cursor: pointer;
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

        /* Mobile Adjustments */
        @media (max-width: 900px) {
           .nav-left { display: none; } /* Hide robust menu on tablet/mobile */
           
           .header-container {
             display: flex; /* Switch to Flex for Mobile simple row */
             justify-content: space-between;
             padding: 0 1rem;
           }
           
           .logo-img { 
             height: 60px; /* Much smaller for mobile header ratio */
           }
        }
      `}</style>
    </header>
  );
}
