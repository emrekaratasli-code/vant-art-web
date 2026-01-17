import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';
import { AddressProvider } from './context/AddressContext';

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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Preloader from './components/Preloader';
import CookieBanner from './components/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import AtelierPage from './pages/AtelierPage';

import { PRE_LAUNCH_MODE } from './lib/constants'; // Import PRE_LAUNCH_MODE

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

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PreLaunchGuard({ children }) {
  if (PRE_LAUNCH_MODE) {
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

          {/* Commerce Routes - Blocked in Pre-Launch */}
          <Route path="/product/:id" element={
            <PreLaunchGuard>
              <ProductDetail />
            </PreLaunchGuard>
          } />
          <Route path="/cart" element={
            <PreLaunchGuard>
              <CartPage />
            </PreLaunchGuard>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <PreLaunchGuard>
                <CheckoutPage />
              </PreLaunchGuard>
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="/atelier" element={<AtelierPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Legal Routes */}
          <Route path="/sozlesmeler/mesafeli-satis" element={<LegalDocument type="distanceSales" />} />
          <Route path="/sozlesmeler/iptal-iade" element={<LegalDocument type="returnPolicy" />} />
          <Route path="/sozlesmeler/gizlilik" element={<LegalDocument type="privacy" />} />
          <Route path="/sozlesmeler/kvkk" element={<LegalDocument type="kvkk" />} />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}



// Icons moved to specific components or kept if used here (Footer import removed icons from here mostly, but let's check footer usage)
// Actually App.jsx doesn't use these icons, Footer does. 
// I will check if App.jsx uses them. It doesn't seem to.
// Removing icons from App.jsx

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Preloader />
        <CookieBanner />
        <SettingsProvider> {/* Provider Added */}
          <AddressProvider>
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
          </AddressProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
