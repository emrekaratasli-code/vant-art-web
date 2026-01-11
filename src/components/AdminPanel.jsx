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

// --- Icons ---
const IconDashboard = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconProducts = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconOrders = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconUsers = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconSettings = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconBell = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconMenu = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>;
const IconClose = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>;

import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const { products, addProduct, deleteProduct: deleteFromContext, fetchProducts } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { getStats } = useAnalytics();
  const { settings, updateSetting } = useSettings();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '', material: '' });

  // FETCHED DATA STATES
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH EMPLOYEES & CATEGORIES
  useEffect(() => {
    const fetchAuxData = async () => {
      setIsLoading(true);

      // Fetch Employees (Robust)
      try {
        const { data: empData, error } = await supabase.from('employees').select('id, first_name, last_name, email, status, is_approved');
        if (error) throw error;
        if (empData) setEmployees(empData);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        // Don't set empty here if you want to keep old data, but initial is empty anyway.
      }

      // Fetch Categories
      try {
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);
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
      <main className="admin-main">
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
              <div className="mobile-card-grid">
                {(products || []).map(p => (
                  <div className="mobile-card" key={p.id}>
                    <div className="mobile-card-header"><img src={p.image} className="card-thumb" alt={p.name} onError={e => e.target.src = 'https://placehold.co/40x40'} /><div className="card-title"><h4>{p.name}</h4><span className="card-subtitle">{p.category}</span></div></div>
                    <div className="mobile-card-body"><div className="card-row"><span>Fiyat:</span> <strong>₺{p.price}</strong></div><div className="card-row"><span>Stok:</span> <span style={{ color: p.stock < 5 ? 'red' : 'green' }}>{p.stock}</span></div></div>
                    <div className="mobile-card-actions"><button className="icon-action delete" onClick={() => handleDeleteProduct(p.id)}>🗑️ Sil</button></div>
                  </div>
                ))}
              </div>
              <div className="data-table-container desktop-table-container">
                <table className="data-table">
                  <thead><tr><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {products?.map(p => (
                      <tr key={p.id}>
                        <td><div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><img src={p.image} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} alt="" onError={e => e.target.src = 'https://placehold.co/40x40'} />{p.name}</div></td>
                        <td>{p.category}</td>
                        <td>₺{p.price}</td>
                        <td style={{ color: p.stock < 5 ? 'red' : 'inherit' }}>{p.stock}</td>
                        <td><button className="icon-action delete" onClick={() => handleDeleteProduct(p.id)}>🗑️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div id="add-product-form" className="add-product-form-panel">
                <h3>Yeni Ürün Ekle</h3>
                <form onSubmit={handleSubmitProduct} className="grid-form">
                  <div className="form-group"><label>Ad</label><input name="name" onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Fiyat</label><input name="price" type="number" onChange={e => setFormData({ ...formData, price: e.target.value })} required /></div>
                  <div className="form-group"><label>Kategori</label><select name="category" onChange={e => setFormData({ ...formData, category: e.target.value })}><option value="">Seçiniz</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div className="form-group"><label>Stok</label><input name="stock" type="number" onChange={e => setFormData({ ...formData, stock: e.target.value })} /></div>
                  <div className="form-group"><label>Görsel</label><input type="file" onChange={handleImageUpload} /></div>
                  <button type="submit" className="submit-btn full-width">Kaydet</button>
                </form>
              </div>
            </div>
          )}

          {/* ORDERS VIEW - UPDATED */}
          {activeTab === 'orders' && (
            <div className="orders-view">
              <div className="section-header"><h2>Siparişler ({orders?.length || 0})</h2></div>

              {/* MOBILE ORDER CARDS */}
              <div className="mobile-card-grid">
                {orders?.map(o => (
                  <div className="mobile-card" key={o.id}>
                    <div className="mobile-card-header">
                      <div className="card-title"><h4>#{o.id}</h4><span className="card-subtitle">{new Date(o.created_at).toLocaleDateString()}</span></div>
                    </div>
                    <div className="mobile-card-body">
                      <div className="card-row"><span>Müşteri:</span> <strong>{o.billingDetails?.name || o.user?.email || 'Misafir'}</strong></div>
                      <div className="card-row"><span>Tutar:</span> <strong>₺{o.amount}</strong></div>
                      <div className="card-row">
                        <span>Durum:</span>
                        <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} style={{ padding: '2px 5px' }}>
                          <option value="Preparing">Hazırlanıyor</option>
                          <option value="Shipped">Kargolandı</option>
                          <option value="Delivered">Teslim Edildi</option>
                          <option value="Cancelled">İptal</option>
                        </select>
                      </div>
                      {o.tracking_number && (
                        <div className="card-row" style={{ marginTop: 5, background: '#f9f9f9', padding: 5 }}><span style={{ fontSize: '0.8rem' }}>Kargo Takip: {o.tracking_number}</span></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP ORDER TABLE */}
              <div className="data-table-container desktop-table-container">
                {(!orders || orders.length === 0) ? <div className="empty-state">Sipariş yok.</div> : (
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Müşteri</th><th>Tarih</th><th>Tutar</th><th>Kargo Takip</th><th>Durum</th></tr></thead>
                    <tbody>
                      {orders?.map(o => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.billingDetails?.name || o.user?.email} <br /><span style={{ fontSize: '0.8rem', color: '#999' }}>{o.user?.email}</span></td>
                          <td>{new Date(o.created_at).toLocaleDateString()}</td>
                          <td>₺{o.amount}</td>
                          <td style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{o.tracking_number || '-'}</td>
                          <td>
                            <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} style={{ padding: 5, borderRadius: 4, border: '1px solid #ddd' }}>
                              <option value="Preparing">Hazırlanıyor</option>
                              <option value="Shipped">Kargolandı</option>
                              <option value="Delivered">Teslim Edildi</option>
                              <option value="Cancelled">İptal</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* WORKERS VIEW */}
          {activeTab === 'workers' && (
            <div className="workers-view">
              <div className="section-header"><h2>Çalışanlar ({employees?.length || 0})</h2></div>
              <div className="data-table-container">
                <table className="data-table">
                  <thead><tr><th>Ad Soyad</th><th>Durum</th><th>Email</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {employees?.map(w => (
                      <tr key={w.id}>
                        <td>{w.first_name} {w.last_name}</td>
                        <td>{w.status === 'pending' ? <span className="badge-status critical">Onay Bekliyor</span> : <span className="badge-status shipped">Aktif</span>}</td>
                        <td>{w.email} <br /><span style={{ fontSize: '0.8rem', color: '#999' }}>{w.position}</span></td>
                        <td>{w.status === 'pending' && user.email === 'emrekaratasli@vantonline.com' && (<button className="primary-btn" style={{ fontSize: '0.8rem', padding: '4px 8px' }} onClick={() => handleApproveWorker(w.id)}>Onayla ✅</button>)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      <style>{`
        /* LAYOUT & FONTS */
        .admin-layout { 
            display: flex; 
            height: 100vh; 
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 50; /* Ensure it sits on top of any global headers */
            background: #f4f5f7; 
            font-family: 'Inter', sans-serif; 
            overflow: hidden; 
        }
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .admin-loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f5f7; flex-direction: column; gap: 1rem; }
        
        /* MOBILE NAV */
        .mobile-header { display: none; align-items: center; padding: 1rem; background: #1a1a1a; color: #fff; gap: 1rem; }
        .hamburger-btn { background: none; border: none; color: #fff; cursor: pointer; }
        .mobile-drawer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; }
        .mobile-drawer { width: 80%; max-width: 300px; height: 100%; background: #fff; padding: 1.5rem; }
        .drawer-nav button { display: block; width: 100%; text-align: left; padding: 1rem; border: none; background: none; border-bottom: 1px solid #eee; font-size: 1.1rem; }
        
        .mobile-card-grid { display: none; gap: 15px; grid-template-columns: 1fr; margin-bottom: 20px; }
        .mobile-card { background: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .mobile-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
        .card-thumb { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }
        .card-title h4 { margin: 0; font-size: 1rem; }
        .card-subtitle { font-size: 0.8rem; color: #888; }
        .card-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.9rem; }
        .mobile-card-actions { margin-top: 10px; display: flex; justify-content: flex-end; }
        .icon-action.delete { background: #fee2e2; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; color: #d90000; display: flex; align-items: center; gap: 5px; }

        @media (max-width: 768px) {
            .desktop-sidebar { display: none; }
            .mobile-header { display: flex; }
            .admin-topbar .search-bar { display: none; } 
            .desktop-table-container { display: none; }
            .mobile-card-grid { display: grid; }
        }

        /* CONTRAST & SPACING */
        .top-actions { display: flex; gap: 24px; align-items: center; }
        .stat-card.white .stat-number.dark-text { color: #111; font-weight: 700; }
        .primary-btn { background: #d4af37; color: #fff; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; }
        .add-product-form-panel { padding: 20px; background: #fff; margin-top: 20px; border-radius: 8px; }
        .grid-form { display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        input, select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .badge-status { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
        .badge-status.critical { background: #fee2e2; color: #ef4444; }
        .badge-status.shipped { background: #dcfce7; color: #16a34a; }
      `}</style>
    </div>
  );
}
