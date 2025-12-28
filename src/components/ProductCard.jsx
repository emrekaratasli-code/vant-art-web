import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { formatPrice, t } = useLanguage();

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} loading="lazy" />
                <button className="add-to-cart-overlay" onClick={() => addToCart(product)}>
                    {t('addToCart')}
                </button>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
            </div>
            <style>{`
        .product-card {
          margin-bottom: var(--spacing-md);
          background: var(--color-surface);
          padding: 1rem;
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
        }
        .product-card:hover {
          border-color: var(--color-accent);
        }
        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          margin-bottom: var(--spacing-sm);
          aspect-ratio: 4/5;
        }
        .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-image-wrapper img {
          transform: scale(1.05);
        }
        .add-to-cart-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: rgba(18, 18, 18, 0.9);
          color: var(--color-accent);
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.1em;
          border-top: 1px solid var(--color-accent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .product-card:hover .add-to-cart-overlay {
          transform: translateY(0);
        }
        .add-to-cart-overlay:hover {
          background: var(--color-accent);
          color: var(--color-bg);
          cursor: pointer;
        }
        .product-info {
          text-align: center;
        }
        .product-name {
          font-size: 1.1rem;
          font-family: var(--font-heading);
          font-weight: 400;
          margin-bottom: 0.25rem;
          color: var(--color-text);
        }
        .product-price {
          color: var(--color-accent);
          font-weight: 700;
          font-size: 1rem;
        }
      `}</style>
        </div>
    );
}
