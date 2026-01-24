import { Link } from 'react-router-dom';

// SAFE MODE: Zero complexity for IG WebView isolation
// No contexts, no hooks (except useState), no portals, no animations

export default function SafeMode() {
    return (
        <div style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif',
            background: '#000',
            color: '#fff',
            minHeight: '100vh'
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>VANT Safe Mode</h1>

            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                This is a minimal test page with ZERO complexity.
            </p>

            <ul style={{ marginBottom: '2rem', lineHeight: 2 }}>
                <li>✅ No Context providers</li>
                <li>✅ No custom hooks</li>
                <li>✅ No portals</li>
                <li>✅ No animations</li>
                <li>✅ No third-party components</li>
                <li>✅ No window/document access</li>
            </ul>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
                <strong>Test Result:</strong> If you can read this in Instagram WebView,
                the crash is caused by a specific component, not React core.
            </div>

            <Link
                to="/"
                style={{
                    display: 'inline-block',
                    marginTop: '2rem',
                    padding: '0.75rem 1.5rem',
                    background: '#d4af37',
                    color: '#000',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}
            >
                Back to Homepage
            </Link>
        </div>
    );
}
