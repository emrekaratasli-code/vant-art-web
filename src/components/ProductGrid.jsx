import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

export default function ProductGrid() {
  const { products } = useProducts();
  const { t } = useLanguage();
  const location = useLocation();

  // Parse category from query string
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  // Filter products
  // Filter products (Case Insensitive)
  // Debug: Log what we are comparing
  const filteredProducts = (categoryFilter && categoryFilter.toLowerCase() !== 'all')
    ? products.filter(p => {
      const pCat = p.category?.toLowerCase();
      const fCat = categoryFilter.toLowerCase();
      const match = pCat === fCat;
      // console.log(`🔍 Comparing '${pCat}' === '${fCat}' ? ${match}`); // Trace per item
      return match;
    })
    : products;

  // Debugging Frontend Sync
  useEffect(() => {
    console.log('🛒 ProductGrid Filter Logic:');
    console.log('   - Raw Category Filter:', categoryFilter);
    console.log('   - Total Products:', products.length);
    console.log('   - Filtered Count:', filteredProducts.length);

    if (products.length > 0 && filteredProducts.length === 0) {
      console.warn('⚠️ Mismatch detected! Products exist but none matched the category.');
      console.log('   - Available Product Categories:', products.map(p => p.category));
    }
  }, [products, categoryFilter, filteredProducts.length]);

  console.log('🎨 Rendering Products:', filteredProducts);

  return (
    <section className="product-section" id="shop">
      <div className="container">
        <h2 className="section-title">
          {categoryFilter
            ? (categoryFilter === 'rings' ? 'YÜZÜKLER' :
              categoryFilter === 'necklaces' ? 'KOLYELER' :
                categoryFilter === 'earrings' ? 'KÜPELER' :
                  categoryFilter === 'bracelets' ? 'BİLEKLİKLER' : categoryFilter.toUpperCase())
            : t('sectionTitle')}
        </h2>
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              Bu kategoride ürün bulunamadı.
            </div>
          )}
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
