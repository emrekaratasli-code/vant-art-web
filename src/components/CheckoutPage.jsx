import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            setLoading(false);
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
                            border-radius: 4px; /* Slight radius */
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
                        
                        @media (max-width: 768px) {
                            .form-grid { grid-template-columns: 1fr; gap: 1rem; }
                        }
                    `}</style>
                </div>

                {/* ORDER SUMMARY RIGHT */}
                <div className="w-full lg:w-1/3 bg-[#1a1a1a] p-8 h-fit border border-[#333]">
                    <h3 className="text-xl mb-6 pb-2 border-b border-[#333] text-[#d4af37]">Sipariş Özeti</h3>
                    <div className="space-y-4 mb-6 text-gray-300">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500">{item.quantity}x</span>
                                    <span>{item.name}</span>
                                </div>
                                <span>{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center font-bold text-lg pt-4 border-t border-[#333] text-white">
                        <span>Toplam</span>
                        <span>{cartTotal.toLocaleString('tr-TR')} TL</span>
                    </div>
                </div>
            </div>

            {/* IYZICO FORM CONTAINER */}
            <div id="iyzipay-checkout-form" className="mt-12 w-full"></div>
        </div>
    );
}

// Add these styles or update Tailwind classes above.
// For simplicity in this edit, I updated className directly in the JSX above to use standard Tailwind colors
// assuming standard config, or hex codes where specific control is needed.
// Inputs should have unwanted white bg removed or styled.
// Let's force some styles for inputs to ensure they look good on dark/light.
// Actually, since I can't see index.css easily, I'll add inline styles to inputs via classNames in the form section.

