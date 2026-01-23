import ProductCard from './ProductCard';
import { useProduct } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRE_LAUNCH_MODE } from '../lib/constants';
import ComingSoon from './ComingSoon';

// Slugify Helper: Handles Turkish chars and normalization
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export default function ProductGrid() {
  const { products, loading } = useProduct();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const { t } = useLanguage(); // Removed language

  // If Pre-launch mode is active, FORCE Coming Soon view.
  // If not pre-launch, check if we have products.
  if (PRE_LAUNCH_MODE) {
    return <ComingSoon />;
  }

  // If loading, show nothing or spinner (handled by parent/context usually, or add here)
  if (loading) return null;

  // Use static fallback if empty (handled in Context), but if context failed entirely:
  if (!products || products.length === 0) {
    return <ComingSoon />;
  }


  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter(p => {
      // 1. Show all if no filter or 'all'
      if (!categoryFilter || categoryFilter.toLowerCase() === 'all') return true;

      const pSlug = slugify(p.category);
      const urlSlug = slugify(categoryFilter);

      // 2. Direct partial match (contains) for leniency
      // e.g. 'yuzuk' matches 'yuzukler'
      return pSlug.includes(urlSlug) || urlSlug.includes(pSlug);
    });
  }, [products, categoryFilter]);

  // Debugging Frontend Sync
  useEffect(() => {
    if (!loading) {
      console.log('🛒 ProductGrid Filter Logic (Final):');
      console.log('   - Raw Category Filter:', categoryFilter);
      console.log('   - Normalized URL:', slugify(categoryFilter));
      console.log('   - Total P:', products.length, 'Filtered:', filteredProducts.length);
    }
  }, [products, categoryFilter, filteredProducts.length, loading]);

  if (loading) {
    return (
      <section className="product-section" id="shop">
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 className="section-title">Ürünler Yükleniyor...</h2>
        </div>
      </section>
    );
  }

  console.log('🎨 Rendering Products:', filteredProducts);

  return (
    <section className="product-section" id="shop">
      <div className="container">
        <h2 className="section-title">
          {categoryFilter ? categoryFilter.toUpperCase() : t('sectionTitle')}
        </h2>

        {/* VISUAL DEBUG WARNING: Only if NOT loading and result is 0 but products exist */}
        {products.length > 0 && filteredProducts.length === 0 && (
          <div style={{ padding: '1rem', background: '#ffeebb', color: '#b22222', marginBottom: '1rem', borderRadius: '4px', textAlign: 'center' }}>
            <strong>⚠️ No Match Found</strong><br />
            URL expects: "{slugify(categoryFilter)}"<br />
            Available: {Array.from(new Set(products.map(p => slugify(p.category)))).join(', ')}
          </div>
        )}

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              {products.length === 0 ? 'Henüz ürün eklenmemiş.' : 'Bu kategoride ürün bulunamadı.'}
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
