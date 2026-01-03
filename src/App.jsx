import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import CartPage from './components/CartPage';
import ProfilePage from './components/ProfilePage';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import LegalDocument from './components/LegalDocuments';
import BottomNav from './components/BottomNav';
import ProductDetail from './components/ProductDetail';

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
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/admin" element={<AdminPanel />} />

            {/* Legal Routes */}
            <Route path="/sozlesmeler/mesafeli-satis" element={<LegalDocument type="distanceSales" />} />
            <Route path="/sozlesmeler/iptal-iade" element={<LegalDocument type="returnPolicy" />} />
            <Route path="/sozlesmeler/gizlilik" element={<LegalDocument type="privacy" />} />
            <Route path="/sozlesmeler/kvkk" element={<LegalDocument type="kvkk" />} />
          </Routes>
        </main>

        <CartSidebar />
        <BottomNav />

        <footer style={{
          textAlign: 'center',
          padding: '3rem 2rem', // Increased padding
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-border)',
          marginTop: '4rem',
          background: 'var(--color-surface)',
          paddingBottom: '6rem' // Extra padding for bottom nav
        }}>
          <div className="social-links" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a href="https://instagram.com/vantartonline" target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-accent)' }}>📸</a>
            <a href="https://tiktok.com/@vant.taki.aksesuar" target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-accent)' }}>🎵</a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--color-accent)' }}>💬</a>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link to="/our-story" style={{ color: 'var(--color-text)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('navStory')}</Link>
            <Link to="/contact" style={{ color: 'var(--color-text)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('navContact')}</Link>
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link to="/sozlesmeler/mesafeli-satis" className="legal-link">{t('legalSalesAgreement')}</Link>
            <Link to="/sozlesmeler/iptal-iade" className="legal-link">{t('legalReturnPolicy')}</Link>
            <Link to="/sozlesmeler/gizlilik" className="legal-link">{t('legalPrivacyPolicy')}</Link>
            <Link to="/sozlesmeler/kvkk" className="legal-link">{t('legalKvkk')}</Link>
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

import Preloader from './components/Preloader';

export default function App() {
  return (
    <LanguageProvider>
      <Preloader />
      <ProductProvider>
        <ToastProvider>
          <OrderProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </OrderProvider>
        </ToastProvider>
      </ProductProvider>
    </LanguageProvider>
  );
}
