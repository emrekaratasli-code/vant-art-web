import { USER_AGENT, APP_VERSION, COMMIT_HASH, FLAGS, IS_IG_WEBVIEW, IS_FACEBOOK_WEBVIEW } from '../lib/webview';

// Debug route for production error diagnosis (no console in IG WebView)
export default function DebugPage() {
    // Get last captured error from localStorage
    const lastError = typeof window !== 'undefined'
        ? localStorage.getItem('vant_last_error')
        : null;

    const lastErrorData = lastError ? JSON.parse(lastError) : null;

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            background: '#000',
            color: '#0f0',
            minHeight: '100vh'
        }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#0f0' }}>
                🔍 VANT Debug Console
            </h1>

            {/* Environment Info */}
            <section style={{ marginBottom: '2rem', padding: '1rem', background: '#111', borderLeft: '3px solid #0f0' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Environment</h2>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6 }}>
                    {`App Version: ${APP_VERSION}
Commit Hash: ${COMMIT_HASH}
Build Date: ${new Date().toISOString()}

User Agent:
${USER_AGENT}`}
                </pre>
            </section>

            {/* WebView Detection */}
            <section style={{ marginBottom: '2rem', padding: '1rem', background: '#111', borderLeft: '3px solid #ff0' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>WebView Detection</h2>
                <pre style={{ lineHeight: 1.8 }}>
                    {`Instagram WebView: ${IS_IG_WEBVIEW ? '✅ YES' : '❌ NO'}
Facebook WebView:  ${IS_FACEBOOK_WEBVIEW ? '✅ YES' : '❌ NO'}

Detected Browser: ${IS_IG_WEBVIEW ? 'Instagram In-App Browser' :
                            IS_FACEBOOK_WEBVIEW ? 'Facebook In-App Browser' :
                                'Standard Browser'
                        }`}
                </pre>
            </section>

            {/* Feature Flags */}
            <section style={{ marginBottom: '2rem', padding: '1rem', background: '#111', borderLeft: '3px solid #0af' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Feature Flags</h2>
                <pre style={{ lineHeight: 1.8 }}>
                    {Object.entries(FLAGS).map(([key, value]) =>
                        `${key.padEnd(25)}: ${value ? '✅ Enabled' : '🚫 Disabled'}`
                    ).join('\n')}
                </pre>
            </section>

            {/* Last Error */}
            <section style={{ marginBottom: '2rem', padding: '1rem', background: '#111', borderLeft: '3px solid #f00' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Last Captured Error</h2>
                {lastErrorData ? (
                    <div>
                        <p style={{ marginBottom: '1rem', color: '#f00' }}>
                            <strong>Error Captured:</strong> {new Date(lastErrorData.timestamp).toLocaleString()}
                        </p>
                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: 1.6,
                            background: '#200',
                            padding: '1rem',
                            border: '1px solid #f00'
                        }}>
                            {`Message: ${lastErrorData.message}

Source: ${lastErrorData.source || 'unknown'}
Line: ${lastErrorData.lineno || 'unknown'}
Column: ${lastErrorData.colno || 'unknown'}

Stack:
${lastErrorData.stack || 'No stack trace'}`}
                        </pre>
                    </div>
                ) : (
                    <p style={{ color: '#0f0' }}>✅ No errors captured</p>
                )}
            </section>

            {/* Actions */}
            <section style={{ marginBottom: '2rem', padding: '1rem', background: '#111', borderLeft: '3px solid #fff' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Actions</h2>
                <button
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('vant_last_error');
                            window.location.reload();
                        }
                    }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#f00',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        marginRight: '1rem'
                    }}
                >
                    Clear Error Log
                </button>

                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        background: '#0f0',
                        color: '#000',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                    }}
                >
                    Back to Homepage
                </a>
            </section>

            {/* Test Routes */}
            <section style={{ marginBottom: '2rem', padding: '1rem', background: '#111', borderLeft: '3px solid #f0f' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Test Routes</h2>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
                    <li><a href="/safe" style={{ color: '#0af' }}>/safe</a> - Zero complexity page</li>
                    <li><a href="/" style={{ color: '#0af' }}>/</a> - Homepage</li>
                    <li><a href="/collections" style={{ color: '#0af' }}>/collections</a> - Collections grid</li>
                    <li><a href="/collection/Atelier%2001" style={{ color: '#0af' }}>/collection/Atelier 01</a> - Collection detail</li>
                    <li><a href="/product/3" style={{ color: '#0af' }}>/product/3</a> - Product detail</li>
                </ul>
            </section>

            <footer style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #333', color: '#666', textAlign: 'center' }}>
                <p>VANT Debug Console • Production Error Tracking</p>
                <p style={{ fontSize: '10px', marginTop: '0.5rem' }}>
                    This page is for internal debugging only. Do not share publicly.
                </p>
            </footer>
        </div>
    );
}
