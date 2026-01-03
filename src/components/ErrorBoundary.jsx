import React from 'react';
import { useLanguage } from '../context/LanguageContext';

class ErrorBoundaryInternal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    background: '#000',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <h2 style={{ color: '#d4af37', marginBottom: '1rem', fontFamily: 'serif' }}>Something went wrong</h2>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Bir hata oluştu. Lütfen sayfayı yenileyiniz.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '1rem 2rem',
                            background: '#d4af37',
                            border: 'none',
                            color: '#000',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        YENİLE / RELOAD
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Wrapper to provide Context if needed, but ErrorBoundary should ideally be higher than Contexts that might fail.
// However, since we use LanguageContext for text, we might want to access it, but if LanguageProvider fails, we are doomed anyway.
// Let's keep it simple and static text for safety.
export default ErrorBoundaryInternal;
