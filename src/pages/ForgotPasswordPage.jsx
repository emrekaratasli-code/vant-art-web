import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await resetPassword(email);
            setStatus('success');
        } catch (error) {
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="auth-page container">
                <div className="auth-card">
                    <h2>E-posta Gönderildi</h2>
                    <p className="auth-desc">Lütfen <strong>{email}</strong> adresini kontrol edin. Şifre sıfırlama bağlantısı gönderildi.</p>
                    <Link to="/login" className="auth-btn">Giriş Yap</Link>
                </div>
                <style>{`
                    .auth-page { padding: 8rem 1rem; min-height: 80vh; display: flex; align-items: center; justify-content: center; }
                    .auth-card { background: var(--color-surface); border: 1px solid var(--color-border); padding: 3rem; width: 100%; max-width: 450px; text-align: center; }
                    .auth-card h2 { color: var(--color-accent); font-family: var(--font-heading); margin-bottom: 1rem; font-size: 2rem; }
                    .auth-desc { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
                    .auth-btn { display:inline-block; width: 100%; padding: 1rem; background: var(--color-accent); color: #000; font-weight: 700; border: none; cursor: pointer; text-decoration:none; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="auth-page container">
            <div className="auth-card">
                <h2>Şifremi Unuttum</h2>
                <p className="auth-desc">Hesabınıza ait e-posta adresini girin.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>E-POSTA ADRESİ</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@vantart.com" />
                    </div>
                    <button type="submit" className="auth-btn" disabled={status === 'loading'}>
                        {status === 'loading' ? 'GÖNDERİLİYOR...' : 'SIFIRLAMA BAĞLANTISI GÖNDER'}
                    </button>
                    <div className="auth-footer">
                        <Link to="/login">Giriş Sayfasına Dön</Link>
                    </div>
                </form>
            </div>
            <style>{`
                .auth-page { padding: 8rem 1rem; min-height: 80vh; display: flex; align-items: center; justify-content: center; }
                .auth-card { background: var(--color-surface); border: 1px solid var(--color-border); padding: 3rem; width: 100%; max-width: 450px; text-align: center; }
                .auth-card h2 { color: var(--color-accent); font-family: var(--font-heading); margin-bottom: 1rem; font-size: 2rem; }
                .auth-desc { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
                .form-group { text-align: left; margin-bottom: 1.5rem; }
                .form-group label { display: block; font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .form-group input { width: 100%; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); color: white; outline: none; }
                .form-group input:focus { border-color: var(--color-accent); }
                .auth-btn { width: 100%; padding: 1rem; background: var(--color-accent); color: #000; font-weight: 700; border: none; cursor: pointer; margin-top: 1rem; letter-spacing: 0.1em; }
                .auth-footer { margin-top: 2rem; font-size: 0.85rem; color: var(--color-text-muted); }
                .auth-footer a { color: var(--color-accent); }
            `}</style>
        </div>
    );
}
