import { useProduct } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { IS_IG_WEBVIEW, ROUTE_FLAGS } from '../lib/webview';
import SafeFallback from '../components/SafeFallback';

export default function CollectionsPage() {
  const { products, loading } = useProduct();
  const { language } = useLanguage();

  // BINARY ISOLATION: Disable route if flag is false in IG WebView
  if (IS_IG_WEBVIEW && !ROUTE_FLAGS.collections) {
    return <SafeFallback title="Collections" route="/collections" />;
  }

  if (loading) return null;

  // MANDATORY GUARD: Ensure products is valid array
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="collections-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>No collections available</h2>
        </div>
      </div>
    );
  }

  // Extract unique collections (SAFE: normalize array first)
  const safeProducts = Array.isArray(products) ? products : [];
  const collections = [...new Set(safeProducts.map(p => p?.collection).filter(Boolean))];

  // Group products by collection
  const collectionMap = {};
  (products || []).forEach(p => {
    if (p?.collection) {
      if (!collectionMap[p.collection]) {
        collectionMap[p.collection] = [];
      }
      collectionMap[p.collection].push(p);
    }
  });

  const content = {
    TR: {
      title: "KOLEKSİYONLAR",
      subtitle: "Her koleksiyon bir hikaye. Her parça bir anlatı.",
      viewCollection: "Koleksiyonu Gör"
    },
    EN: {
      title: "COLLECTIONS",
      subtitle: "Every collection is a story. Every piece is a narrative.",
      viewCollection: "View Collection"
    }
  };

  const t = content[language] || content['EN'];

  // Collection descriptions
  const collectionInfo = {
    "Atelier 01": {
      description: "The first drop from our studio. Raw silver. Organic cotton. Limited by design.",
      mood: "Foundational. Elemental. Uncompromising."
    },
    "Noir Series": {
      description: "Darkness as canvas. Oxidized finishes. Black as statement.",
      mood: "Bold. Edgy. Unapologetic."
    },
    "Luna Collection": {
      description: "Celestial inspiration. Pearls and precious stones. Timeless elegance.",
      mood: "Ethereal. Delicate. Refined."
    },
    "Contemporary Edge": {
      description: "Modern minimalism meets crafted precision. For the now.",
      mood: "Sharp. Clean. Present."
    }
  };

  return (
    <div className="collections-page">
      <div className="container">
        {/* Header */}
        <div className="collections-header">
          <h1>{t.title}</h1>
          <p className="manifesto-text">{t.subtitle}</p>
        </div>

        {/* Collections Grid */}
        <div className="collections-grid">
          {collections.map(collectionName => {
            const collectionProducts = collectionMap[collectionName] || [];
            const featuredProduct = collectionProducts[0];
            const info = collectionInfo[collectionName] || {};

            return (
              <div key={collectionName} className="collection-card">
                {/* Collection Image */}
                <Link to={`/collection/${encodeURIComponent(collectionName)}`} className="collection-image">
                  <img
                    src={featuredProduct?.image}
                    alt={collectionName}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <span className="view-cta">{t.viewCollection} →</span>
                  </div>
                </Link>

                {/* Collection Info */}
                <div className="collection-info">
                  <h2>{collectionName}</h2>
                  <p className="collection-description">{info.description}</p>
                  <p className="collection-mood text-whisper">{info.mood}</p>
                  <div className="collection-meta">
                    <span className="piece-count">{collectionProducts.length} pieces</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .collections-page {
          padding: var(--spacing-xl) 0;
          min-height: 70vh;
        }

        .collections-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
          padding-top: var(--spacing-lg);
        }

        .collections-header h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: var(--spacing-md);
          letter-spacing: 0.2em;
        }

        .collections-header .manifesto-text {
          margin: 0 auto;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .collection-card {
          background: var(--color-surface);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .collection-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .collection-image {
          position: relative;
          display: block;
          aspect-ratio: 4/5;
          overflow: hidden;
        }

        .collection-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .collection-card:hover .collection-image img {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: var(--spacing-md);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .collection-card:hover .image-overlay {
          opacity: 1;
        }

        .view-cta {
          color: var(--color-accent);
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .collection-info {
          padding: var(--spacing-md);
        }

        .collection-info h2 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: 0.1em;
        }

        .collection-description {
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .collection-mood {
          margin-bottom: var(--spacing-sm);
          font-style: italic;
        }

        .collection-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--color-border);
        }

        .piece-count {
          font-size: 0.8rem;
          color: var(--color-accent-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .collections-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .collection-card {
            max-width: 500px;
            margin: 0 auto;
            width: 100%;
          }

          .collections-header {
            padding-top: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
}
