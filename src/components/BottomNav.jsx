import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Icons using inline SVG for zero-dependency but high-quality rendering
const VLogo = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 22L1 2H5.5L12 14.5L18.5 2H23L12 22Z"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
        />
    </svg>
);

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

export default function BottomNav() {
    const { cartCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bottom-nav">
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                <div className="icon-container">
                    <VLogo active={isActive('/')} />
                    {isActive('/') && <div className="active-line" />}
                </div>
            </Link>

            <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''}`}>
                <div className="icon-container">
                    <div className="icon-wrapper">
                        <ShoppingBagIcon />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </div>
                    {isActive('/cart') && <div className="active-line" />}
                </div>
            </Link>

            <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                <div className="icon-container">
                    <UserIcon />
                    {isActive('/profile') && <div className="active-line" />}
                </div>
            </Link>

            <style>{`
                .bottom-nav {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 60px; /* Compact */
                    background: rgba(10, 10, 10, 0.9);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 0 1rem;
                    padding-bottom: env(safe-area-inset-bottom);
                    z-index: 1000;
                    justify-content: space-around;
                    align-items: center;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
                }

                @media (max-width: 768px) {
                    .bottom-nav {
                        display: flex;
                    }
                    body {
                        padding-bottom: 80px;
                    }
                }

                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #888;
                    transition: all 0.3s ease;
                    flex: 1;
                    height: 100%;
                    position: relative;
                    -webkit-tap-highlight-color: transparent;
                    opacity: 0.5; /* Dim inactive items */
                }

                .nav-item.active {
                    color: var(--color-accent);
                    opacity: 1; /* Highlight active item */
                }

                .nav-item:active {
                    transform: scale(0.95);
                }

                .icon-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                    justify-content: center;
                }

                .icon-wrapper {
                    position: relative;
                }

                .badge {
                    position: absolute;
                    top: -5px;
                    right: -8px;
                    background: var(--color-accent);
                    color: #000;
                    font-size: 0.6rem;
                    font-weight: 800;
                    min-width: 14px;
                    height: 14px;
                    padding: 0 4px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #000;
                }

                .active-line {
                    position: absolute;
                    bottom: 10px;
                    width: 20px;
                    height: 2px;
                    background: var(--color-accent);
                    border-radius: 1px;
                    box-shadow: 0 0 5px var(--color-accent);
                }
            `}</style>
        </nav>
    );
}
