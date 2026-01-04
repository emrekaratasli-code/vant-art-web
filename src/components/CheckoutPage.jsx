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
        addressLine: '',
        zipCode: ''
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
                    address: formData
                })
            });

            const data = await response.json();

            if (data.status === 'success' && data.checkoutFormContent) {
                // Inject the Iyzico Script and HTML
                const container = document.getElementById('iyzipay-checkout-form');
                if (container) {
                    container.innerHTML = data.checkoutFormContent;

                    // Execute the script embedded in the HTML content
                    // Since setting innerHTML doesn't execute scripts, we need to extract and run it manually
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
                <h2 className="text-2xl mb-4">Sepetiniz Boş</h2>
                <button onClick={() => navigate('/products')} className="text-secondary hover:underline">
                    Alışverişe Başla
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-12 py-32 font-secondary">
            <h1 className="text-3xl md:text-4xl mb-12 text-center playfair font-medium tracking-wide text-[#d4af37]">ÖDEME</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* FORM LEFT */}
                <div className="flex-1">
                    <h2 className="text-xl mb-6 pb-2 border-b border-gray-200">Teslimat Bilgileri</h2>
                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text" name="name" placeholder="Adınız" required
                                value={formData.name} onChange={handleInputChange}
                                className="w-full p-3 bg-[#111] border border-[#333] text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-500"
                            />
                            <input
                                type="text" name="surname" placeholder="Soyadınız" required
                                value={formData.surname} onChange={handleInputChange}
                                className="w-full p-3 bg-[#111] border border-[#333] text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-500"
                            />
                        </div>

                        <input
                            type="text" name="phone" placeholder="Telefon Numarası (535...)" required
                            value={formData.phone} onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 focus:outline-none focus:border-secondary transition-colors"
                        />

                        <input
                            type="email" name="email" placeholder="E-posta Adresi" required
                            value={formData.email} onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 focus:outline-none focus:border-secondary transition-colors"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text" name="city" placeholder="Şehir" required
                                value={formData.city} onChange={handleInputChange}
                                className="w-full p-3 bg-[#111] border border-[#333] text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-500"
                            />
                            <input
                                type="text" name="zipCode" placeholder="Posta Kodu" required
                                value={formData.zipCode} onChange={handleInputChange}
                                className="w-full p-3 bg-[#111] border border-[#333] text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-500"
                            />
                        </div>

                        <textarea
                            name="addressLine" placeholder="Adres (Mahalle, Sokak, Kapı No...)" required
                            rows="3"
                            value={formData.addressLine} onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 focus:outline-none focus:border-secondary transition-colors"
                        />

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-secondary text-primary py-4 hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-widest text-sm"
                            >
                                {loading ? 'Ödeme Yükleniyor...' : `Ödemeye Geç (${cartTotal.toLocaleString('tr-TR')} TL)`}
                            </button>
                            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                        </div>
                    </form>
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

