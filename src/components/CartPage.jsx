import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const { t, formatPrice } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="cart-page container">
            <h1 className="page-title">{t('cart')}</h1>

            {cartItems.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>💎</div>
                    <p className="empty-text">{t('emptyBag')}</p>
                    <p className="art-invite">{t('exploreArt')}</p>
                    <button onClick={() => navigate('/')} className="continue-btn">KOLEKSİYONU KEŞFET</button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-row">
                                <div className="cart-img-wrapper">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-info">
                                    <h3>{item.name}</h3>
                                    <p className="price">{formatPrice(item.price)}</p>
                                    <div className="controls">
                                        <div className="qty-control">
                                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <button className="del-btn" onClick={() => removeFromCart(item.id)}>
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-fixed">
                        <div className="summary-row">
                            <span>{t('subtotal')}</span>
                            <span className="total-val">{formatPrice(cartTotal)}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                            {/* Using t('checkout') usually maps to "Proceed to Checkout" or similar */}
                            {t('checkout')}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .cart-page {
                    min-height: 80vh;
                    padding-top: 2rem;
                    padding-bottom: 15vh; /* Space for fixed footer + bottom nav */
                }
                .page-title {
                    font-size: 2rem;
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .empty-state {
                    text-align: center;
                    padding: 6rem 1rem;
                    color: var(--color-text-muted);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .empty-text {
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-text);
                }
                .art-invite {
                    font-family: var(--font-heading);
                    font-style: italic;
                    color: var(--color-accent);
                    margin-bottom: 2rem;
                    letter-spacing: 0.05em;
                }
                .continue-btn {
                    padding: 1rem 3rem;
                    background: var(--color-accent);
                    color: #000; /* Dark text for contrast */
                    font-weight: 700;
                    border-radius: var(--radius-sm);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .continue-btn:active {
                    transform: scale(0.95);
                }

                .cart-row {
                    display: flex;
                    gap: 1rem;
                    background: var(--color-surface);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1rem;
                    border: 1px solid var(--color-border);
                }
                .cart-img-wrapper {
                    width: 80px;
                    height: 80px;
                    flex-shrink: 0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .cart-img-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .cart-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .cart-info h3 {
                    font-size: 1rem;
                    margin-bottom: 0.2rem;
                    color: var(--color-text);
                }
                .price {
                    color: var(--color-accent);
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 0.5rem;
                }
                .qty-control {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                }
                .qty-control button {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-text);
                    font-size: 1.2rem;
                }
                .qty-control span {
                    width: 30px;
                    text-align: center;
                    font-size: 0.9rem;
                }
                .del-btn {
                    color: var(--color-text-muted);
                    font-size: 1.5rem;
                    padding: 0 0.5rem;
                    line-height: 1;
                }

                .cart-summary-fixed {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: var(--color-surface);
                    border-top: 1px solid var(--color-border);
                    padding: 1rem;
                    /* Adjust for BottomNav (60px) + Padding */
                    padding-bottom: calc(1rem + 60px + env(safe-area-inset-bottom)); 
                    z-index: 90;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                }
                .total-val {
                    color: var(--color-accent);
                }
                .checkout-btn {
                    width: 100%;
                    padding: 1rem;
                    background: var(--color-accent);
                    color: #000;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
