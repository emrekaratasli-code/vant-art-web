import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updatePassword(password);
            alert('✅ Şifreniz başarıyla güncellendi! Lütfen yeni şifrenizle giriş yapın.');
            navigate('/login');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page container">
            <div className="auth-card">
                <h2>Yeni Şifre Belirle</h2>
                <p className="auth-desc">Lütfen yeni şifrenizi giriniz.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>YENİ ŞİFRE</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimum 6 karakter" />
                    </div>
                    <button type="submit" className="auth-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}
                    </button>
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
            `}</style>
        </div>
    );
}
