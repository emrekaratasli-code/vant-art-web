import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe - using test publishable key
const stripePromise = loadStripe('pk_test_51QY9ZkP9fJ8rH2mT1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4');

function PaymentForm({ formData, cartTotal }) {
    const stripe = useStripe();
    const elements = useElements();
    const { clearCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setLoading(false);
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/success',
            },
            redirect: 'if_required'
        });

        if (result.error) {
            setError(result.error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            clearCart();
            setTimeout(() => navigate('/'), 3000);
        }
    };

    if (success) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid #00ff00',
                borderRadius: '4px'
            }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                    ✓ Payment Successful!
                </h3>
                <p>Thank you for your order. Redirecting to home page...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid red',
                    color: 'red',
                    marginBottom: '2rem',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            <div style={{
                background: 'var(--color-surface)',
                padding: '2rem',
                border: '1px solid var(--color-border)',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    color: 'var(--color-accent)'
                }}>
                    <span className="step-number" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        borderRadius: '50%',
                        fontSize: '1rem',
                        fontWeight: '700',
                        marginRight: '1rem'
                    }}>2</span>
                    {t('paymentInfo') || 'Payment Information'}
                </h3>

                <PaymentElement />
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: loading ? '#666' : 'var(--color-accent)',
                    color: 'var(--color-bg)',
                    fontWeight: '700',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: '0.3s',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? t('processing') || 'Processing...' : t('payNow') || `Pay ${cartTotal.toFixed(2)}`}
            </button>

            <div style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}>
                <span>🔒</span> {t('secureBadge') || 'Secure Payment with Stripe'}
            </div>
        </form>
    );
}

export default function Checkout() {
    const { cartItems, cartTotal } = useCart();
    const { t, formatPrice, language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

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

    const handleContactSubmit = async (e) => {
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

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                setError(data.error || 'Payment initialization failed');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(t('paymentError') || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

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

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#d4af37',
            colorBackground: '#1a1a1a',
            colorText: '#ffffff',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '0px',
        },
    };

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

                        {/* Contact Form */}
                        {!clientSecret ? (
                            <form onSubmit={handleContactSubmit} id="contact-form">
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
                                            <label>{t('city')}</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Istanbul"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('zipCode')}</label>
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
                            </form>
                        ) : (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                                <PaymentForm formData={formData} cartTotal={cartTotal} />
                            </Elements>
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

                            {!clientSecret && (
                                <button
                                    type="submit"
                                    form="contact-form"
                                    className={`submit-btn ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Initializing...' : t('continue') || 'Continue to Payment'}
                                </button>
                            )}

                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <img
                                    src="https://stripe.com/img/v3/newsroom/social.png"
                                    alt="Powered by Stripe"
                                    style={{ height: '30px', opacity: 0.6, filter: 'grayscale(100%)' }}
                                />
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
      `}</style>
        </section>
    );
}
