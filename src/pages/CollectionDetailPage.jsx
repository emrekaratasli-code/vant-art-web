import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { IS_IG_WEBVIEW, ROUTE_FLAGS } from '../lib/webview';
import SafeFallback from '../components/SafeFallback';

export default function CollectionDetailPage() {
  const { collectionName } = useParams();
  const { products, loading } = useProduct();
  const { language } = useLanguage();

  // BINARY ISOLATION: Disable route if flag is false
  if (IS_IG_WEBVIEW && !ROUTE_FLAGS.collectionDetail) {
    return <SafeFallback title="Collection Detail" route={`/collection/${collectionName}`} />;
  }

  if (loading) return null;

  // MANDATORY GUARD: Ensure products is valid array
  if (!products || !Array.isArray(products)) {
    // SAFE: Always return valid JSX, never undefined
    return (
      <div style={{ padding: '4rem', textAlign: 'center', minHeight: '50vh' }}>
        <h2>Loading collections...</h2>
        <Link to="/collections" style={{ color: '#d4af37', textDecoration: 'underline' }}>Back to Collections</Link>
      </div>
    );
  }

  const decodedCollectionName = decodeURIComponent(collectionName);
  // SAFE: Normalize array before filter (no crash if undefined)
  const safeProducts = Array.isArray(products) ? products : [];
  const collectionProducts = safeProducts.filter(p => p?.collection === decodedCollectionName);

  // CRITICAL: Safe fallback for not found (NEVER return empty/undefined JSX)
  if (!collectionProducts || collectionProducts.length === 0) {
    return (
      <div style={{
        padding: '4rem',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#d4af37' }}>Collection Not Found</h1>
        <p style={{ marginBottom: '2rem', color: '#aaa' }}>The collection "{decodedCollectionName}" does not exist.</p>
        <Link
          to="/collections"
          style={{
            padding: '0.75rem 2rem',
            background: '#d4af37',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Collections
        </Link>
      </div>
    );
  }

  // Collection metadata
  const collectionMeta = {
    "Atelier 01": {
      title: "ATELIER 01",
      subtitle: "The first drop from our studio.",
      philosophy: "Raw silver. Organic cotton. Limited by design.",
      story: "This collection marks the beginning. Every piece in Atelier 01 carries the weight of the first stroke—unpolished, intentional, honest. We cast from wax, hand-finish under magnification, and screen-print our values onto heavyweight cotton. This isn't about perfection. It's about presence.",
      materials: {
        primary: "925 Sterling Silver, 100% Organic Cotton",
        weight: "220gsm–240gsm textiles",
        finish: "Oxidized silver, hand-polished edges"
      },
      mood: "Foundational. Elemental. Uncompromising.",
      heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop"
    },
    "Noir Series": {
      title: "NOIR SERIES",
      subtitle: "Darkness as canvas.",
      philosophy: "Oxidized finishes. Black as statement.",
      story: "Black is not the absence of color—it's the presence of depth. The Noir Series embraces shadow, texture, and the beauty of controlled decay. Obsidian stones. Oxidized silver that darkens with wear. Charcoal textiles that refuse to fade into background. For those who understand that darkness is not a void, but a stage.",
      materials: {
        primary: "Obsidian, Oxidized Sterling Silver, Heavy Cotton",
        weight: "240gsm–400gsm textiles",
        finish: "Matte black, intentional patina"
      },
      mood: "Bold. Edgy. Unapologetic.",
      heroImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop"
    },
    "Luna Collection": {
      title: "LUNA COLLECTION",
      subtitle: "Celestial inspiration.",
      philosophy: "Pearls and precious stones. Timeless elegance.",
      story: "The moon doesn't compete with the sun. It simply exists, reflecting light in its own rhythm. Luna pieces are quiet statements—pearls with natural imperfections, sapphires set in minimal settings, gold chains that catch light without demanding it. Wearable subtlety for those who don't need to announce their presence.",
      materials: {
        primary: "Freshwater Pearls, Sapphire, 14k-18k Gold",
        weight: "Lightweight chains, delicate settings",
        finish: "High polish, natural luster"
      },
      mood: "Ethereal. Delicate. Refined.",
      heroImage: "https://images.unsplash.com/photo-1599643477877-5313557d87bc?q=80&w=1200&auto=format&fit=crop"
    },
    "Contemporary Edge": {
      title: "CONTEMPORARY EDGE",
      subtitle: "Modern minimalism meets crafted precision.",
      philosophy: "For the now.",
      story: "Clean lines. Precise angles. No nostalgia. Contemporary Edge exists in the present tense—geometric forms, rose gold accents, pieces that work with today's silhouettes. Not minimalist for the sake of trend, but minimal because excess has been carved away. What remains is intentional.",
      materials: {
        primary: "18k Rose Gold, Platinum, Recycled Poly Blend",
        weight: "Lightweight metals, technical fabrics",
        finish: "Brushed metal, sharp edges"
      },
      mood: "Sharp. Clean. Present.",
      heroImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
    }
  };

  const meta = collectionMeta[decodedCollectionName] || {
    title: decodedCollectionName.toUpperCase(),
    subtitle: "A curated collection.",
    philosophy: "Craft. Culture. Limited release.",
    story: "Each piece tells a story.",
    materials: { primary: "Various materials" },
    mood: "Unique.",
    heroImage: collectionProducts[0]?.image
  };

  // Separate jewelry and apparel for cross-context display
  const jewelry = collectionProducts.filter(p => p.category !== "Wearable Art");
  const apparel = collectionProducts.filter(p => p.category === "Wearable Art");

  const content = {
    TR: {
      backLink: "← Koleksiyonlara Dön",
      materialsTitle: "MALZEMELER",
      piecesTitle: "KOLEKSİYONDAKİ PARÇALAR",
      jewelryLabel: "Takılar",
      apparelLabel: "Giyilebilir Sanat",
      allPieces: "Tüm Parçalar"
    },
    EN: {
      backLink: "← Back to Collections",
      materialsTitle: "MATERIALS",
      piecesTitle: "PIECES IN THIS COLLECTION",
      jewelryLabel: "Jewelry",
      apparelLabel: "Wearable Art",
      allPieces: "All Pieces"
    }
  };

  const t = content[language] || content['EN'];

  return (
    <div className="collection-detail">
      {/* Back Link */}
      <div className="container">
        <Link to="/collections" className="back-link">{t.backLink}</Link>
      </div>

      {/* Hero Section */}
      <section className="collection-hero">
        <div className="hero-image-wrapper">
          <img src={meta.heroImage} alt={meta.title} loading="eager" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <h1 className="collection-title">{meta.title}</h1>
          <p className="collection-subtitle">{meta.subtitle}</p>
        </div>
      </section>

      {/* Philosophy Block */}
      <section className="collection-philosophy">
        <div className="container">
          <p className="philosophy-statement">{meta.philosophy}</p>
          <div className="mood-tag">{meta.mood}</div>
        </div>
      </section>

      {/* Story Block (Vertical Scroll Storytelling) */}
      <section className="collection-story">
        <div className="container story-container">
          <p className="story-text">{meta.story}</p>
        </div>
      </section>

      {/* Materials Block */}
      <section className="collection-materials">
        <div className="container">
          <h3 className="materials-title">{t.materialsTitle}</h3>
          <div className="materials-grid">
            <div className="material-item">
              <span className="material-label">Primary</span>
              <span className="material-value">{meta.materials.primary}</span>
            </div>
            {meta.materials.weight && (
              <div className="material-item">
                <span className="material-label">Weight</span>
                <span className="material-value">{meta.materials.weight}</span>
              </div>
            )}
            <div className="material-item">
              <span className="material-label">Finish</span>
              <span className="material-value">{meta.materials.finish}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Philosophy → Product Rhythm */}
      <section className="collection-products">
        <div className="container">
          <h2 className="section-heading">{t.piecesTitle}</h2>

          {/* Jewelry + Apparel Cross-Context Display */}
          {jewelry.length > 0 && apparel.length > 0 ? (
            <>
              {/* Jewelry Section */}
              <div className="product-category-section">
                <h3 className="category-label">{t.jewelryLabel}</h3>
                <div className="product-grid-editorial">
                  {jewelry.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              {/* Separator with philosophy */}
              <div className="category-separator">
                <p className="text-whisper">
                  One collection. Two mediums. Infinite expression.
                </p>
              </div>

              {/* Apparel Section */}
              <div className="product-category-section">
                <h3 className="category-label">{t.apparelLabel}</h3>
                <div className="product-grid-editorial">
                  {apparel.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* All Products Together if only one type */
            <div className="product-grid-editorial">
              {collectionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .collection-detail {
          background: var(--color-bg);
          color: var(--color-text);
        }

        .back-link {
          display: inline-block;
          padding: var(--spacing-md) 0;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: var(--color-accent);
        }

        /* Hero Section */
        .collection-hero {
          position: relative;
          height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: var(--spacing-xl);
        }

        .hero-image-wrapper {
          position: absolute;
          inset: 0;
        }

        .hero-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, 
            rgba(0,0,0,0.3) 0%, 
            rgba(0,0,0,0.7) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 var(--spacing-sm);
        }

        .collection-title {
          font-size: clamp(3rem, 8vw, 6rem);
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
          color: #fff;
          font-weight: 400;
        }

        .collection-subtitle {
          font-size: clamp(1.25rem, 3vw, 2rem);
          color: rgba(255,255,255,0.9);
          font-family: var(--font-script);
          font-style: italic;
        }

        /* Philosophy Block */
        .collection-philosophy {
          padding: var(--spacing-xl) 0;
          text-align: center;
          background: var(--color-surface);
        }

        .philosophy-statement {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-family: var(--font-heading);
          color: var(--color-accent);
          max-width: 800px;
          margin: 0 auto var(--spacing-md);
          line-height: 1.4;
          letter-spacing: 0.05em;
        }

        .mood-tag {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          border: 1px solid var(--color-border);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: var(--color-text-whisper);
          text-transform: uppercase;
        }

        /* Story Block - Vertical Scroll Storytelling */
        .collection-story {
          padding: var(--spacing-xl) 0;
        }

        .story-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .story-text {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 2;
          color: var(--color-text-muted);
          font-weight: 300;
          text-align: left;
        }

        /* Materials Block */
        .collection-materials {
          padding: var(--spacing-xl) 0;
          background: var(--color-bg-warm);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .materials-title {
          font-size: 1rem;
          letter-spacing: 0.2em;
          margin-bottom: var(--spacing-lg);
          text-align: center;
          color: var(--color-accent);
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          max-width: 800px;
          margin: 0 auto;
        }

        .material-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: var(--spacing-sm);
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-sm);
        }

        .material-label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-whisper);
        }

        .material-value {
          font-size: 0.95rem;
          color: var(--color-text);
          font-weight: 400;
        }

        /* Products Section */
        .collection-products {
          padding: var(--spacing-xl) 0;
        }

        .section-heading {
          text-align: center;
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: var(--spacing-xl);
          letter-spacing: 0.15em;
        }

        .product-category-section {
          margin-bottom: var(--spacing-xl);
        }

        .category-label {
          font-size: 1.25rem;
          letter-spacing: 0.15em;
          margin-bottom: var(--spacing-lg);
          text-align: center;
          color: var(--color-accent-muted);
        }

        .product-grid-editorial {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .category-separator {
          text-align: center;
          padding: var(--spacing-xl) 0;
          margin: var(--spacing-xl) 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .category-separator .text-whisper {
          font-size: 1rem;
          font-style: italic;
          margin: 0 auto;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .collection-hero {
            height: 50vh;
          }

          .collection-title {
            font-size: 2.5rem;
          }

          .philosophy-statement {
            font-size: 1.5rem;
          }

          .story-text {
            font-size: 1.1rem;
            line-height: 1.8;
          }

          .materials-grid {
            grid-template-columns: 1fr;
          }

          .product-grid-editorial {
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-sm);
          }

          .collection-story,
          .collection-materials,
          .collection-products {
            padding: var(--spacing-lg) 0;
          }
        }
      `}</style>
    </div>
  );
}
