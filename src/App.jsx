import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import CartPage from './components/CartPage';
import ProfilePage from './components/ProfilePage';
import CheckoutPage from './components/CheckoutPage';
import AdminPanel from './components/AdminPanel';
import LegalDocument from './components/LegalDocuments';
import BottomNav from './components/BottomNav';
import ProductDetail from './components/ProductDetail';
import Contact from './components/Contact';
import OurStory from './components/OurStory';
import { useLanguage } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Preloader from './components/Preloader';
import CookieBanner from './components/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';

function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdmin && <Header />}
      <main style={isAdmin ? { padding: 0 } : {}}>
        {children}
      </main>
      {!isAdmin && (
        <>
          <CartSidebar />
          <BottomNav />
          <Footer />
        </>
      )}
    </div>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="luxury-bg" style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      fontSize: '0.75rem',
      color: 'var(--color-text-muted)',
      borderTop: '1px solid var(--color-border)',
      marginTop: 'auto',
      /* background removed to use luxury-bg */
      paddingBottom: '6rem' // Space for bottom nav
    }}>
      <div className="social-links" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <a href="https://instagram.com/vantartonline" target="_blank" rel="noreferrer" className="social-icon" style={{ color: 'var(--color-text)' }}><InstaIcon /></a>
        <a href="https://tiktok.com/@vant.taki.aksesuar" target="_blank" rel="noreferrer" className="social-icon" style={{ color: 'var(--color-text)' }}><TiktokIcon /></a>
        <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="social-icon" style={{ color: 'var(--color-text)' }}><WhatsappIcon /></a>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/our-story" style={{ color: 'var(--color-text)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('navStory')}</Link>
        <Link to="/contact" style={{ color: 'var(--color-text)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('navContact')}</Link>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', opacity: 0.7 }}>
        <Link to="/sozlesmeler/mesafeli-satis" className="legal-link">{t('legalSalesAgreement')}</Link>
        <Link to="/sozlesmeler/iptal-iade" className="legal-link">{t('legalReturnPolicy')}</Link>
        <Link to="/sozlesmeler/gizlilik" className="legal-link">{t('legalPrivacyPolicy')}</Link>
        <Link to="/sozlesmeler/kvkk" className="legal-link">{t('legalKvkk')}</Link>
      </div>
      <div style={{ opacity: 0.5 }}>
        &copy; 2025 VANT ART. {t('footerCopyright')}
      </div>
      <style>{`
          .legal-link {
            color: var(--color-text-muted);
            text-decoration: none;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: color 0.3s;
          }
          .legal-link:hover {
            color: var(--color-accent);
          }
          .social-icon { transition: transform 0.3s; }
          .social-icon:hover { transform: scale(1.1); color: var(--color-accent) !important; }
        `}</style>
    </footer>
  );
}


import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return null; // AuthContext handles main loading, but double check

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'owner' && user.role !== 'admin' && user.role !== 'worker') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<><Hero /><ProductGrid /></>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Legal Routes */}
          <Route path="/sozlesmeler/mesafeli-satis" element={<LegalDocument type="distanceSales" />} />
          <Route path="/sozlesmeler/iptal-iade" element={<LegalDocument type="returnPolicy" />} />
          <Route path="/sozlesmeler/gizlilik" element={<LegalDocument type="privacy" />} />
          <Route path="/sozlesmeler/kvkk" element={<LegalDocument type="kvkk" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Icons
const InstaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);
const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

import { WishlistProvider } from './context/WishlistContext'; // Import Added

import { SettingsProvider } from './context/SettingsContext'; // Import Added

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Preloader />
        <CookieBanner />
        <SettingsProvider> {/* Provider Added */}
          <ProductProvider>
            <ToastProvider>
              <OrderProvider>
                <CartProvider> {/* Cart uses Toast */}
                  <AnalyticsProvider> {/* Analytics is independent */}
                    <WishlistProvider> {/* Wishlist uses Analytics & Toast */}
                      <AuthProvider>
                        <AppContent />
                      </AuthProvider>
                    </WishlistProvider>
                  </AnalyticsProvider>
                </CartProvider>
              </OrderProvider>
            </ToastProvider>
          </ProductProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
