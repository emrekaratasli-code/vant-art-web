import { Link } from 'react-router-dom';

// Safe fallback for disabled routes in Instagram WebView
export default function SafeFallback({ title, route }) {
    return (
        <div style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '4rem auto',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            background: '#000',
            color: '#fff',
            minHeight: '50vh'
        }}>
            <div style={{
                padding: '2rem',
                background: '#1a1a1a',
                borderRadius: '8px',
                border: '2px solid #d4af37'
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: '#d4af37'
                }}>
                    {title || 'Route Disabled'}
                </h1>

                <p style={{
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                    color: '#aaa'
                }}>
                    This route is temporarily disabled in Instagram's in-app browser for stability.
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        Current route: <code style={{ color: '#d4af37' }}>{route}</code>
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Please open in a standard browser for full experience.
                    </p>
                </div>

                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        padding: '0.75rem 2rem',
                        background: '#d4af37',
                        color: '#000',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    Back to Homepage
                </Link>
            </div>
        </div>
    );
}
