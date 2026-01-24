// Instagram WebView Detection & Feature Flags
// LOCKED: React 18.2.0 + ES2017 + No StrictMode

// Detect Instagram in-app browser
export const IS_IG_WEBVIEW =
    typeof navigator !== 'undefined' &&
    /Instagram/i.test(navigator.userAgent);

// Detect other WebView environments
export const IS_FACEBOOK_WEBVIEW =
    typeof navigator !== 'undefined' &&
    /FBAN|FBAV/i.test(navigator.userAgent);

export const IS_ANY_WEBVIEW = IS_IG_WEBVIEW || IS_FACEBOOK_WEBVIEW;

// Feature flags: Disable risky features in WebView
export const FLAGS = {
    // Animations: Disable in IG WebView (CSS/JS animations can crash)
    animations: !IS_IG_WEBVIEW,

    // Heavy effects: backdrop-filter, large shadows, gradients
    heavyEffects: !IS_IG_WEBVIEW,

    // Portals: createPortal can cause rendering issues
    portals: !IS_IG_WEBVIEW,

    // Video: Autoplay and heavy video backgrounds
    videoAutoplay: !IS_IG_WEBVIEW,

    // Intersection Observer: Can be inconsistent
    intersectionObserver: !IS_IG_WEBVIEW,

    // Smooth scroll: Can conflict with WebView scroll handling
    smoothScroll: !IS_IG_WEBVIEW,
};

// User agent for debugging
export const USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR';

// App version (will be injected via env)
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'unknown';

// Commit hash (will be injected via env)
export const COMMIT_HASH = import.meta.env.VITE_COMMIT_HASH || 'dev';
