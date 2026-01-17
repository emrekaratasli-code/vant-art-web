import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useWishlist } from '../context/WishlistContext'; // Import Added

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice, t } = useLanguage();
  const { trackEvent } = useAnalytics();
  const { toggleWishlist, isInWishlist } = useWishlist(); // Hook Added

  const isFav = isInWishlist(product.id);

  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-link-wrapper"
        onClick={() => trackEvent('view_product', { productId: product.id, productName: product.name })}
      >
        <div className="product-image-wrapper">
          {/* Wishlist Button Added */}
          <button
            className={`wishlist-btn ${isFav ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="img-primary"
            loading="lazy"
            decoding="async"
          />
          {product.images && product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className="img-hover"
              loading="lazy"
            />
          )}
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
          transition: opacity 0.5s ease, transform 0.5s ease;
          position: absolute;
          top: 0;
          left: 0;
        }
        .img-primary {
            opacity: 1;
            z-index: 1;
        }
        .img-hover {
            opacity: 0;
            z-index: 2;
        }
        .product-card:hover .img-hover {
            opacity: 1;
            transform: scale(1.05);
        }
        .product-card:hover .img-primary {
            opacity: 0;
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

        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          background: rgba(0,0,0,0.5);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          color: white;
        }
        .wishlist-btn:hover {
          transform: scale(1.1);
          background: rgba(0,0,0,0.7);
        }
        .wishlist-btn.active {
          color: #d4af37;
        }
        .wishlist-btn svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        .wishlist-btn.active svg {
          fill: currentColor;
          stroke: none;
        }
      `}</style>
    </div>
  );
}
