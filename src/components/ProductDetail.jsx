import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { products } from '../data/products';
import { useEffect } from 'react';

import { useWishlist } from '../context/WishlistContext';
import ProductRecommendations from './ProductRecommendations'; // Import Added // Import Added

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

import { useSettings } from '../context/SettingsContext'; // Import Added

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { t, formatPrice } = useLanguage();
    const { toggleWishlist, isInWishlist } = useWishlist(); // Hook Added
    const { settings } = useSettings(); // Hook Added
    const [viewers, setViewers] = useState(0);

    // Accordion State
    const [openSection, setOpenSection] = useState('description');

    const product = products.find(p => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        // Random viewers between 5 and 25
        setViewers(Math.floor(Math.random() * 20) + 5);
    }, []);

    if (!product) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Product not found</div>;
    }

    const images = product.images || [product.image, product.image];
    const isFav = isInWishlist(product.id);

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

                {/* Collection Context */}
                {product.collection && (
                    <div className="collection-context">
                        <span className="context-label">From the Collection:</span>
                        <Link to={`/collection/${encodeURIComponent(product.collection)}`} className="collection-link">
                            {product.collection} →
                        </Link>
                    </div>
                )}

                {/* Social Proof Badge */}
                {settings?.showSocialProof && (
                    <div className="social-proof-badge">
                        <span className="pulse-dot"></span>
                        <span>Şu an {viewers} kişi bu ürünü inceliyor</span>
                    </div>
                )}

                <p className="product-price-lg">{formatPrice(product.price)}</p>

                <div className="action-area" style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="add-btn-main"
                        onClick={() => addToCart(product)}
                        style={{ flex: 1, marginBottom: 0 }}
                    >
                        Join the Collection
                    </button>

                    <button
                        className={`wishlist-toggle ${isFav ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product)}
                        style={{
                            width: '54px',
                            height: '54px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-border)',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: isFav ? '#d4af37' : 'var(--color-text)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
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

                <div className="artisan-note">
                    <h5>Zanaatkarın Notu</h5>
                    <p>"{t('artisanNote') || 'Bu parça, asırlık tekniklerle modern estetiği buluşturan ustalarımızın elinden çıkmıştır. Her detayında bir ruh, her kıvrımında bir hikaye saklıdır.'}"</p>
                    <span className="signature">VANT ART Atelier</span>
                </div>

                <div className="accordion-container">
                    <AccordionItem
                        title="The Piece"
                        isOpen={openSection === 'description'}
                        onClick={() => toggleSection('description')}
                    >
                        <p>{product.description}</p>
                    </AccordionItem>

                    <AccordionItem
                        title="Composition"
                        isOpen={openSection === 'features'}
                        onClick={() => toggleSection('features')}
                    >
                        <ul className="detail-list">
                            <li><strong>Materials:</strong> {product.material}</li>
                            {product.sizing && <li><strong>Sizing:</strong> {product.sizing}</li>}
                            <li><strong>Piece ID:</strong> VNT-{product.id}00</li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem
                        title="Caring for Your Piece"
                        isOpen={openSection === 'care'}
                        onClick={() => toggleSection('care')}
                    >
                        <p>{product.care || 'To maintain the integrity of your piece, clean gently with a soft cloth. Avoid direct contact with perfumes and harsh chemicals.'}</p>
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
                    Join the Collection
                </button>
            </div>

            <ProductRecommendations category={product.category} currentProductId={product.id} />


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

                .social-proof-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(212, 175, 55, 0.1);
                    color: #d4af37;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    margin-bottom: 1rem;
                }
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #d4af37;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(212, 175, 55, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
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

                /* Collection Context */
                .collection-context {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background: rgba(212, 175, 55, 0.05);
                    border-radius: var(--radius-sm);
                }

                .context-label {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .collection-link {
                    font-size: 0.9rem;
                    color: var(--color-accent);
                    font-family: var(--font-heading);
                    letter-spacing: 0.05em;
                    transition: color 0.3s;
                }

                .collection-link:hover {
                    color: var(--color-accent-hover);
                }

                /* Philosophy Block */
                .philosophy-block {
                    background: linear-gradient(135deg, 
                        rgba(212, 175, 55, 0.05) 0%, 
                        rgba(212, 175, 55, 0.02) 100%);
                    padding: 1.5rem;
                    margin: 2rem 0;
                    border-left: 2px solid var(--color-accent);
                }

                .philosophy-text {
                    font-family: var(--font-script);
                    font-size: 1.1rem;
                    font-style: italic;
                    color: var(--color-text);
                    line-height: 1.7;
                }

                /* Accordion */
                .artisan-note {
                    background: rgba(212, 175, 55, 0.05);
                    border-left: 2px solid var(--color-accent);
                    padding: 1.5rem;
                    margin: 2rem 0;
                    font-family: var(--font-heading);
                }
                .artisan-note h5 {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--color-accent);
                    margin-bottom: 0.8rem;
                }
                .artisan-note p {
                    font-style: italic;
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }
                .signature {
                    display: block;
                    text-align: right;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    color: var(--color-text);
                }

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
