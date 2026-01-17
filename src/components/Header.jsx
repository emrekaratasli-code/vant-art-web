import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext'; // Added useAuth
import { useState } from 'react';
import logo from '../assets/VANT.png';
import DropListModal from './DropListModal';


const ShoppingBagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default function Header() {
  const { toggleCart, cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth(); // Get auth state
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  return (
    <>
      <header className="header luxury-bg">
        <div className="container header-container">
          {/* LEFT: Navigation */}
          <nav className="nav-left">
            <ul className="nav-list">
              <li><Link to="/">{language === 'TR' ? 'KOLEKSİYONLAR' : 'COLLECTIONS'}</Link></li>
              <li><Link to="/atelier">{language === 'TR' ? 'ATÖLYE' : 'ATELIER'}</Link></li>
              <li><Link to="/about">{language === 'TR' ? 'HAKKINDA' : 'ABOUT'}</Link></li>
              <li><Link to="/contact">{language === 'TR' ? 'İLETİŞİM' : 'CONTACT'}</Link></li>
            </ul>
          </nav>

          {/* CENTER: Logo */}
          <div className="logo-center">
            <Link to="/" className="logo-link">
              <img src={logo} alt="VANT ART" className="logo-img" />
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="nav-right">

            {/* Drop List CTA */}
            <button
              className="drop-list-cta"
              onClick={() => setIsDropModalOpen(true)}
            >
              DROP LIST
            </button>

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

            {/* ADMIN LINK */}
            {isAuthenticated && useAuth().user?.isAdmin && (
              <Link to="/admin" className="icon-btn-header admin-link" title="Panel">
                PANEL
              </Link>
            )}

            <Link to={isAuthenticated ? "/profile" : "/login"} className="icon-btn-header" aria-label="Profile">
              <UserIcon />
            </Link>

            <button className="cart-btn icon-btn-header" onClick={toggleCart} aria-label="Open Cart">
              <ShoppingBagIcon />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <DropListModal isOpen={isDropModalOpen} onClose={() => setIsDropModalOpen(false)} />

      <style>{`
        .header {
          padding: 0.5rem 0;
          /* background removed to use luxury-bg */
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--color-border);
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
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
          font-size: 0.85rem;
          white-space: nowrap;
          color: var(--color-text);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.3s;
        }
        .nav-left a:hover {
          color: var(--color-accent);
        }
        
        /* Logo */
        .logo-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logo-img {
          height: 60px; /* Reduced specific size for clean look */
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
          gap: 1.5rem;
          justify-content: flex-end;
          align-items: center;
        }
        
        /* Drop List CTA */
        .drop-list-cta {
          background: transparent;
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          padding: 0.5rem 1rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s;
        }
        .drop-list-cta:hover {
          background: var(--color-accent);
          color: var(--color-bg);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
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
        .icon-btn-header {
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          position: relative;
          text-decoration: none;
        }
        .icon-btn-header:hover {
          color: var(--color-accent); /* Darker on hover for visibility */
          transform: scale(1.1);
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
        .admin-link {
            color: #d4af37 !important;
            font-size: 0.7rem; 
            border: 1px solid #d4af37; 
            padding: 4px 6px; 
            border-radius: 4px;
        }

        /* Mobile Adjustments */
        @media (max-width: 1024px) {
           .nav-left { display: none; } /* Hide robust menu on tablet/mobile */
           
           .header-container {
             display: flex; /* Switch to Flex for Mobile simple row */
             justify-content: space-between;
             padding: 0 1rem;
           }
           
           .logo-img { 
             height: 40px; /* Much smaller for mobile header ratio */
           }

           .drop-list-cta {
             display: none; /* Hide on mobile header if space is tight, show elsewhere or keep if possible. User said "Mobile First", so let's keep it but safeguard */
           }
           .nav-right {
             gap: 0.8rem;
           }
           
           .cart-btn {
             display: none; /* Hidden on mobile as Bottom Nav exists */
           }
        }
      `}</style>
    </>
  );
}
