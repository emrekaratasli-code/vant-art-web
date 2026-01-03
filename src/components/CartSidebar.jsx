import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, cartTotal } = useCart();
  const { t, formatPrice } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart(); // Close sidebar
    navigate('/checkout');
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      <aside className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>{t('yourBag')}</h2>
          <button className="close-btn" onClick={toggleCart} aria-label="Close Cart">&times;</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>{t('emptyBag')}</p>
            <button className="continue-btn" onClick={toggleCart}>
              {t('collection')}
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">{formatPrice(item.price)} x {item.quantity}</p>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>{t('remove')}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="gift-option">
                <label className="gift-label">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="gift-text">
                    <span className="gift-title">VANT Özel Mühürlü Paket</span>
                    <span className="gift-sub">El yazısı not kartı ile</span>
                  </span>
                  <span className="gift-icon">🎁</span>
                </label>
              </div>

              <div className="cart-total">
                <span>{t('subtotal')}:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>{t('checkout')}</button>

              <div className="cart-trust">
                <div className="trust-row">
                  <span>🔒 {t('secureShopping')}</span>
                  <span>💳 PayTR</span>
                </div>
                <div className="trust-row-sm">
                  <span>{t('installments')}</span>
                </div>
              </div>

              <div className="cart-legal">
                <Link to="/sozlesmeler/mesafeli-satis" onClick={toggleCart}>{t('distanceSalesContract')}</Link>
                <span className="separator">•</span>
                <Link to="/sozlesmeler/iptal-iade" onClick={toggleCart}>{t('returnPolicyLink')}</Link>
              </div>
            </div>
          </>
        )}
      </aside>
      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 900;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease;
          backdrop-filter: blur(2px);
        }
        .cart-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 400px;
          height: 100%;
          background: var(--color-surface);
          color: var(--color-text);
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          box-shadow: -5px 0 20px rgba(0,0,0,0.5);
          border-left: 1px solid var(--color-border);
        }
        .cart-sidebar.open {
          transform: translateX(0);
        }
        .cart-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
        }
        .cart-header h2 {
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--color-accent);
          font-family: var(--font-heading);
        }
        .close-btn {
          font-size: 2.5rem;
          line-height: 1;
          color: var(--color-text);
          padding: 0.5rem; /* Bigger touch target */
        }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          /* Scrollbar styling */
          scrollbar-width: thin;
          scrollbar-color: var(--color-border) transparent;
        }
        .cart-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .cart-item-image {
          width: 80px;
          aspect-ratio: 1;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-details h4 {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 400;
          margin-bottom: 0.25rem;
          color: var(--color-text);
        }
        .item-price {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .remove-btn {
          font-size: 0.8rem;
          text-decoration: underline;
          color: var(--color-text-muted);
        }
        .remove-btn:hover {
          color: var(--color-accent);
        }
        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--color-border);
          background: var(--color-bg);
          padding-bottom: max(6rem, env(safe-area-inset-bottom)); /* Increased bottom padding to clear nav */
          position: relative;
          z-index: 1002; /* Ensure above stuff */
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }
        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: var(--color-accent);
          color: #000; /* Contrast on Gold */
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          transition: filter 0.3s ease, transform 0.1s;
          border-radius: 30px; /* Soft pill shape */
          font-family: var(--font-heading);
        }
        .checkout-btn:hover {
          filter: brightness(1.1);
        }
        .checkout-btn:active {
            transform: scale(0.98);
        }
        .cart-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          gap: 1rem;
        }
        .continue-btn {
            padding: 0.5rem 1.5rem;
            border: 1px solid var(--color-accent);
            color: var(--color-accent);
            border-radius: var(--radius-sm);
        }
        
        /* Trust & Legal */
        .cart-trust {
            margin-top: 1.5rem;
            text-align: center;
            border-top: 1px dashed var(--color-border);
            padding-top: 1rem;
        }
        .trust-row {
            display: flex;
            justify-content: center;
            gap: 1rem;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            margin-bottom: 0.5rem;
        }
        .trust-row-sm {
            font-size: 0.75rem;
            color: var(--color-text-muted);
        }
        .cart-legal {
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.7rem;
            color: var(--color-text-muted);
            flex-wrap: wrap;
        }
        .cart-legal a {
            text-decoration: underline;
            color: var(--color-text-muted);
        }
                .gift-option {
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                    background: rgba(255, 255, 255, 0.02);
                }
                .gift-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    gap: 1rem;
                }
                .gift-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .gift-title {
                    font-size: 0.9rem;
                    color: var(--color-text);
                    font-family: var(--font-heading);
                }
                .gift-sub {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                }
                .gift-icon {
                    font-size: 1.2rem;
                }
      `}</style>
    </>
  );
}
