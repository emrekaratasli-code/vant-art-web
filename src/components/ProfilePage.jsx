import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
    const { t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-page container">
            <h1 className="page-title">{isAuthenticated ? `${t('welcome')}, ${user.name}` : t('myProfile')}</h1>

            {!isAuthenticated ? (
                <div className="auth-section">
                    <h2 className="welcome-text">VANT ART'a Hoş Geldiniz</h2>
                    <p className="welcome-sub">Koleksiyonunuzu yönetmek ve siparişlerinizi takip etmek için giriş yapın.</p>

                    <div className="auth-buttons">
                        <Link to="/login" className="btn-primary">GİRİŞ YAP</Link>
                        <Link to="/register" className="btn-secondary">ÜYE OL</Link>
                    </div>
                </div>
            ) : (
                <div className="profile-dashboard">
                    <div className="profile-menu">
                        <div className="menu-item-group">
                            <span className="group-title">HESABIM</span>
                            <a href="#" className="menu-item">Koleksiyon Geçmişi</a>
                            <a href="#" className="menu-item">Favorilerim</a>
                            <a href="#" className="menu-item">Kayıtlı Adreslerim</a>
                        </div>
                        <div className="menu-item-group">
                            <span className="group-title">TERCİHLER</span>
                            <a href="#" className="menu-item">İletişim İzinleri</a>
                            <button onClick={handleLogout} className="menu-item logout-btn">Çıkış Yap</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .profile-page {
                    padding-top: 3rem;
                    min-height: 80vh;
                    max-width: 600px; /* Focus content */
                }
                .page-title {
                    text-align: center;
                    margin-bottom: 3rem;
                    font-size: 2rem;
                    color: var(--color-accent);
                    font-family: var(--font-heading);
                }
                .auth-section {
                    text-align: center;
                    margin-bottom: 4rem;
                    background: var(--color-surface);
                    padding: 3rem;
                    border: 1px solid var(--color-border);
                }
                .welcome-text {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-text);
                }
                .welcome-sub {
                    color: var(--color-text-muted);
                    margin-bottom: 2rem;
                    font-size: 0.9rem;
                }
                .auth-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .btn-primary, .btn-secondary {
                    padding: 0.8rem 2rem;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.3s;
                    display: inline-block;
                }
                .btn-primary {
                    background: var(--color-accent);
                    color: #000;
                    border: 1px solid var(--color-accent);
                }
                .btn-secondary {
                    background: transparent;
                    border: 1px solid var(--color-text-muted);
                    color: var(--color-text);
                }
                .btn-secondary:hover {
                    border-color: var(--color-text);
                }

                .profile-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .menu-item-group {
                     display: flex;
                    flex-direction: column;
                }
                .group-title {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin-bottom: 1rem;
                    letter-spacing: 0.1em;
                }
                .menu-item {
                    display: block;
                    padding: 1rem 0;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                    color: var(--color-text);
                    text-decoration: none;
                    font-size: 1rem;
                    letter-spacing: 0.05em;
                    transition: padding-left 0.3s, color 0.3s;
                    background: none;
                    border-left: none;
                    border-right: none;
                    border-top: none;
                    text-align: left;
                    width: 100%;
                }
                .menu-item:hover {
                    padding-left: 10px;
                    color: var(--color-accent);
                }
                .logout-btn {
                    color: #ff4d4d;
                }
                .logout-btn:hover {
                    color: #ff1a1a;
                }
            `}</style>
        </div>
    );
}
