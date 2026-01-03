import React from 'react';

class ErrorBoundaryInternal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#000',
                    color: '#d4af37',
                    fontFamily: 'serif',
                    padding: '2rem',
                    textAlign: 'center',
                    overflow: 'auto'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '2px' }}>Something went wrong</h1>
                    <p style={{ color: '#999', marginBottom: '2rem', maxWidth: '600px' }}>
                        Bir hata oluştu. Hata detayları aşağıdadır:
                    </p>

                    {/* DIAGNOSTIC INFO */}
                    <div style={{
                        background: '#111',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        textAlign: 'left',
                        marginBottom: '2rem',
                        maxWidth: '900px',
                        width: '100%',
                        overflowX: 'auto',
                        border: '1px solid #333',
                        color: '#ef4444',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '10px' }}>
                            {this.state.error && this.state.error.toString()}
                        </strong>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#888', lineHeight: '1.5' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 30px',
                                background: '#d4af37',
                                color: '#000',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                borderRadius: '4px'
                            }}
                        >
                            YENİLE / RELOAD
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                padding: '12px 30px',
                                background: 'transparent',
                                border: '1px solid #333',
                                color: '#fff',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                borderRadius: '4px'
                            }}
                        >
                            ANA SAYFA
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundaryInternal;
