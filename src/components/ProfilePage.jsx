import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { useOrders } from '../context/OrderContext';
import { useAddress } from '../context/AddressContext';
import ProductCard from './ProductCard';

export default function ProfilePage() {
    const { t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { wishlist } = useWishlist();
    const { orders } = useOrders();
    const { addresses, addAddress, removeAddress } = useAddress();

    // Tab State
    const [activeTab, setActiveTab] = useState('menu'); // menu, favorites, history, address

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ title: '', fullAddress: '', city: '', phone: '' });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const myOrders = orders.filter(o => {
        // Match by ID if available, otherwise fallback to email for guests/legacy
        if (user?.id && o.user_id === user.id) return true;
        if (user?.email && (o.billingDetails?.email === user.email || o.guest_email === user.email)) return true;
        return false;
    });

    const handleSaveAddress = (e) => {
        e.preventDefault();
        addAddress(newAddress);
        setShowAddressForm(false);
        setNewAddress({ title: '', fullAddress: '', city: '', phone: '' });
    };

    const renderMenu = () => (
        <div className="profile-menu">
            {/* ADMIN ACCESS LINK */}
            {['owner', 'admin', 'worker'].includes(user?.role) && (
                <div className="menu-item-group">
                    <span className="group-title">YÖNETİM</span>
                    <Link to="/admin" className="menu-item" style={{ color: '#d4af37', fontWeight: 'bold' }}>Admin Paneli Görüntüle →</Link>
                </div>
            )}
            <div className="menu-item-group">
                <span className="group-title">HESABIM</span>
                <button onClick={() => setActiveTab('history')} className="menu-item">Koleksiyon Geçmişi ({myOrders.length})</button>
                <button onClick={() => setActiveTab('favorites')} className="menu-item">Favorilerim ({wishlist.length})</button>
                <button onClick={() => setActiveTab('address')} className="menu-item">Kayıtlı Adreslerim ({addresses.length})</button>
            </div>
            <div className="menu-item-group">
                <span className="group-title">TERCİHLER</span>
                <button className="menu-item">İletişim İzinleri</button>
                <button onClick={handleLogout} className="menu-item logout-btn">Çıkış Yap</button>
            </div>
        </div>
    );

    const renderFavorites = () => (
        <div className="view-container">
            <button onClick={() => setActiveTab('menu')} className="back-link">← Menüye Dön</button>
            <h2 className="view-title">Favorilerim</h2>
            {wishlist.length === 0 ? (
                <p className="empty-msg">Henüz favori ürününüz yok.</p>
            ) : (
                <div className="fav-grid">
                    {wishlist.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );

    const renderHistory = () => (
        <div className="view-container">
            <button onClick={() => setActiveTab('menu')} className="back-link">← Menüye Dön</button>
            <h2 className="view-title">Koleksiyon Geçmişi</h2>
            {myOrders.length === 0 ? (
                <p className="empty-msg">Henüz vermiş olduğunuz bir sipariş bulunmuyor.</p>
            ) : (
                <div className="history-list">
                    {myOrders.map(order => (
                        <div key={order.id} className="history-item">
                            <div className="history-header">
                                <span className="order-date">{new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                                <span className={`order-status status-${order.status?.toLowerCase()}`}>{order.status}</span>
                            </div>
                            <div className="history-body">
                                <span className="order-summary">{order.items?.length || 0} Parça Ürün</span>
                                <span className="order-total">{order.total_amount?.toLocaleString('tr-TR')} TL</span>
                            </div>
                            <div className="history-footer">
                                <span className="order-id">Sipariş No: #{order.id.slice(0, 8)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAddresses = () => (
        <div className="view-container">
            <button onClick={() => setActiveTab('menu')} className="back-link">← Menüye Dön</button>
            <h2 className="view-title">Kayıtlı Adreslerim</h2>

            {!showAddressForm ? (
                <>
                    <button onClick={() => setShowAddressForm(true)} className="add-address-btn">+ YENİ ADRES EKLE</button>
                    {addresses.length === 0 ? (
                        <p className="empty-msg">Kayıtlı adresiniz bulunmuyor.</p>
                    ) : (
                        <div className="address-list">
                            {addresses.map(addr => (
                                <div key={addr.id} className="address-card">
                                    <div className="address-header">
                                        <span className="address-title">{addr.title}</span>
                                        <button onClick={() => removeAddress(addr.id)} className="delete-btn">SİL</button>
                                    </div>
                                    <p className="address-detail">{addr.fullAddress}</p>
                                    <p className="address-meta">{addr.city} / {addr.phone}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <form onSubmit={handleSaveAddress} className="address-form">
                    <div className="form-group">
                        <label>Adres Başlığı (Ev, İş vb.)</label>
                        <input
                            required
                            value={newAddress.title}
                            onChange={e => setNewAddress({ ...newAddress, title: e.target.value })}
                            placeholder="Örn: Evim"
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefon</label>
                        <input
                            required
                            value={newAddress.phone}
                            onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                            placeholder="0555 555 55 55"
                        />
                    </div>
                    <div className="form-group">
                        <label>Şehir</label>
                        <input
                            required
                            value={newAddress.city}
                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="İstanbul"
                        />
                    </div>
                    <div className="form-group">
                        <label>Açık Adres</label>
                        <textarea
                            required
                            rows="3"
                            value={newAddress.fullAddress}
                            onChange={e => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                            placeholder="Mahalle, Sokak, No..."
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="cancel-btn">İptal</button>
                        <button type="submit" className="save-btn">KAYDET</button>
                    </div>
                </form>
            )}
        </div>
    );

    return (
        <div className="profile-page container">
            <h1 className="page-title">{isAuthenticated ? `${t('welcome')}, ${user?.name || 'Kullanıcı'}` : t('myProfile')}</h1>

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
                    {activeTab === 'menu' && renderMenu()}
                    {activeTab === 'favorites' && renderFavorites()}
                    {activeTab === 'history' && renderHistory()}
                    {activeTab === 'address' && renderAddresses()}
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

                /* Tab Views Styles */
                .back-link {
                    background: none;
                    border: none;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                    display: inline-block;
                }
                .back-link:hover {
                    color: var(--color-accent);
                }
                .view-title {
                    font-size: 1.5rem;
                    color: var(--color-text);
                    margin-bottom: 2rem;
                    font-family: var(--font-heading);
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 1rem;
                }
                .empty-msg {
                    color: var(--color-text-muted);
                    font-style: italic;
                }
                .fav-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                
                /* Address Styles */
                .add-address-btn {
                    width: 100%;
                    padding: 1rem;
                    border: 1px dashed var(--color-accent);
                    color: var(--color-accent);
                    background: transparent;
                    margin-bottom: 2rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .add-address-btn:hover {
                    background: rgba(212, 175, 55, 0.05);
                }
                .address-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .address-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--color-border);
                    padding: 1.5rem;
                }
                .address-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }
                .address-title {
                    color: var(--color-accent);
                    font-weight: bold;
                }
                .delete-btn {
                    color: #ff4d4d;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                .address-detail {
                    color: var(--color-text);
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                }
                .address-meta {
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                }
                
                /* Address Form */
                .address-form {
                    background: rgba(255,255,255,0.03);
                    padding: 2rem;
                    border: 1px solid var(--color-border);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    color: var(--color-text-muted);
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--color-border);
                    padding: 0.8rem;
                    color: white;
                    outline: none;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--color-accent);
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                }
                .save-btn, .cancel-btn {
                    flex: 1;
                    padding: 1rem;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                }
                .save-btn {
                    background: var(--color-accent);
                    color: black;
                }
                .cancel-btn {
                    background: transparent;
                    border: 1px solid var(--color-border);
                    color: white;
                }

                /* History Styles */
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .history-item {
                    border: 1px solid var(--color-border);
                    padding: 1rem;
                    background: rgba(255,255,255,0.02);
                }
                .history-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--color-text-muted);
                }
                .status-processing { color: #ffd700; }
                .status-shipped { color: #4caf50; }
                .status-delivered { color: #4caf50; }
                .status-cancelled { color: #ff4d4d; }
                
                .history-body {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.1rem;
                    color: var(--color-text);
                    margin-bottom: 0.5rem;
                }
                .history-footer {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    text-align: right;
                }
            `}</style>
        </div>
    );
}
