import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductGrid() {
  const { products } = useProducts();
  const { t } = useLanguage();

  return (
    <section className="product-section" id="shop">
      <div className="container">
        <h2 className="section-title">{t('sectionTitle')}</h2>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <style>{`
        .product-section {
          padding: var(--spacing-lg) 0;
          background: var(--color-bg);
          color: var(--color-text);
        }
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
          font-weight: 400;
          color: var(--color-accent);
          letter-spacing: 0.05em;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-md);
        }
        
        @media (max-width: 768px) {
            .product-grid {
                grid-template-columns: 1fr 1fr; /* 2 columns on mobile */
                gap: var(--spacing-sm); /* Smaller gap on mobile */
            }
        }
      `}</style>
    </section>
  );
}
