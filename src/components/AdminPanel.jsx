import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { supabase } from '../lib/supabaseClient';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// --- Icons ---
const IconDashboard = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconProducts = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconOrders = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconUsers = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconSettings = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconBell = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconMenu = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>;
const IconClose = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>;

export default function AdminPanel() {
  const { user } = useAuth();
  const { products, addProduct, deleteProduct: deleteFromContext, fetchProducts } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { getStats } = useAnalytics();
  const { settings, updateSetting } = useSettings();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '', material: '' });

  // FETCHED DATA STATES
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH EMPLOYEES & CATEGORIES & CUSTOMERS
  useEffect(() => {
    const fetchAuxData = async () => {
      setIsLoading(true);

      // Fetch Employees (Robust)
      try {
        // EXPLICITLY SELECT first_name, last_name
        const { data: empData, error } = await supabase.from('employees').select('id, first_name, last_name, email, status, is_approved');
        if (error) {
          console.warn("Employees fetch error (ignoring):", error.message);
        } else {
          setEmployees(empData || []);
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }

      // Fetch Customers (Profiles)
      try {
        // Fetching profiles as requested
        const { data: custData, error } = await supabase.from('profiles').select('*');
        if (error) {
          console.warn("Profiles fetch error:", error.message);
        } else {
          setCustomers(custData || []);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }

      // Fetch Categories
      try {
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }

      setIsLoading(false);
    };
    fetchAuxData();
  }, [activeTab]);

  // --- ACCESS CHECK ---
  if (!user || !user.isAdmin) return <div className="admin-loading"><h3>Erişim Yetkisi Yok</h3></div>;

  // --- ACTION HANDLERS ---
  const handleViewSite = () => window.open('/', '_blank');
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  const stats = useMemo(() => (getStats && typeof getStats === 'function') ? (getStats() || {}) : {}, [getStats]);
  const activityData = stats.activityData || [];
  const totalSales = (orders || []).reduce((acc, o) => acc + (parseFloat(o.amount) || 0), 0);
  const totalVisitors = stats.visitors || 0;

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try { await deleteFromContext(id); } catch (e) { alert('Silinemedi: ' + e.message); }
  };

  const handleApproveWorker = async (workerId) => {
    // Only owner email can approve
    if (user.email !== 'emrekaratasli@vantonline.com') return;
    try {
      const { error } = await supabase.from('employees').update({ status: 'active', is_approved: true }).eq('id', workerId);
      if (error) throw error;
      setEmployees(prev => prev.map(w => w.id === workerId ? { ...w, status: 'active' } : w));
    } catch (e) { alert('Onay hatası: ' + e.message); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: objectUrl });
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    await addProduct(formData);
    setFormData({ name: '', price: '', category: '', image: '', description: '', material: '' });
    alert('Ürün eklendi!');
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Shipped') {
      const tracking = prompt('Kargo Takip Numarası Giriniz:');
      if (tracking) {
        updateOrderStatus(orderId, newStatus, tracking);
      }
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const isWorker = user.email !== 'emrekaratasli@vantonline.com'; // Simple check for sidebar hiding logic if needed

  return (
    <div className="admin-layout">
      {/* MOBILE HEADER (HAMBURGER) */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)}><IconMenu /></button>
        <span className="mobile-brand">VANT.panel</span>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header"><h3>Menu</h3><button onClick={() => setMobileMenuOpen(false)}><IconClose /></button></div>
            <nav className="drawer-nav">
              <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}>Genel Bakış</button>
              <button onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}>Ürünler</button>
              <button onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}>Siparişler</button>
              <button onClick={() => { setActiveTab('customers'); setMobileMenuOpen(false); }}>Müşteriler</button>
              <button onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}>Kategoriler</button>
              <button onClick={() => { setActiveTab('workers'); setMobileMenuOpen(false); }}>Çalışanlar</button>
              <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}>Ayarlar</button>
            </nav>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'} desktop-sidebar`}>
        <div className="sidebar-header"><h2>VANT<span className="gold">.panel</span></h2></div>
        <nav className="sidebar-nav">
          {!isWorker && (<button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><IconDashboard /> <span>Genel Bakış</span></button>)}
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}><IconProducts /> <span>Ürün Yönetimi</span></button>
          <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><IconOrders /> <span>Siparişler</span></button>
          <button className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}><IconUsers /> <span>Müşteriler</span></button>
          <button className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}><IconDashboard /> <span>Kategoriler</span></button>
          <button className={`nav-btn ${activeTab === 'workers' ? 'active' : ''}`} onClick={() => setActiveTab('workers')}><IconUsers /> <span>Çalışan Yönetimi</span></button>
          <div className="nav-divider"></div>
          <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><IconSettings /> <span>Ayarlar</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user"><div className="avatar">{user.name?.charAt(0)}</div><div className="user-info"><span className="name">{user.name}</span><span className="role">{isWorker ? 'Employee' : 'Owner'}</span></div></div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <header className="admin-topbar">
          <div className="search-bar"><span className="search-icon">🔍</span><input type="text" placeholder="Panelde ara..." /></div>
          <div className="top-actions">
            <div className="notification-wrapper"><button className="icon-btn notification" onClick={toggleNotifications}><IconBell /><span className="badge-dot"></span></button></div>
            <button className="view-site-btn" onClick={handleViewSite}>Siteyi Görüntüle ↗</button>
          </div>
        </header>

        <div className="content-scrollable">
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view">
              <div className="section-header"><h2>Panel Özeti</h2><span className="date-display">{new Date().toLocaleDateString()}</span></div>
              <div className="stats-grid">
                <div className="stat-card black"><div className="stat-icon">👥</div><div className="stat-info"><h4>Ziyaretçiler</h4><div className="stat-number">{totalVisitors.toLocaleString()}</div><span className="trend positive">Canlı Veri</span></div></div>
                <div className="stat-card gold"><div className="stat-icon">💎</div><div className="stat-info"><h4>Toplam Satış</h4><div className="stat-number">₺{totalSales.toLocaleString()}</div><span className="trend positive">Gerçek Ciro</span></div></div>
                <div className="stat-card white"><div className="stat-icon">⚠️</div><div className="stat-info"><h4>Kritik Stok</h4><div className="stat-number dark-text">{(products || []).filter(p => p.stock < 5).length}</div><span className="trend negative">İlgilenilmeli</span></div></div>
              </div>
              <div className="dashboard-split"><div className="main-charts"><div className="chart-box"><h3>Gelir Grafiği</h3><div style={{ width: '100%', height: 300 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={activityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis /><Tooltip /><Area type="monotone" dataKey="visitors" stroke="#d4af37" fill="#d4af37" /></AreaChart></ResponsiveContainer></div></div></div></div>
            </div>
          )}

          {/* PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <div className="products-view">
              <div className="section-header"><h2>Ürün Kataloğu</h2><button className="primary-btn" onClick={() => document.getElementById('add-product-form').scrollIntoView({ behavior: 'smooth' })}>+ Yeni Ürün</button></div>

              {/* Product ADD FORM */}
              <div className="luxury-card mb-4" id="add-product-form">
                <h3>Yeni Ürün Ekle</h3>
                <form onSubmit={handleSubmitProduct} className="admin-form-grid">
                  <input type="text" placeholder="Ürün Adı" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  <input type="number" placeholder="Fiyat (₺)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                    <option value="">Kategori Seçin</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    <option value="rings">Yüzükler</option>
                    <option value="necklaces">Kolyeler</option>
                    <option value="earrings">Küpeler</option>
                  </select>
                  <input type="text" placeholder="Materyal (Altın, Gümüş...)" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                  <input type="file" onChange={handleImageUpload} className="file-input" />
                  <textarea placeholder="Ürün Açıklaması" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
                  <button type="submit" className="submit-btn full-width">Ürünü Kaydet</button>
                </form>
              </div>

              <div className="desktop-table-container">
                <table className="admin-table">
                  <thead><tr><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {products?.map(p => (
                      <tr key={p.id}>
                        <td><div className="product-cell"><img src={p.image} className="table-thumb" alt="" onError={e => e.target.src = 'https://placehold.co/40x40'} />{p.name}</div></td>
                        <td>{p.category}</td>
                        <td>₺{p.price}</td>
                        <td style={{ color: p.stock < 5 ? 'red' : 'inherit' }}>{p.stock}</td>
                        <td><button className="icon-action delete" onClick={() => handleDeleteProduct(p.id)}>🗑️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-card-grid">
                {products?.map(p => (
                  <div className="mobile-card" key={p.id}>
                    <div className="mobile-card-header">
                      <img src={p.image} className="table-thumb" alt="" />
                      <span>{p.name}</span>
                    </div>
                    <div className="mobile-card-body">
                      <p>Fiyat: ₺{p.price}</p>
                      <p>Stok: {p.stock}</p>
                      <button className="icon-action delete" onClick={() => handleDeleteProduct(p.id)}>Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="orders-view">
              <div className="section-header"><h2>Sipariş Yönetimi</h2></div>
              <div className="desktop-table-container">
                <table className="admin-table">
                  <thead><tr><th>Sipariş ID</th><th>Müşteri</th><th>Tutar</th><th>Durum</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {orders?.map(o => (
                      <tr key={o.id}>
                        <td>#{o.id.slice(0, 8)}</td>
                        <td>{o.billingDetails?.name || o.user?.email || 'Misafir'}</td>
                        <td>₺{o.amount}</td>
                        <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                        <td>
                          <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="status-select">
                            <option value="Processing">İşleniyor</option>
                            <option value="Shipped">Kargolandı</option>
                            <option value="Delivered">Teslim Edildi</option>
                            <option value="Cancelled">İptal</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-card-grid">
                {orders?.map(o => (
                  <div className="mobile-card" key={o.id}>
                    <div className="mobile-card-header">#{o.id.slice(0, 8)}</div>
                    <div className="mobile-card-body">
                      <p>Müşteri: {o.billingDetails?.name || o.user?.email || 'Misafir'}</p>
                      <p>Tutar: ₺{o.amount}</p>
                      <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="status-select">
                        <option value="Processing">İşleniyor</option>
                        <option value="Shipped">Kargolandı</option>
                        <option value="Delivered">Teslim Edildi</option>
                        <option value="Cancelled">İptal</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMERS VIEW */}
          {activeTab === 'customers' && (
            <div className="customers-view">
              <div className="section-header"><h2>Müşteri Listesi (Profiles)</h2></div>
              <div className="desktop-table-container">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Ad Soyad</th><th>Email</th><th>Telefon</th><th>Oluşturulma</th></tr></thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td>{c.id?.slice(0, 8)}...</td>
                        <td>{c.full_name || `${c.first_name || ''} ${c.last_name || ''}`}</td>
                        <td>{c.email || '-'}</td>
                        <td>{c.phone || '-'}</td>
                        <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                    {customers.length === 0 && <tr><td colSpan="5" className="no-data">Kayıtlı müşteri bulunamadı.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mobile-card-grid">
                {customers.map(c => (
                  <div className="mobile-card" key={c.id}>
                    <div className="mobile-card-header">{c.full_name || `${c.first_name || ''} ${c.last_name || ''}` || 'İsimsiz'}</div>
                    <div className="mobile-card-body">
                      <p>{c.email}</p>
                      <p>{c.phone}</p>
                      <p className="small-text">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                ))}
                {customers.length === 0 && <div className="no-data">Kayıtlı müşteri bulunamadı.</div>}
              </div>
            </div>
          )}

          {/* EMPLOYEES VIEW */}
          {activeTab === 'workers' && (
            <div className="workers-view">
              <div className="section-header"><h2>Personel Listesi</h2></div>
              <div className="desktop-table-container">
                <table className="admin-table">
                  <thead><tr><th>Ad Soyad</th><th>Email</th><th>Durum</th><th>Onay</th></tr></thead>
                  <tbody>
                    {employees.map(w => (
                      <tr key={w.id}>
                        {/* SCHEMA FIX: Use first_name last_name */}
                        <td>{w.first_name} {w.last_name}</td>
                        <td>{w.email}</td>
                        <td><span className={`status-badge ${w.status}`}>{w.status}</span></td>
                        <td>
                          {!w.is_approved && (
                            <button className="gold-btn small" onClick={() => handleApproveWorker(w.id)}>Onayla</button>
                          )}
                          {w.is_approved && <span className="text-green">✔ Onaylı</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-card-grid">
                {employees.map(w => (
                  <div className="mobile-card" key={w.id}>
                    <div className="mobile-card-header">{w.first_name} {w.last_name}</div>
                    <div className="mobile-card-body">
                      <p>{w.email}</p>
                      <p>Durum: {w.status}</p>
                      {!w.is_approved && <button className="gold-btn small" onClick={() => handleApproveWorker(w.id)}>Onayla</button>}
                      {w.is_approved && <span className="text-green">✔ Onaylı</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && <div className="placeholder-view">Ayarlar Yapım Aşamasında</div>}

        </div>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #050505;
          color: #f0f0f0;
          position: relative;
        }

        /* --- SIDEBAR --- */
        .admin-sidebar {
          width: 260px;
          background: #0a0a0a;
          border-right: 1px solid #222;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease-in-out;
        }

        .sidebar-header {
          padding: 2rem;
          border-bottom: 1px solid #222;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
        }
        .sidebar-header h2 { color: #d4af37; margin: 0; font-family: 'Playfair Display', serif; }
        
        .admin-nav {
          flex: 1;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-btn {
          background: transparent;
          border: none;
          color: #888;
          text-align: left;
          padding: 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        .nav-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .nav-btn.active {
          color: #d4af37;
          background: rgba(212,175,55,0.1);
          border-left: 3px solid #d4af37;
        }

        .sidebar-footer {
          padding: 2rem;
          border-top: 1px solid #222;
        }

        /* --- MAIN CONTENT --- */
        .admin-content {
          flex: 1;
          margin-left: 260px; /* Offset for sidebar */
          padding: 2rem;
          overflow-y: auto;
          width: 100%;
        }

        .admin-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .search-bar {
            display: flex;
            align-items: center;
            background: #111;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            border: 1px solid #222;
        }
        .search-bar input {
            background: none;
            border: none;
            color: #fff;
            margin-left: 0.5rem;
            outline: none;
        }
        .view-site-btn {
            background: #222;
            color: #d4af37;
            border: 1px solid #d4af37;
            padding: 0.5rem 1rem;
            cursor: pointer;
            margin-left: 1rem;
        }

        .luxury-card {
          background: #0f0f0f;
          border: 1px solid #222;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .admin-form-grid {
            display: grid;
            gap: 1rem;
        }
        .admin-form-grid input, .admin-form-grid select, .admin-form-grid textarea {
            padding: 0.8rem;
            background: #1a1a1a;
            border: 1px solid #333;
            color: white;
            outline: none;
            width: 100%;
        }
        .submit-btn {
            background: #d4af37;
            color: black;
            font-weight: bold;
            padding: 1rem;
            border: none;
            cursor: pointer;
        }

        /* --- STATS GRID --- */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
            background: #111;
            padding: 1.5rem;
            border-radius: 8px;
            display: flex;
            gap: 1rem;
            border: 1px solid #222;
        }
        .stat-card.gold { border-color: #d4af37; }
        .stat-number { font-size: 1.5rem; font-weight: bold; color: #fff; margin-top: 5px; }

        /* --- TABLES & CARDS --- */
        .desktop-table-container { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .admin-table th { text-align: left; padding: 1rem; color: #666; border-bottom: 1px solid #222; font-weight: normal; font-size: 0.8rem; }
        .admin-table td { padding: 1rem; border-bottom: 1px solid #1a1a1a; color: #ddd; vertical-align: middle; }
        .product-cell { display: flex; alignItems: center; gap: 1rem; }
        .table-thumb { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; background: #222; }
        
        .gold-btn {
          background: #d4af37; color: #000; border: none; padding: 0.5rem 1rem; cursor: pointer; font-weight: bold;
        }
        .icon-action { background: none; border: none; cursor: pointer; font-size: 1rem; margin-right: 0.5rem; }
        .delete { color: #ff4d4d; }

        /* --- RESPONSIVE / MOBILE --- */
        .mobile-admin-header { display: none; }
        .sidebar-overlay { display: none; }
        .mobile-card-grid { display: none; } /* Hidden on desktop */

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%); /* Hidden by default */
            width: 80%; /* Wider on mobile */
            max-width: 300px;
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          
          .admin-content {
            margin-left: 0; /* No offset */
            padding-top: 4rem; /* Space for mobile header */
          }
          .admin-topbar { display: none; } /* Use mobile header instead */
          .desktop-table-container { display: none; } /* Hide complex tables */
          .mobile-card-grid { display: flex; flex-direction: column; gap: 1rem; } /* Show cards */

          .mobile-admin-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 60px;
            background: #0a0a0a;
            border-bottom: 1px solid #222;
            padding: 0 1rem;
            z-index: 900;
          }
          .hamburger-btn {
            background: none; border: none; color: #d4af37; font-size: 1.5rem; cursor: pointer;
          }
          .mobile-drawer-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1200;
            display: flex; justify-content: flex-start;
          }
          .mobile-drawer {
             width: 80%; max-width: 300px; background: #111; height: 100%; padding: 2rem;
          }
          .drawer-nav button {
             display: block; w-100; padding: 1rem; background: none; border: none; color: white; text-align: left; font-size: 1.2rem;
             border-bottom: 1px solid #222; width: 100%;
          }

          .mobile-card {
            background: #111; border: 1px solid #222; padding: 1rem; border-radius: 8px;
          }
          .mobile-card-header { display: flex; align-items: center; gap: 10px; font-weight: bold; border-bottom: 1px solid #222; padding-bottom: 0.5rem; margin-bottom: 0.5rem; color: #d4af37; }
        }
      `}</style>
    </div>
  );
}
