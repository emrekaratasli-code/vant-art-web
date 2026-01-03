import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { products } from '../data/products';
import { useEffect } from 'react';

const AccordionItem = ({ title, isOpen, onClick, children }) => {
    return (
        <div className="accordion-item">
            <button className={`accordion-header ${isOpen ? 'open' : ''}`} onClick={onClick}>
                <span>{title}</span>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="accordion-inner">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { t, formatPrice } = useLanguage();

    // Accordion State
    const [openSection, setOpenSection] = useState('description');

    const product = products.find(p => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Product not found</div>;
    }

    const images = product.images || [product.image, product.image];

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="product-detail-page">
            <div className="carousel-container">
                <div className="carousel-track">
                    {images.map((img, index) => (
                        <div key={index} className="carousel-slidfe" style={{ flex: '0 0 100%' }}>
                            <img src={img} alt={`${product.name} view ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <div className="carousel-dots">
                    {images.map((_, index) => (
                        <div key={index} className="dot" />
                    ))}
                </div>
            </div>

            <div className="container product-content">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← {t('backToEdit') || 'Back'}
                </button>

                <h1 className="product-title">{product.name}</h1>
                <p className="product-price-lg">{formatPrice(product.price)}</p>

                <div className="action-area">
                    <button
                        className="add-btn-main"
                        onClick={() => addToCart(product)}
                    >
                        {t('addToCart')}
                    </button>
                </div>

                <div className="trust-signals-row">
                    <div className="trust-item">
                        <span className="trust-icon">💳</span>
                        <span>{t('secureShopping')}</span>
                    </div>
                    <div className="trust-item">
                        <span className="trust-icon">📅</span>
                        <span>{t('installments')}</span>
                    </div>
                </div>

                <div className="accordion-container">
                    <AccordionItem
                        title={t('description')}
                        isOpen={openSection === 'description'}
                        onClick={() => toggleSection('description')}
                    >
                        <p>{product.description}</p>
                    </AccordionItem>

                    <AccordionItem
                        title={t('features')}
                        isOpen={openSection === 'features'}
                        onClick={() => toggleSection('features')}
                    >
                        <ul className="detail-list">
                            <li><strong>{t('materialLabel')}:</strong> {product.material}</li>
                            <li><strong>SKU:</strong> VNT-{product.id}00</li>
                            <li><strong>{t('guaranteed')}</strong></li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem
                        title={t('care')}
                        isOpen={openSection === 'care'}
                        onClick={() => toggleSection('care')}
                    >
                        <p>
                            To maintain the luster of your VANT ART piece, clean gently with a soft cloth.
                            Avoid direct contact with perfumes and harsh chemicals.
                        </p>
                    </AccordionItem>
                </div>
            </div>

            {/* Spacer for sticky CTA */}
            <div style={{ height: '80px' }}></div>

            <div className="sticky-cta">
                <div className="info-mini">
                    <span>{product.name}</span>
                    <span className="price-mini">{formatPrice(product.price)}</span>
                </div>
                <button
                    className="add-btn"
                    onClick={() => addToCart(product)}
                >
                    {t('addToCart')}
                </button>
            </div>

            <style>{`
                .product-detail-page {
                    min-height: 100vh;
                    background: var(--color-bg);
                }
                .back-btn {
                    margin-bottom: 1rem;
                    color: var(--color-text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;   
                    font-size: 0.9rem;
                }

                /* Carousel Styles */
                .carousel-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    overflow: hidden;
                    background: #000;
                }
                
                @media (min-width: 769px) {
                    .carousel-container {
                        aspect-ratio: 21/9;
                        max-height: 60vh;
                    }
                    .product-detail-page {
                        padding-top: 2rem;
                    }
                }

                .carousel-track {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scrollbar-width: none;
                    height: 100%;
                }
                .carousel-slidfe {
                    flex: 0 0 100%;
                    width: 100%;
                    scroll-snap-align: center;
                }
                .carousel-slidfe img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .product-content {
                    padding-top: 2rem;
                    padding-bottom: 2rem;
                    max-width: 800px; /* Readability */
                }

                .product-title {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    font-family: var(--font-heading);
                    color: var(--color-accent);
                }

                .product-price-lg {
                    font-size: 1.5rem;
                    color: var(--color-text);
                    margin-bottom: 2rem;
                    font-family: var(--font-body);
                    font-weight: 300;
                }
                
                /* Action Area */
                .add-btn-main {
                    width: 100%;
                    background: var(--color-accent);
                    color: #000;
                    padding: 1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 2rem;
                    border-radius: var(--radius-sm);
                }

                /* Trust Signals */
                .trust-signals-row {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                    justify-content: center;
                    border-top: 1px solid var(--color-border);
                    border-bottom: 1px solid var(--color-border);
                    padding: 1rem 0;
                }
                .trust-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                }
                .trust-icon {
                    font-size: 1.2rem;
                }

                /* Accordion */
                .accordion-container {
                    border-top: 1px solid var(--color-border);
                }
                .accordion-item {
                    border-bottom: 1px solid var(--color-border);
                }
                .accordion-header {
                    width: 100%;
                    padding: 1.5rem 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--color-text);
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                    text-align: left;
                }
                .accordion-header.open {
                    color: var(--color-accent);
                }
                .accordion-content {
                    height: 0;
                    overflow: hidden;
                    transition: height 0.3s ease;
                }
                .accordion-content.open {
                    height: auto;
                }
                .accordion-inner {
                    padding-bottom: 1.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                    line-height: 1.7;
                }
                .detail-list {
                    list-style: none;
                    padding: 0;
                }
                .detail-list li {
                    margin-bottom: 0.5rem;
                }

                /* Sticky CTA */
                .sticky-cta {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: rgba(18, 18, 18, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 1rem;
                    padding-bottom: max(1rem, env(safe-area-inset-bottom));
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px solid var(--color-border);
                    z-index: 900;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                }
                /* Show sticky CTA only when main button scrolls out - simplifying to always show on mobile for now or specific scroll logic. 
                   For this task, we'll just keep it simple or hide it if we have the main button. 
                   Let's hide it on Desktop, show on Mobile.
                */
                @media (max-width: 768px) {
                    .sticky-cta {
                        transform: translateY(0);
                         padding-bottom: calc(max(0.8rem, env(safe-area-inset-bottom)) + 60px);
                    }
                }

                .info-mini {
                    display: flex;
                    flex-direction: column;
                }
                .info-mini span {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--color-text);
                }
                .price-mini {
                    color: var(--color-accent) !important;
                    font-size: 0.8rem !important;
                }

                .add-btn {
                    background: var(--color-accent);
                    color: #000;
                    padding: 0.75rem 1.5rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-radius: var(--radius-sm);
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
}
