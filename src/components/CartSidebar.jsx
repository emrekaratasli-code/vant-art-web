import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

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
                    <button className="close-btn" onClick={toggleCart}>&times;</button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <p>{t('emptyBag')}</p>
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
                            <div className="cart-total">
                                <span>{t('subtotal')}:</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout}>{t('checkout')}</button>
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
          transition: transform 0.3s ease;
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
        }
        .close-btn {
          font-size: 2rem;
          line-height: 1;
          color: var(--color-text);
        }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .cart-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .cart-item-image {
          width: 80px;
          aspect-ratio: 1;
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
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: var(--color-accent);
          color: var(--color-bg);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          transition: background 0.3s ease;
        }
        .checkout-btn:hover {
          background: var(--color-accent-hover);
        }
        .cart-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
        }
      `}</style>
        </>
    );
}
