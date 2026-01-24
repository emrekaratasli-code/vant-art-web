// Global production error capture for Instagram WebView debugging
// Since IG WebView has no DevTools, we capture errors to localStorage

if (typeof window !== 'undefined' && import.meta.env.PROD) {
    // Capture JavaScript errors
    window.addEventListener('error', (event) => {
        const errorData = {
            timestamp: new Date().toISOString(),
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack || 'No stack trace',
            userAgent: navigator.userAgent
        };

        try {
            localStorage.setItem('vant_last_error', JSON.stringify(errorData));
            console.error('Error captured:', errorData);
        } catch (e) {
            // Silently fail if localStorage is unavailable
        }
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const errorData = {
            timestamp: new Date().toISOString(),
            message: `Unhandled Promise Rejection: ${event.reason}`,
            source: 'Promise',
            stack: event.reason?.stack || String(event.reason),
            userAgent: navigator.userAgent
        };

        try {
            localStorage.setItem('vant_last_error', JSON.stringify(errorData));
            console.error('Promise rejection captured:', errorData);
        } catch (e) {
            // Silently fail
        }
    });

    console.log('📡 Production error capture active');
}
