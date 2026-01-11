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

  // Category Mapping (English/Slugs -> Turkish DB Names)
  const categoryMap = {
    'rings': 'Yüzükler',
    'necklaces': 'Kolyeler',
    'earrings': 'Küpeler',
    'bracelets': 'Bileklikler',
    'sets': 'Setler',
    'all': 'all'
  };

  // Helper to normalize strings
  const normalize = (str) => str ? str.toLowerCase().trim() : '';

  // Filter Logic with Mapping
  const filteredProducts = products.filter(p => {
    const rawFilter = normalize(categoryFilter);

    // 1. Show all if no filter or 'all'
    if (!rawFilter || rawFilter === 'all') return true;

    // 2. Determine target category name (from map or raw)
    // If the URL is ?category=rings, we look for 'Yüzükler'. 
    // If map fails, we look for 'rings' directly.
    const targetCategory = categoryMap[rawFilter] || rawFilter;

    const pCat = normalize(p.category);
    const tCat = normalize(targetCategory);

    return pCat === tCat;
  });

  // Debugging Frontend Sync
  useEffect(() => {
    console.log('🛒 ProductGrid Filter Logic:');
    console.log('   - URL Filter:', categoryFilter);
    console.log('   - Mapped Target:', categoryMap[normalize(categoryFilter)] || categoryFilter);
    console.log('   - Total P:', products.length, 'Filtered:', filteredProducts.length);

    if (products.length > 0 && filteredProducts.length === 0) {
      console.warn('⚠️ VISUAL MISMATCH! Showing warning on screen.');
    }
  }, [products, categoryFilter, filteredProducts.length]);

  console.log('🎨 Rendering Products:', filteredProducts);

  return (
    <section className="product-section" id="shop">
      <div className="container">
        <h2 className="section-title">
          {filteredProducts.length > 0 ? (categoryFilter ? categoryFilter.toUpperCase() : t('sectionTitle')) : 'Ürünler Yükleniyor...'}
        </h2>

        {/* VISUAL DEBUG WARNING */}
        {products.length > 0 && filteredProducts.length === 0 && (
          <div style={{ padding: '1rem', background: '#ffeebb', color: '#b22222', marginBottom: '1rem', borderRadius: '4px', textAlign: 'center', border: '1px solid #eebb00' }}>
            <strong>🛑 Hata Ayıklama Modu:</strong> Ürünler veritabanından geldi ({products.length} adet) ancak kategori filtresine takıldı.
            <br />
            Aranan Kategori: <strong>{categoryFilter}</strong> (Map: {categoryMap[normalize(categoryFilter)] || 'Yok'})
            <br />
            Mevcut Kategoriler: {Array.from(new Set(products.map(p => p.category))).join(', ')}
          </div>
        )}

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Only show 'No products' if we really have no products at all (and not just a mismatch)
            products.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                Henüz ürün eklenmemiş.
              </div>
            ) : null
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
