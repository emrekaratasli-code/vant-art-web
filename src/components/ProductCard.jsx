import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice, t } = useLanguage();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link-wrapper">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
          <button
            className="add-to-cart-overlay"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation when clicking the button
              addToCart(product);
            }}
          >
            {t('addToCart')}
          </button>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <style>{`
        .product-card {
          margin-bottom: var(--spacing-md);
          background: var(--color-surface);
          padding: 1rem;
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
          border-radius: var(--radius-sm);
        }
        .product-card:hover {
          border-color: var(--color-accent);
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
        .add-to-cart-overlay {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%) translateY(100%);
          width: 90%;
          padding: 0.8rem;
          background: var(--color-accent);
          color: var(--color-bg);
          text-transform: uppercase;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border: none;
          border-radius: var(--radius-lg);
          transition: transform 0.3s ease, background-color 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        /* Always show button on touch devices or hover */
        @media (hover: hover) {
            .product-card:hover .add-to-cart-overlay {
              transform: translateX(-50%) translateY(0);
            }
        }
        /* On mobile, maybe always show or use a different interaction? 
           For now we stick to hover/focus logic but make it touch friendly. 
           Actually, let's keep the hover effect for desktop and maybe show icon on mobile.
           But request was 'finger friendly'. Let's make it always visible on mobile or easy to trigger.
           Let's stick to the hover effect which works on tap on mobile usually (first tap hovers).
        */
        
        .add-to-cart-overlay:hover {
          background: var(--color-accent-hover);
          cursor: pointer;
        }
        .product-info {
          text-align: center;
          padding-top: 0.5rem;
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
      `}</style>
    </div>
  );
}
