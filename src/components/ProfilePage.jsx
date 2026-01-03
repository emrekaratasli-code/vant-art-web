import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
    const { t } = useLanguage();

    return (
        <div className="profile-page container">
            <h1 className="page-title">{t('myProfile')}</h1>

            <div className="auth-section">
                <h2 className="welcome-text">{t('welcome')}</h2>
                <p className="welcome-sub">{t('signInDesc')}</p>

                <div className="auth-buttons">
                    <button className="btn-primary">{t('login')}</button>
                    <button className="btn-secondary">{t('register')}</button>
                </div>
            </div>

            <div className="profile-menu">
                <a href="#" className="menu-item">{t('orderHistory')}</a>
                <a href="#" className="menu-item">{t('savedItems')}</a>
                <a href="#" className="menu-item">{t('addressBook')}</a>
                <a href="#" className="menu-item">{t('settings')}</a>
            </div>

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
                }
                .auth-section {
                    text-align: center;
                    margin-bottom: 4rem;
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
                    padding: 0.8rem 2.5rem;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s;
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
                    border-top: 1px solid rgba(212, 175, 55, 0.2);
                }
                .menu-item {
                    display: block;
                    padding: 1.5rem 0;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.2); /* Subtle Gold Divider */
                    color: var(--color-text);
                    text-decoration: none;
                    font-size: 1rem;
                    letter-spacing: 0.05em;
                    transition: padding-left 0.3s, color 0.3s;
                }
                .menu-item:hover {
                    padding-left: 10px;
                    color: var(--color-accent);
                }
            `}</style>
        </div>
    );
}
