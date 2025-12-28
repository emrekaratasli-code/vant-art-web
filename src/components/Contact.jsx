import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
    const { t } = useLanguage();
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sent');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <section className="page-section">
            <div className="container">
                <h2 className="section-title">{t('contactTitle')}</h2>
                <div className="content-wrapper">
                    <div className="contact-info">
                        <h3>{t('getInTouch')}</h3>
                        <p>info@vantart.com</p>
                        <p>+90 212 555 0123</p>
                        <p>Abdi İpekçi Cad. No:42<br />Nişantaşı, İstanbul</p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('contactName')}</label>
                            <input type="text" required />
                        </div>
                        <div className="form-group">
                            <label>{t('contactEmail')}</label>
                            <input type="email" required />
                        </div>
                        <div className="form-group">
                            <label>{t('contactMessage')}</label>
                            <textarea rows="5" required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">
                            {status === 'sent' ? t('sentSuccess') : t('sendBtn')}
                        </button>
                    </form>
                </div>
            </div>
            <style>{`
                .page-section { padding: 4rem 0; min-height: 70vh; color: var(--color-text); }
                .section-title { font-family: var(--font-heading); text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: var(--color-accent); }
                .content-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 900px; margin: 0 auto; }
                @media (max-width: 768px) { .content-wrapper { grid-template-columns: 1fr; gap: 2rem; } }
                
                .contact-info h3 { font-family: var(--font-heading); margin-bottom: 1.5rem; }
                .contact-info p { margin-bottom: 1rem; color: var(--color-text-muted); line-height: 1.6; }
                
                .contact-form .form-group { margin-bottom: 1.5rem; }
                .contact-form label { display: block; margin-bottom: 0.5rem; font-size: 0.8rem; text-transform: uppercase; color: var(--color-text-muted); }
                .contact-form input, .contact-form textarea {
                    width: 100%; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--color-border); color: white;
                }
                .contact-form input:focus, .contact-form textarea:focus { border-color: var(--color-accent); outline: none; }
                .submit-btn { width: 100%; padding: 1rem; background: var(--color-accent); border: none; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
                .submit-btn:hover { background: var(--color-accent-hover); }
            `}</style>
        </section>
    );
}
