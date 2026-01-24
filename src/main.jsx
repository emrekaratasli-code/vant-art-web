import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/errorCapture' // Production error tracking for IG WebView
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// StrictMode DISABLED: Instagram WebView incompatibility
// StrictMode causes double-invocation that breaks WebView internals

// 🚨 CRITICAL: PRE-RENDER IG/FB DETECTION
// Redirect to static /ig page BEFORE React mounts
// This prevents ALL crash risks (React never executes)
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  const ua = navigator.userAgent || '';
  const isInAppBrowser = (
    ua.includes('Instagram') ||
    ua.includes('FBAN') ||
    ua.includes('FBAV') ||
    ua.includes('FB_IAB') ||
    ua.includes('FBIOS')
  );

  // Only redirect if not already on /ig or special routes
  const currentPath = window.location.pathname;
  const isSpecialRoute = currentPath === '/ig' ||
    currentPath === '/safe' ||
    currentPath === '/debug';

  if (isInAppBrowser && !isSpecialRoute) {
    // Store intended destination for later
    sessionStorage.setItem('vant_intended_url', window.location.href);
    // Redirect to static landing
    window.location.replace('/ig');
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
