import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { addOrder } = useOrders();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card'); // 'credit_card' | 'test'

    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        identityNumber: '11111111111',
        email: user?.email || '',
        phone: '',
        city: '',
        addressLine: ''
        // Zip Code removed
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (paymentMethod === 'test') {
            // Simulate processing delay
            setTimeout(() => {
                const newOrder = {
                    user_id: user?.id,
                    guest_email: user ? null : formData.email,
                    total_amount: cartTotal,
                    status: 'Processing',
                    items: cartItems,
                    shipping_address: {
                        ...formData,
                        zipCode: '34000'
                    },
                    billing_address: {
                        ...formData,
                        zipCode: '34000'
                    },
                    payment_method: 'Test Order',
                    created_at: new Date().toISOString()
                };

                addOrder(newOrder); // Save to history

                setLoading(false);
                clearCart();
                alert('Test Siparişiniz Başarıyla Alındı! Teşekkür ederiz.');
                navigate('/');
            }, 1500);
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    basketItems: cartItems,
                    user: {
                        name: formData.name,
                        surname: formData.surname,
                        email: formData.email
                    },
                    address: {
                        ...formData,
                        zipCode: '34000' // Default / Hidden zip code for Iyzico requirement
                    }
                })
            });

            const data = await response.json();

            if (data.status === 'success' && data.checkoutFormContent) {
                // Iyzico injection
                const container = document.getElementById('iyzipay-checkout-form');
                if (container) {
                    container.innerHTML = data.checkoutFormContent;
                    const scriptContent = /<script\b[^>]*>([\s\S]*?)<\/script>/gm.exec(data.checkoutFormContent);
                    if (scriptContent && scriptContent[1]) {
                        window.eval(scriptContent[1]);
                    }
                }
            } else {
                setError('Ödeme formu oluşturulamadı: ' + (data.errorMessage || data.status));
            }
        } catch (err) {
            setError('Bir hata oluştu: ' + err.message);
        } finally {
            if (paymentMethod !== 'test') {
                setLoading(false);
            }
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl mb-4 text-[#d4af37]">Sepetiniz Boş</h2>
                <button onClick={() => navigate('/')} className="text-white hover:text-[#d4af37] underline transition-colors">
                    Alışverişe Başla
                </button>
            </div>
        );
    }

    const inputClasses = "w-full p-3 bg-[#0a0a0a] border border-[#333] text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-600 font-light tracking-wide";

    return (
        <div className="container mx-auto px-4 md:px-12 py-32 font-secondary min-h-screen">
            <h1 className="text-3xl md:text-4xl mb-12 text-center playfair font-medium tracking-wide text-[#d4af37] uppercase">Güvenli Ödeme</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* FORM LEFT */}
                <div className="flex-1">
                    <h2 className="text-xl mb-6 pb-2 border-b border-[#333] text-white uppercase tracking-wider">Teslimat Bilgileri</h2>
                    <form onSubmit={handlePayment} className="checkout-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Ad</label>
                                <input
                                    type="text" name="name" required
                                    value={formData.name} onChange={handleInputChange}
                                    className="ant-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Soyad</label>
                                <input
                                    type="text" name="surname" required
                                    value={formData.surname} onChange={handleInputChange}
                                    className="ant-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefon</label>
                                <input
                                    type="text" name="phone" placeholder="555 555 55 55" required
                                    value={formData.phone} onChange={handleInputChange}
                                    className="ant-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>E-posta</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleInputChange}
                                    className="ant-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Şehir</label>
                                <input
                                    type="text" name="city" required
                                    value={formData.city} onChange={handleInputChange}
                                    className="ant-input"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Adres</label>
                                <textarea
                                    name="addressLine" required
                                    rows="3"
                                    value={formData.addressLine} onChange={handleInputChange}
                                    className="ant-input"
                                />
                            </div>
                        </div>


                        <div className="mt-8 pt-6 border-t border-[#333]">
                            <h2 className="text-xl mb-6 text-white uppercase tracking-wider">Ödeme Yöntemi</h2>
                            <div className="flex flex-col gap-4">
                                <label className={`payment-option ${paymentMethod === 'credit_card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="credit_card"
                                        checked={paymentMethod === 'credit_card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Kredi / Banka Kartı
                                    </span>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'test' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="test"
                                        checked={paymentMethod === 'test'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Test Siparişi (Ödeme Yok)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="checkout-btn"
                            >
                                {loading ? 'Ödeme Yükleniyor...' : `DEVAM ET (${cartTotal.toLocaleString('tr-TR')} TL)`}
                            </button>
                            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                        </div>
                    </form>
                </div>

                {/* ORDER SUMMARY RIGHT */}
                <div className="order-summary-card">
                    <h3 className="summary-title">Sipariş Özeti</h3>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="item-info">
                                    <span className="qty">{item.quantity}x</span>
                                    <span className="name">{item.name}</span>
                                </div>
                                <span className="price">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-total">
                        <span>Toplam</span>
                        <span>{cartTotal.toLocaleString('tr-TR')} TL</span>
                    </div>
                </div>
            </div>

            {/* IYZICO FORM CONTAINER */}
            <div id="iyzipay-checkout-form" className="mt-12 w-full"></div>

            <style>{`
                .checkout-form { font-family: 'Inter', sans-serif; }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .full-width { grid-column: 1 / -1; }
                
                .form-group label {
                    display: block;
                    color: #888;
                    font-size: 0.75rem;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .ant-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid #333;
                    color: #fff;
                    padding: 12px 16px;
                    font-size: 0.95rem;
                    border-radius: 4px;
                    outline: none;
                    transition: all 0.3s ease;
                    -webkit-appearance: none;
                }
                .ant-input:focus {
                    border-color: #d4af37;
                    background: rgba(212, 175, 55, 0.05);
                }
                
                .checkout-btn {
                    width: 100%;
                    background: #d4af37;
                    color: #000;
                    padding: 1rem;
                    border: none;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1rem;
                }
                .checkout-btn:hover {
                    background: #fff;
                    color: #000;
                }
                .checkout-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* ORDER SUMMARY STYLES */
                .order-summary-card {
                    width: 100%;
                    background: #1a1a1a;
                    padding: 2rem;
                    border: 1px solid #333;
                    height: fit-content;
                }
                @media (min-width: 1024px) {
                    .order-summary-card { width: 33%; }
                }
                .summary-title {
                    font-size: 1.25rem;
                    color: #d4af37;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #333;
                    font-family: 'Playfair Display', serif;
                }
                .summary-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    color: #ccc;
                }
                .item-info { display: flex; gap: 0.75rem; align-items: center; }
                .qty { color: #666; font-size: 0.8rem; }
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                    padding-top: 1rem;
                    border-top: 1px solid #333;
                }
                
                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .order-summary-card { margin-top: 2rem; }
                }

                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid #333;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.02);
                    color: #aaa;
                }
                .payment-option:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .payment-option.selected {
                    border-color: #d4af37;
                    background: rgba(212, 175, 55, 0.05);
                    color: #fff;
                }
                .payment-option input {
                    accent-color: #d4af37;
                    width: 1.2rem;
                    height: 1.2rem;
                }
            `}</style>
        </div>
    );
}
