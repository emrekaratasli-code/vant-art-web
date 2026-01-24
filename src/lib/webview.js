// Instagram WebView Detection & Feature Flags
// LOCKED: React 18.2.0 + ES2017 + No StrictMode

// COMPREHENSIVE IN-APP BROWSER DETECTION
// Instagram, Facebook, iOS Chrome in-app - ALL have same iOS WebKit issues
export const isInAppBrowser = () => {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent || '';
    return (
        ua.includes('Instagram') ||
        ua.includes('FBAN') ||
        ua.includes('FBAV') ||
        ua.includes('FB_IAB') ||
        ua.includes('CriOS') ||        // iOS Chrome in-app
        ua.includes('Mobile Safari')   // in-app fallback
    );
};

// CRITICAL: All in-app browsers treated as restricted environment
export const IS_RESTRICTED_ENV = isInAppBrowser();

// Legacy exports for backwards compatibility
export const IS_IG_WEBVIEW = IS_RESTRICTED_ENV;
export const IS_FACEBOOK_WEBVIEW = IS_RESTRICTED_ENV;
export const IS_ANY_WEBVIEW = IS_RESTRICTED_ENV;

// Feature flags: Disable risky features in ALL in-app browsers
export const FLAGS = {
    // Animations: Disable in all in-app browsers (iOS WebKit issue)
    animations: !IS_RESTRICTED_ENV,

    // Heavy effects: backdrop-filter, large shadows, gradients
    heavyEffects: !IS_RESTRICTED_ENV,

    // Portals: createPortal BANNED in in-app browsers
    portals: !IS_RESTRICTED_ENV,

    // Video: Autoplay and heavy video backgrounds
    videoAutoplay: !IS_RESTRICTED_ENV,

    // Intersection Observer: Can be inconsistent
    intersectionObserver: !IS_RESTRICTED_ENV,

    // Smooth scroll: Can conflict with WebView scroll handling
    smoothScroll: !IS_RESTRICTED_ENV,
};

// BINARY ISOLATION: Route-level flags to identify crash source
// Set to false to disable route in IG WebView (forces safe fallback)
export const ROUTE_FLAGS = {
    collections: true,        // /collections
    collectionDetail: true,   // /collection/:name
    productDetail: true,      // /product/:id
};

// User agent for debugging
export const USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR';

// App version (will be injected via env)
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'unknown';

// Commit hash (will be injected via env)
export const COMMIT_HASH = import.meta.env.VITE_COMMIT_HASH || 'dev';
