import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { t, formatPrice } = useLanguage();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isReviewing, setIsReviewing] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setFormData(prev => ({ ...prev, cardNumber: value }));
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (value.length >= 3) {
            value = `${value.substring(0, 2)}/${value.substring(2)}`;
        }
        setFormData(prev => ({ ...prev, expiry: value }));
    };

    const handleReview = (e) => {
        e.preventDefault();
        setIsReviewing(true);
    };

    const handleSubmit = () => {
        setLoading(true);
        // Simulate order processing
        setTimeout(() => {
            clearCart();
            setOrderPlaced(true);
            setLoading(false);
        }, 2000);
    };

    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>{t('emptyBag')}</h2>
                <button className="cta-btn" onClick={() => navigate('/')} style={{ marginTop: '1rem', maxWidth: '300px', margin: '1rem auto' }}>
                    {t('heroCta')}
                </button>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <div style={{
                    fontSize: '5rem',
                    color: 'var(--color-accent)',
                    marginBottom: '2rem',
                    animation: 'scaleIn 0.5s ease'
                }}>✓</div>
                <h2 style={{
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    marginBottom: '1rem'
                }}>{t('orderSuccess')}</h2>
                <button className="cta-btn" onClick={() => navigate('/')} style={{ marginTop: '2rem', maxWidth: '300px', margin: '2rem auto' }}>
                    {t('heroCta')}
                </button>
            </div>
        );
    }

    return (
        <section className="checkout-section">
            <div className="container">
                <h2 className="section-title">{isReviewing ? t('reviewOrder') : t('checkout')}</h2>

                <div className="checkout-grid">
                    <div className="checkout-form-container">
                        {!isReviewing ? (
                            <form onSubmit={handleReview} id="checkout-form">
                                {/* Contact & Shipping */}
                                <div className="form-block">
                                    <h3 className="form-section-title">
                                        <span className="step-number">1</span>
                                        {t('contactInfo')}
                                    </h3>
                                    <div className="form-group">
                                        <label>{t('fullName')}</label>
                                        <input type="text" required placeholder={t('phName')} />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>{t('email')}</label>
                                            <input type="email" required placeholder={t('phEmail')} />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('phone')}</label>
                                            <input type="tel" required placeholder={t('phPhone')} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('address')}</label>
                                        <input type="text" required placeholder={t('phAddress')} />
                                    </div>
                                </div>

                                {/* Payment Section - Iyzico Style */}
                                <div className="form-block" style={{ marginTop: '3rem' }}>
                                    <h3 className="form-section-title">
                                        <span className="step-number">2</span>
                                        {t('paymentDetails')}
                                    </h3>

                                    <div className="credit-card-form">
                                        <div className="card-visual">
                                            <div className="card-chip"></div>
                                            <div className="card-logo">VISA</div>
                                            <div className="card-number-display">{formData.cardNumber || '**** **** **** ****'}</div>
                                            <div className="card-meta">
                                                <span>{formData.cardHolder || 'CARD HOLDER'}</span>
                                                <span>{formData.expiry || 'MM/YY'}</span>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>{t('cardHolder')}</label>
                                            <input
                                                type="text"
                                                name="cardHolder"
                                                value={formData.cardHolder}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={t('phCardName')}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('cardNumber')}</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleCardNumberChange}
                                                maxLength="19"
                                                required
                                                placeholder="0000 0000 0000 0000"
                                                style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>{t('expiryDate')}</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    value={formData.expiry}
                                                    onChange={handleExpiryChange}
                                                    maxLength="5"
                                                    required
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{t('cvc')}</label>
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    value={formData.cvc}
                                                    onChange={handleInputChange}
                                                    maxLength="3"
                                                    required
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="review-block">
                                <div className="form-block">
                                    <h3 className="form-section-title">{t('paymentDetails')}</h3>
                                    <div className="review-details">
                                        <p><strong>{t('cardHolder')}:</strong> {formData.cardHolder}</p>
                                        <p><strong>{t('cardNumber')}:</strong> {formData.cardNumber}</p>
                                        <p><strong>{t('expiryDate')}:</strong> {formData.expiry}</p>
                                    </div>
                                    <button
                                        className="text-btn"
                                        onClick={() => setIsReviewing(false)}
                                        style={{
                                            marginTop: '1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--color-accent)',
                                            textDecoration: 'underline',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t('backToEdit')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="order-summary-container">
                        <div className="order-summary">
                            <h3>{t('yourBag')}</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-img">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="summary-info">
                                            <h4>{item.name}</h4>
                                            <p>{formatPrice(item.price)} x {item.quantity}</p>
                                        </div>
                                        <span className="summary-price">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-total">
                                <span>{t('subtotal')}</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>

                            {!isReviewing ? (
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    className="submit-btn"
                                >
                                    {t('reviewOrder')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className={`submit-btn ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : t('confirmOrder')}
                                </button>
                            )}

                            <div className="secure-badge">
                                <span className="lock-icon">🔒</span> {t('secureBadge')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        .checkout-section {
          padding: 4rem 0;
          color: var(--color-text);
          min-height: 80vh;
        }
        .section-title {
            text-align: center;
            font-family: var(--font-heading);
            font-size: 3rem;
            margin-bottom: 4rem;
            color: var(--color-accent);
        }
        .checkout-grid {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 4rem;
            align-items: start;
        }
        @media (max-width: 1024px) {
            .checkout-grid { grid-template-columns: 1fr; gap: 2rem; }
            .order-summary-container { order: -1; }
        }
        
        /* Forms */
        .form-block {
            background: var(--color-surface);
            padding: 2rem;
            border: 1px solid var(--color-border);
            position: relative;
        }
        .form-section-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            margin-bottom: 2rem;
            color: var(--color-text);
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .step-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: var(--color-accent);
            color: var(--color-bg);
            border-radius: 50%;
            font-size: 1rem;
            font-weight: 700;
            font-family: var(--font-body);
        }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-row { display: flex; gap: 1.5rem; }
        .form-row .form-group { flex: 1; }
        
        label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-size: 0.8rem; 
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-muted);
        }
        input {
            width: 100%;
            padding: 1rem;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--color-border);
            color: white;
            font-family: var(--font-body);
            transition: 0.3s;
        }
        input:focus {
            border-color: var(--color-accent);
            background: rgba(255,255,255,0.05);
            outline: none;
        }

        /* Credit Card Visual */
        .credit-card-form {
            background: rgba(255,255,255,0.02);
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid var(--color-border);
        }
        .card-visual {
            width: 100%;
            max-width: 350px;
            height: 200px;
            background: linear-gradient(135deg, #2c2c2c, #111);
            border: 1px solid var(--color-accent);
            border-radius: 12px;
            margin: 0 auto 2rem;
            padding: 2rem;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
        .card-chip {
            width: 40px;
            height: 30px;
            background: linear-gradient(135deg, #d4af37, #f9f295);
            border-radius: 4px;
            position: absolute;
            top: 50px;
            left: 30px;
        }
        .card-logo {
            position: absolute;
            top: 20px;
            right: 30px;
            font-weight: 900;
            font-style: italic;
            font-size: 1.5rem;
            color: rgba(255,255,255,0.8);
        }
        .card-number-display {
            font-family: monospace;
            font-size: 1.4rem;
            letter-spacing: 2px;
            color: #fff;
            margin-bottom: 1.5rem;
            text-shadow: 0 2px 2px rgba(0,0,0,0.5);
        }
        .card-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            text-transform: uppercase;
            color: rgba(255,255,255,0.7);
        }

        /* Order Summary */
        .order-summary {
            background: var(--color-surface);
            padding: 2rem;
            border: 1px solid var(--color-border);
            position: sticky;
            top: 2rem;
        }
        .order-summary h3 {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            color: var(--color-accent);
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-border);
        }
        .summary-item {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            align-items: center;
        }
        .summary-img {
            width: 60px;
            height: 60px;
            background: #222;
        }
        .summary-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .summary-info { flex: 1; }
        .summary-info h4 {
            font-size: 0.9rem;
            font-weight: 400;
            margin-bottom: 0.2rem;
        }
        .summary-info p {
            font-size: 0.8rem;
            color: var(--color-text-muted);
        }
        .summary-divider {
            height: 1px;
            background: var(--color-border);
            margin: 2rem 0;
        }
        .summary-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.25rem;
            font-family: var(--font-heading);
            color: var(--color-accent);
            margin-bottom: 2rem;
        }
        
        .submit-btn, .cta-btn {
            width: 100%;
            padding: 1.25rem;
            background: var(--color-accent);
            color: var(--color-bg);
            font-weight: 700;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border: none;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 0;
        }
        .submit-btn:hover, .cta-btn:hover { 
            background: var(--color-accent-hover);
        }
        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .secure-badge {
            margin-top: 1.5rem;
            text-align: center;
            font-size: 0.8rem;
            color: var(--color-text-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </section>
    );
}
