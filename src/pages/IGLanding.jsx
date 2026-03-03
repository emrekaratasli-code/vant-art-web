import { Link } from 'react-router-dom';

// Static landing page for Instagram/Facebook in-app browsers
// React-free, crash-proof alternative
export default function IGLanding() {
    const handleOpenInBrowser = () => {
        // Try to open in external browser
        const url = 'https://www.vantonline.com/?openExternal=1';
        window.open(url, '_blank');
    };

    const handleCopyLink = () => {
        const url = 'https://www.vantonline.com';
        navigator.clipboard.writeText(url).then(() => {
            alert('Link kopyalandı! Tarayıcınıza yapıştırarak açabilirsiniz.');
        }).catch(() => {
            // Fallback if clipboard fails
            prompt('Bu linki kopyalayın:', url);
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            color: '#fff',
            fontFamily: "'Inter', system-ui, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
        }}>
            {/* Logo */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontFamily: "'Playfair Script', serif",
                    color: '#d4af37',
                    marginBottom: '0.5rem',
                    letterSpacing: '2px'
                }}>
                    VANT
                </h1>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#aaa',
                    letterSpacing: '3px',
                    textTransform: 'uppercase'
                }}>
                    Premium Streetwear & Art
                </p>
            </div>

            {/* Hero Image Placeholder */}
            <div style={{
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1/1',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                borderRadius: '8px',
                marginBottom: '2rem',
                border: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>
                    ✨ VANT Collection
                </div>
            </div>

            {/* Message */}
            <div style={{ maxWidth: '500px', marginBottom: '2rem' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: '#d4af37'
                }}>
                    Daha İyi Bir Deneyim İçin
                </h2>
                <p style={{
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#ccc',
                    marginBottom: '1.5rem'
                }}>
                    VANT'ın tam özellikli mağazasını görmek için lütfen tarayıcınızda açın.
                </p>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#888',
                    lineHeight: 1.5
                }}>
                    Instagram/Facebook içinde açtığınız için sınırlı özelliklere sahipsiniz.
                    Alışveriş yapabilmek için Safari veya Chrome'da açmanız gerekmektedir.
                </p>
            </div>

            {/* Primary Button */}
            <button
                onClick={handleOpenInBrowser}
                style={{
                    padding: '1rem 2.5rem',
                    background: '#d4af37',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    width: '100%',
                    maxWidth: '300px',
                    transition: 'opacity 0.2s'
                }}
                onMouseDown={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseUp={(e) => e.currentTarget.style.opacity = '1'}
            >
                📱 Tarayıcıda Aç
            </button>

            {/* Copy Link Button */}
            <button
                onClick={handleCopyLink}
                style={{
                    padding: '0.875rem 2rem',
                    background: 'transparent',
                    color: '#d4af37',
                    border: '2px solid #d4af37',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    width: '100%',
                    maxWidth: '300px'
                }}
            >
                📋 Linki Kopyala
            </button>

            {/* Link Display */}
            <div style={{
                padding: '0.75rem 1rem',
                background: '#1a1a1a',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#d4af37',
                fontFamily: 'monospace',
                marginBottom: '2rem',
                wordBreak: 'break-all',
                border: '1px solid #333'
            }}>
                https://www.vantonline.com
            </div>

            {/* Instructions */}
            <div style={{
                maxWidth: '400px',
                padding: '1.5rem',
                background: '#1a1a1a',
                borderRadius: '8px',
                border: '1px solid #333',
                marginBottom: '2rem'
            }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#aaa',
                    lineHeight: 1.6,
                    marginBottom: '0.5rem'
                }}>
                    <strong style={{ color: '#d4af37' }}>Nasıl açılır?</strong>
                </p>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#888',
                    lineHeight: 1.6
                }}>
                    Sağ üstteki <strong style={{ color: '#fff' }}>⋯</strong> menüye tıklayın,
                    sonra <strong style={{ color: '#fff' }}>"Tarayıcıda Aç"</strong> veya
                    <strong style={{ color: '#fff' }}> "Open in Browser"</strong> seçeneğini seçin.
                </p>
            </div>

            {/* Footer */}
            <div style={{
                fontSize: '0.75rem',
                color: '#666',
                marginTop: 'auto',
                paddingTop: '2rem'
            }}>
                <p>© 2026 VANT — Wearable Art</p>
                <p style={{ marginTop: '0.5rem' }}>
                    <Link to="/safe" style={{ color: '#888', textDecoration: 'underline' }}>
                        Test Mode
                    </Link>
                </p>
            </div>
        </div>
    );
}
