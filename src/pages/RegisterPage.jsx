import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegistering) return; // Prevent double click

        setIsRegistering(true);
        setIsSubmitting(true);
        try {
            await register(email, password, name, phone);
            // SUCCESS FEEDBACK
            alert('✅ Kayıt Başarılı! Şimdi giriş yapabilirsiniz.');
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
                <h2>VANT ART'a Katılın</h2>
                <p className="auth-desc">Yeni bir hesap oluşturarak ayrıcalıklardan yararlanın.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>AD SOYAD</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Adınız Soyadınız" />
                    </div>
                    <div className="form-group">
                        <label>TELEFON NUMARASI</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" required />
                    </div>
                    <div className="form-group">
                        <label>E-POSTA ADRESİ</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@vantart.com" />
                    </div>
                    <div className="form-group">
                        <label>ŞİFRE</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimum 6 karakter" />
                    </div>
                    <button type="submit" className="auth-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'KAYIT YAPILIYOR...' : 'KAYIT OL'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Zaten üye misiniz? <Link to="/login">Giriş Yapın</Link></p>
                </div>
            </div>
            <style>{`
                .auth-page {
                    padding: 8rem 1rem;
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .auth-card {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    padding: 3rem;
                    width: 100%;
                    max-width: 450px;
                    text-align: center;
                }
                .auth-card h2 {
                    color: var(--color-accent);
                    font-family: var(--font-heading);
                    margin-bottom: 1rem;
                    font-size: 2rem;
                }
                .auth-desc {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }
                .form-group {
                    text-align: left;
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.05em;
                }
                .form-group input {
                    width: 100%;
                    padding: 1rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--color-border);
                    color: white;
                    outline: none;
                }
                .form-group input:focus {
                    border-color: var(--color-accent);
                }
                .auth-btn {
                    width: 100%;
                    padding: 1rem;
                    background: var(--color-accent);
                    color: #000;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    margin-top: 1rem;
                    letter-spacing: 0.1em;
                }
                .auth-footer {
                    margin-top: 2rem;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }
                .auth-footer a {
                    color: var(--color-accent);
                }
            `}</style>
        </div>
    );
}
