import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { legalContent } from '../data/legal-content';

function LegalDocument({ type }) {
    const { language } = useLanguage();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const content = legalContent[language][type];

    if (!content) return <div className="container" style={{ padding: '4rem 0' }}>Document not found</div>;

    // Simple markdown-like parser for the content
    const renderContent = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.trim().startsWith('### ')) {
                return <h3 key={index} style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-accent)',
                    marginTop: '2rem',
                    marginBottom: '1rem',
                    fontSize: '1.25rem'
                }}>{line.replace('### ', '')}</h3>;
            }
            if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                return <p key={index} style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                    {line.replace(/\*\*/g, '')}
                </p>;
            }
            if (line.trim() === '') return null;

            // Bold text within paragraph
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} style={{ color: 'var(--color-text)' }}>{part.replace(/\*\*/g, '')}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <section style={{ padding: '8rem 0 4rem', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    color: 'var(--color-text)'
                }}>{content.title}</h1>

                <div style={{
                    background: 'var(--color-surface)',
                    padding: '3rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px'
                }}>
                    {renderContent(content.content)}
                </div>
            </div>
        </section>
    );
}

export default LegalDocument;
