import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../context/AnalyticsContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice, t } = useLanguage();
  const { trackEvent } = useAnalytics();

  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-link-wrapper"
        onClick={() => trackEvent('view_product', { productId: product.id, productName: product.name })}
      >
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <button
        className="add-to-cart-btn-below"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product);
          trackEvent('add_to_cart', { productId: product.id, productName: product.name, price: product.price });
        }}
      >
        {t('addToCart')}
      </button>
      <style>{`
        .product-card {
          margin-bottom: var(--spacing-md);
          background: var(--color-surface);
          padding: 1rem;
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          border-color: var(--color-accent);
        }
        .product-link-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-decoration: none; /* No underline for link contents */
        }
        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          margin-bottom: var(--spacing-sm);
          aspect-ratio: 4/5;
          border-radius: var(--radius-sm);
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
        
        .product-info {
          text-align: center;
          padding-top: 0.5rem;
          margin-bottom: 1rem;
        }
        .product-name {
          font-size: 1rem;
          font-family: var(--font-heading);
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-text);
        }
        .product-price {
          color: var(--color-accent);
          font-weight: 700;
          font-size: 0.95rem;
        }

        .add-to-cart-btn-below {
            width: 100%;
            padding: 0.6rem;
            background: transparent;
            color: var(--color-text);
            text-transform: uppercase;
            font-size: 0.8rem;
            font-weight: 400;
            letter-spacing: 0.1em;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-heading);
        }
        .add-to-cart-btn-below:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
            background: rgba(212, 175, 55, 0.05);
        }
      `}</style>
    </div>
  );
}
