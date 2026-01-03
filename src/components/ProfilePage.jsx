import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
    const { t } = useLanguage();

    return (
        <div className="profile-page container">
            <h1 className="page-title">{t('admin') || 'Profile'}</h1>

            <div className="auth-card">
                <h2>Welcome to VANT ART</h2>
                <p>Sign in to view your order history and saved items.</p>

                <div className="auth-buttons">
                    <button className="btn-primary">Login</button>
                    <button className="btn-secondary">Register</button>
                </div>
            </div>

            <div className="links-list">
                <a href="#" className="list-item">Order History</a>
                <a href="#" className="list-item">Saved Items</a>
                <a href="#" className="list-item">Address Book</a>
                <a href="#" className="list-item">Settings</a>
            </div>

            <style>{`
                .profile-page {
                    padding-top: 2rem;
                    min-height: 80vh;
                }
                .page-title {
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 2rem;
                }
                .auth-card {
                    background: var(--color-surface);
                    padding: 2rem;
                    border-radius: var(--radius-sm);
                    text-align: center;
                    margin-bottom: 2rem;
                    border: 1px solid var(--color-border);
                }
                .auth-card h2 {
                    color: var(--color-accent);
                    margin-bottom: 0.5rem;
                }
                .auth-card p {
                    color: var(--color-text-muted);
                    margin-bottom: 1.5rem;
                }
                .auth-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .btn-primary, .btn-secondary {
                    padding: 0.8rem 2rem;
                    border-radius: 4px;
                    font-weight: bold;
                    min-width: 120px;
                }
                .btn-primary {
                    background: var(--color-accent);
                    color: #000;
                }
                .btn-secondary {
                    border: 1px solid var(--color-border);
                    background: transparent;
                    color: var(--color-text);
                }

                .links-list {
                    background: var(--color-surface);
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                }
                .list-item {
                    display: block;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--color-border);
                    color: var(--color-text);
                    transition: background 0.2s;
                }
                .list-item:last-child {
                    border-bottom: none;
                }
                .list-item:hover {
                    background: rgba(255,255,255,0.02);
                }
            `}</style>
        </div>
    );
}
