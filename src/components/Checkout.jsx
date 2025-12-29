import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { t, formatPrice, language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [iyzicoContent, setIyzicoContent] = useState(null);

    // Form inputs state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems,
                    userDetails: formData,
                    totalPrice: cartTotal,
                    currency: language
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setIyzicoContent(data.checkoutFormContent);
                // The cart will be cleared effectively after successful payment callback handling
                // For this demo/sandbox, we perform the view transition here
            } else {
                setError(data.errorMessage || 'Payment initialization failed');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Effect to run script tags from Iyzico HTML content
    useEffect(() => {
        if (iyzicoContent) {
            // Create a temporary container to parse the HTML string
            const div = document.createElement('div');
            div.innerHTML = iyzicoContent;

            // Find and execute scripts
            const scripts = div.getElementsByTagName('script');
            Array.from(scripts).forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.appendChild(document.createTextNode(script.innerHTML));
                document.body.appendChild(newScript);
            });
        }
    }, [iyzicoContent]);

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>{t('emptyBag')}</h2>
                <button className="cta-btn" onClick={() => navigate('/')} style={{ marginTop: '1rem', maxWidth: '300px', margin: '1rem auto' }}>
                    {t('heroCta')}
                </button>
            </div>
        );
    }

    return (
        <section className="checkout-section">
            <div className="container">
                <h2 className="section-title">{t('checkout')}</h2>

                <div className="checkout-grid">
                    <div className="checkout-form-container">
                        {/* Error Message */}
                        {error && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(255, 0, 0, 0.1)',
                                border: '1px solid red',
                                color: 'red',
                                marginBottom: '2rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* If Iyzico content is present, show the payment form container */}
                        {iyzicoContent ? (
                            <div className="iyzico-container">
                                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
                                    {t('paySecurely')}
                                </h3>
                                <div id="iyzipay-checkout-form" className="responsive"></div>
                                {/* We hide the dangerouslySetInnerHTML because we only need the structure for the script to target, 
                                    but usually the script inserts into the id above. 
                                    However, if the HTML content contains the form structure itself: */}
                                <div dangerouslySetInnerHTML={{ __html: iyzicoContent }} />
                            </div>
                        ) : (
                            <form onSubmit={handlePayment} id="checkout-form">
                                {/* Contact & Shipping */}
                                <div className="form-block">
                                    <h3 className="form-section-title">
                                        <span className="step-number">1</span>
                                        {t('contactInfo')}
                                    </h3>
                                    <div className="form-group">
                                        <label>{t('fullName')}</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t('phName')}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>{t('email')}</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={t('phEmail')}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('phone')}</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={t('phPhone')}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('address')}</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t('phAddress')}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Istanbul"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="34732"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-block" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                        Proceed to complete your payment securely with Iyzico.
                                    </p>
                                </div>
                            </form>
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

                            {!iyzicoContent && (
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    className={`submit-btn ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Initializing...' : t('checkout')}
                                </button>
                            )}

                            <div className="secure-badge">
                                <span className="lock-icon">🔒</span> {t('secureBadge')}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <img src="https://sandbox-st.iyzipay.com/assets/images/iyzipay-logo.png" alt="Iyzico" style={{ height: '30px', opacity: 0.8 }} />
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
        
        /* Iyzico Styles */
        .iyzico-container {
            animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}
