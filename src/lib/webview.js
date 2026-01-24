// Instagram WebView Detection & Feature Flags
// LOCKED: React 18.2.0 + ES2017 + No StrictMode
// EMERGENCY STABILIZATION: Aggressive feature lockdown for IG WebView

// COMPREHENSIVE IN-APP BROWSER DETECTION
export const IS_IG_WEBVIEW =
    typeof navigator !== 'undefined' &&
    /Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent);

// GLOBAL KILL SWITCH - ALL risky features disabled in IG WebView
export const WEBVIEW_FLAGS = {
    animations: !IS_IG_WEBVIEW,           // NO animations
    portals: !IS_IG_WEBVIEW,              // NO createPortal (Toast, Modal, etc.)
    intersectionObserver: !IS_IG_WEBVIEW, // NO IntersectionObserver
    smoothScroll: !IS_IG_WEBVIEW,         // NO smooth scroll
    imageZoom: !IS_IG_WEBVIEW,            // NO image zoom/lightbox
    heavyEffects: !IS_IG_WEBVIEW,         // NO backdrop-filter, shadows
    videoAutoplay: !IS_IG_WEBVIEW,        // NO video autoplay
};

// Legacy exports for backwards compatibility
export const IS_RESTRICTED_ENV = IS_IG_WEBVIEW;
export const IS_FACEBOOK_WEBVIEW = IS_IG_WEBVIEW;
export const IS_ANY_WEBVIEW = IS_IG_WEBVIEW;
export const FLAGS = WEBVIEW_FLAGS; // Alias

// BINARY ISOLATION: Route-level flags
export const ROUTE_FLAGS = {
    collections: true,
    collectionDetail: true,
    productDetail: true,
};

// Crash tracking for fail-safe
export const hasCrashedBefore = (route) => {
    if (typeof localStorage === 'undefined') return false;
    try {
        const crashed = localStorage.getItem(`vant_crash_${route}`);
        return crashed === 'true';
    } catch {
        return false;
    }
};

export const markRouteCrashed = (route) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(`vant_crash_${route}`, 'true');
    } catch {
        // Silently fail
    }
};

export const clearCrashFlag = (route) => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.removeItem(`vant_crash_${route}`);
    } catch {
        // Silently fail
    }
};

// User agent for debugging
export const USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR';

// App version
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'unknown';
export const COMMIT_HASH = import.meta.env.VITE_COMMIT_HASH || 'dev';
