import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';

import Contact from './components/Contact';
import OurStory from './components/OurStory';
import { useLanguage } from './context/LanguageContext';

function AppContent() {
  const { t } = useLanguage();

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProductGrid />
              </>
            } />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/vant-secret-admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <CartSidebar />
        <footer style={{
          textAlign: 'center',
          padding: '3rem 2rem', // Increased padding
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-border)',
          marginTop: '4rem',
          background: 'var(--color-surface)'
        }}>
          <div className="social-links" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {/* Social Icons - Using simple text/emoji for demo, ideally replaced with SVG icons or FontAwesome */}
            <a href="https://instagram.com/vantartonline" target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-accent)' }}>📸</a>
            <a href="https://tiktok.com/@vant.taki.aksesuar" target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-accent)' }}>🎵</a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-accent)' }}>💬</a>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="/our-story" style={{ color: 'var(--color-text)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('navStory')}</a>
            <a href="/contact" style={{ color: 'var(--color-text)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('navContact')}</a>
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="#" className="legal-link">{t('legalReturnPolicy')}</a>
            <a href="#" className="legal-link">{t('legalPrivacyPolicy')}</a>
            <a href="#" className="legal-link">{t('legalSalesAgreement')}</a>
          </div>
          &copy; 2025 VANT ART. {t('footerCopyright')}
        </footer>
        <style>{`
          .legal-link {
            color: var(--color-text-muted);
            text-decoration: none;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: color 0.3s;
            position: relative;
          }
          .legal-link:hover {
            color: var(--color-accent);
          }
          .legal-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -2px;
            left: 0;
            background-color: var(--color-accent);
            transition: width 0.3s;
          }
          .legal-link:hover::after {
            width: 100%;
          }
        `}</style>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
