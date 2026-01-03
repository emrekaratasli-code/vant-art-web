import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { useAnalytics } from '../context/AnalyticsContext';
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

export default function AdminPanel() {
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders } = useOrders();
  const { getStats } = useAnalytics();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const stats = useMemo(() => getStats() || {}, [getStats]);

  // Chart Data - Safe Access
  const activityData = stats.activityData || [];
  const categoryData = Object.entries(stats.categoryClicks || {}).map(([name, value]) => ({ name, value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) return;
    addProduct(formData);
    setFormData({ name: '', price: '', category: '', image: '', description: '', material: '' });
    alert(t('addedAlert'));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>VANT<span className="gold">.panel</span></h2>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <IconDashboard /> <span>Genel Bakış</span>
          </button>
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <IconProducts /> <span>Ürün Yönetimi</span>
          </button>
          <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <IconOrders /> <span>Siparişler</span>
          </button>
          <button className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <IconUsers /> <span>Müşteriler</span>
          </button>
          <div className="nav-divider"></div>
          <button className="nav-btn">
            <IconSettings /> <span>Ayarlar</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="name">Admin User</span>
              <span className="role">Süper Yönetici</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Panelde ara..." />
          </div>
          <div className="top-actions">
            <div className="notification-wrapper">
              <button className="icon-btn notification" onClick={toggleNotifications}>
                <IconBell />
                <span className="badge-dot"></span>
              </button>
              {notificationsOpen && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">Bildirimler</div>
                  {notifications.map(n => (
                    <div key={n.id} className="notif-item">
                      <span className="notif-text">{n.text}</span>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="view-site-btn" onClick={handleViewSite}>Siteyi Görüntüle ↗</button>
          </div>
        </header>

        <div className="content-scrollable">

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view">
              <div className="section-header">
                <h2>Panel Özeti</h2>
                <span className="date-display">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* KPI Cards */}
              <div className="stats-grid">
                <div className="stat-card black">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h4>Ziyaretçiler</h4>
                    <div className="stat-number">1,248</div>
                    <span className="trend positive">↑ %12 Bu Hafta</span>
                  </div>
                </div>
                <div className="stat-card gold">
                  <div className="stat-icon">💎</div>
                  <div className="stat-info">
                    <h4>Toplam Satış</h4>
                    <div className="stat-number">₺{(orders || []).reduce((acc, o) => acc + (o.amount || 0), 0).toLocaleString()}</div>
                    <span className="trend positive">↑ %5 Hedef Üzeri</span>
                  </div>
                </div>
                <div className="stat-card white">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-info">
                    <h4>Sepette Kalan</h4>
                    <div className="stat-number">{stats.abandonedCarts?.length || 0}</div>
                    <span className="trend negative">Aksiyon Bekliyor</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-split">
                <div className="main-charts">
                  <div className="chart-box">
                    <h3>Gelir & Trafik Analizi</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#000', color: '#fff', border: 'none', borderRadius: '4px' }} />
                        <Area type="monotone" dataKey="visitors" stroke="#d4af37" fillOpacity={1} fill="url(#colorVis)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="journey-section">
                    <h3>📍 Canlı Müşteri Akışı</h3>
                    <div className="journey-list">
                      <div className="journey-item">
                        <span className="time">10:42</span>
                        <span className="user">Misafir_88</span>
                        <span className="action">Zultanit Yüzük inceledi</span>
                      </div>
                      <div className="journey-item highlight">
                        <span className="time">10:40</span>
                        <span className="user">Selin K.</span>
                        <span className="action">Sepete Ekle (Safir Kolye) 🛒</span>
                      </div>
                      <div className="journey-item">
                        <span className="time">10:35</span>
                        <span className="user">Misafir_92</span>
                        <span className="action">Ana Sayfa ziyareti</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sidebar-widgets">
                  <div className="widget-box">
                    <h3>📦 Kritik Stok</h3>
                    <ul className="stock-list">
                      {products.sort((a, b) => b.stock - a.stock).slice(0, 4).map(p => (
                        <li key={p.id} className="stock-item">
                          <img src={p.image} alt="" />
                          <div className="info">
                            <span className="name">{p.name}</span>
                            <span className={`status ${p.stock < 5 ? 'critical' : 'warning'}`}>
                              {p.stock} Adet Kaldı
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="widget-box">
                    <h3>Kategori İlgi</h3>
                    <div className="mini-pie-container">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#888" paddingAngle={5} dataKey="value">
                            {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <div className="products-view">
              <div className="section-header">
                <h2>Ürün Katalogu</h2>
                <button className="primary-btn" onClick={() => document.getElementById('add-form').scrollIntoView({ behavior: 'smooth' })}>
                  + Yeni Ürün Ekle
                </button>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th>Stok</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="prod-cell-lg">
                            <img src={p.image} alt={p.name} />
                            <div>
                              <strong>{p.name}</strong>
                              <span className="sub-id">SKU: VNT-{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>{translateCategory(p.category)}</td>
                        <td className="font-mono">₺{p.price}</td>
                        <td>
                          <div className="stock-indicator">
                            <div className="bar" style={{ width: Math.min(100, p.stock * 2) + '%' }}></div>
                            <span>{p.stock}</span>
                          </div>
                        </td>
                        <td>
                          <button className="icon-action delete" onClick={() => deleteProduct(p.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="add-product-form-panel" id="add-form">
                <h3>⚡ Hızlı Ürün Ekleme</h3>
                <form onSubmit={handleSubmit} className="grid-form">
                  <div className="form-group"><label>Ürün Adı</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Fiyat (₺)</label><input name="price" value={formData.price} onChange={handleChange} type="number" required /></div>
                  <div className="form-group"><label>Görsel URL</label><input name="image" value={formData.image} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="rings">Yüzük</option>
                      <option value="necklaces">Kolye</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn full-width">Kataloğa Ekle</button>
                </form>
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="orders-view">
              <div className="section-header"><h2>Sipariş Yönetimi</h2></div>
              <div className="data-table-container">
                {orders.length === 0 ? <div className="empty-state">Henüz sipariş yok.</div> :
                  <table className="data-table">
                    <thead><tr><th>Sipariş No</th><th>Müşteri</th><th>Tarih</th><th>Tutar</th><th>Durum</th></tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td className="font-mono">#{o.id}</td>
                          <td>{o.billingDetails?.name}<br /><span className="sub-text">{o.billingDetails?.email}</span></td>
                          <td>{new Date().toLocaleDateString()}</td>
                          <td className="font-mono">₺{o.amount}</td>
                          <td><span className="badge-status pending">{o.status || 'Bekliyor'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            </div>
          )}

          {/* CUSTOMERS VIEW */}
          {activeTab === 'customers' && (
            <div className="customers-view">
              <div className="section-header"><h2>Müşteri Listesi</h2></div>

              {/* Customer Aggregation Logic could be moved to a useMemo for performance in real app */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Müşteri Bilgisi</th>
                      <th>Konum</th>
                      <th>Toplam Sipariş</th>
                      <th>Harceama (LTV)</th>
                      <th>Son Görülme</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Aggregating Users from Orders + Mock Data for Demo */}
                    {[
                      ...Array.from(orders.reduce((acc, order) => {
                        const email = order.billingDetails?.email || 'unknown';
                        if (!acc.has(email)) {
                          acc.set(email, {
                            id: email,
                            name: order.billingDetails?.name || 'Müşteri',
                            email: email,
                            city: order.billingDetails?.city || 'İstanbul',
                            count: 0,
                            spent: 0,
                            lastDate: order.date
                          });
                        }
                        const user = acc.get(email);
                        user.count += 1;
                        user.spent += (order.amount || 0);
                        if (new Date(order.date) > new Date(user.lastDate)) user.lastDate = order.date;
                        return acc;
                      }, new Map()).values()),
                      // Mock users for empty state demonstration if needed
                      ...(orders.length === 0 ? [
                        { id: 'demo1', name: 'Ayşe Yılmaz', email: 'ayse@example.com', city: 'İstanbul', count: 3, spent: 45000, lastDate: new Date().toISOString() },
                        { id: 'demo2', name: 'Mehmet Demir', email: 'mehmet@example.com', city: 'Ankara', count: 1, spent: 12500, lastDate: new Date(Date.now() - 86400000).toISOString() }
                      ] : [])
                    ].map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar-circle">{user.name.charAt(0)}</div>
                            <div>
                              <div className="font-bold">{user.name}</div>
                              <div className="sub-text">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.city}</td>
                        <td className="text-center"><span className="badge-pill">{user.count} Sipariş</span></td>
                        <td className="font-mono font-bold">₺{user.spent.toLocaleString()}</td>
                        <td>{new Date(user.lastDate).toLocaleDateString()}</td>
                        <td><button className="icon-btn">⋮</button></td>
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
        /* ... existing styles ... */
        
        .user-cell { display: flex; gap: 12px; align-items: center; }
        .avatar-circle { width: 40px; height: 40px; background: #2a2a2a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; }
        .badge-pill { background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; color: #555; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 600; }
        
        /* LAYOUT */
        .admin-layout { display: flex; height: 100vh; background: #f4f5f7; font-family: 'Inter', sans-serif; overflow: hidden; }
        .admin-sidebar { width: 260px; background: #1a1a1a; color: #fff; display: flex; flex-direction: column; flex-shrink: 0; transition: width 0.3s; }
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .content-scrollable { flex: 1; overflow-y: auto; padding: 2rem; }

        /* SIDEBAR */
        .sidebar-header { padding: 1.5rem; border-bottom: 1px solid #333; }
        .sidebar-header h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; letter-spacing: 1px; }
        .gold { color: #d4af37; }
        .sidebar-nav { padding: 1rem 0; flex: 1; }
        .nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 24px; background: none; border: none; color: #999; text-align: left; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
        .nav-btn:hover, .nav-btn.active { color: #fff; background: rgba(212, 175, 55, 0.1); border-right: 3px solid #d4af37; }
        .nav-divider { height: 1px; background: #333; margin: 10px 24px; }
        .sidebar-footer { padding: 1.5rem; border-top: 1px solid #333; }
        .admin-user { display: flex; gap: 10px; align-items: center; }
        .avatar { width: 36px; height: 36px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; }
        .user-info { display: flex; flex-direction: column; }
        .user-info .name { font-size: 0.9rem; font-weight: 500; }
        .user-info .role { font-size: 0.7rem; color: #666; }

        /* TOPBAR */
        .admin-topbar { background: #fff; height: 60px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; flex-shrink: 0; }
        .search-bar { background: #f4f5f7; padding: 6px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px; width: 300px; }
        .search-bar input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem; }
        .top-actions { display: flex; gap: 1rem; align-items: center; }
        .icon-btn { background: none; border: none; cursor: pointer; position: relative; color: #555; }
        .badge-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; }
        .view-site-btn { font-size: 0.8rem; color: #d4af37; background: rgba(212, 175, 55, 0.1); padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s; }
        .view-site-btn:hover { background: rgba(212, 175, 55, 0.2); }
        
        .notification-wrapper { position: relative; }
        .notification-dropdown { position: absolute; top: 100%; right: 0; width: 280px; background: #fff; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100; margin-top: 10px; }
        .dropdown-header { padding: 12px; border-bottom: 1px solid #f5f5f5; font-weight: 600; font-size: 0.9rem; color: #333; }
        .notif-item { padding: 12px; border-bottom: 1px solid #f9f9f9; display: flex; flex-direction: column; gap: 4px; }
        .notif-item:last-child { border-bottom: none; }
        .notif-text { font-size: 0.85rem; color: #444; }
        .notif-time { font-size: 0.75rem; color: #999; }

        /* DASHBOARD */
        .section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2rem; }
        .section-header h2 { font-size: 1.8rem; color: #111; font-weight: 600; }
        .date-display { color: #666; font-size: 0.9rem; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { padding: 1.5rem; border-radius: 12px; display: flex; gap: 1rem; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
        .stat-card.black { background: #1a1a1a; color: #fff; }
        .stat-card.gold { background: linear-gradient(135deg, #d4af37 0%, #b38f22 100%); color: #fff; }
        .stat-card.white { background: #fff; border: 1px solid #eee; }
        .stat-card.white .stat-icon { background: #fee2e2; color: #ef4444; }
        .stat-icon { font-size: 1.5rem; width: 48px; height: 48px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .stat-number { font-size: 1.8rem; font-weight: 700; margin: 4px 0; }
        .trend { font-size: 0.8rem; font-weight: 500; }
        .trend.positive { color: #86efac; }
        .trend.negative { color: #ef4444; }

        .dashboard-split { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .main-charts { display: flex; flex-direction: column; gap: 1.5rem; }
        .chart-box, .journey-section, .widget-box, .add-product-form-panel { background: #fff; border-radius: 12px; padding: 1.5rem; border: 1px solid #e5e5e5; }
        .chart-box h3, .journey-section h3, .widget-box h3 { margin-bottom: 1rem; font-size: 1rem; color: #444; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        .journey-item { display: flex; gap: 1rem; padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 0.9rem; align-items: center; }
        .journey-item:last-child { border-bottom: none; }
        .journey-item .time { color: #999; font-size: 0.8rem; width: 40px; }
        .journey-item .user { font-weight: 600; color: #333; width: 100px; }
        .journey-item .action { color: #555; }
        .journey-item.highlight { background: #fefce8; border-radius: 4px; padding: 10px 8px; border-left: 3px solid #d4af37; }

        .stock-list { list-style: none; padding: 0; margin: 0; }
        .stock-item { display: flex; gap: 10px; margin-bottom: 12px; align-items: center; }
        .stock-item img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
        .stock-item .info { display: flex; flex-direction: column; }
        .stock-item .name { font-size: 0.9rem; font-weight: 500; }
        .stock-item .status { font-size: 0.75rem; font-weight: 600; }
        .status.critical { color: #ef4444; }
        .status.warning { color: #d4af37; }

        /* DATA TABLES */
        .data-table-container { background: #fff; border-radius: 12px; border: 1px solid #e5e5e5; overflow: hidden; margin-bottom: 2rem; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .data-table th { background: #f9fafb; padding: 12px 16px; text-align: left; font-weight: 600; color: #666; border-bottom: 1px solid #e5e5e5; }
        .data-table td { padding: 16px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; color: #333; }
        .prod-cell-lg { display: flex; gap: 12px; align-items: center; }
        .prod-cell-lg img { width: 48px; height: 48px; border-radius: 4px; object-fit: cover; border: 1px solid #eee; }
        .prod-cell-lg div { display: flex; flex-direction: column; }
        .sub-id { font-size: 0.75rem; color: #999; font-family: monospace; }
        
        .stock-indicator { display: flex; align-items: center; gap: 8px; width: 100px; }
        .stock-indicator .bar { height: 4px; background: #10b981; border-radius: 2px; }
        
        .badge-status { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .badge-status.pending { background: #fef3c7; color: #d97706; }
        .badge-status.shipped { background: #dcfce7; color: #16a34a; }

        /* FORMS */
        .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group label { display: block; margin-bottom: 6px; font-size: 0.85rem; color: #666; font-weight: 500; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 0.9rem; transition: 0.2s; }
        .form-group input:focus { border-color: #d4af37; outline: none; }
        .submit-btn { background: #1a1a1a; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .submit-btn:hover { background: #d4af37; }
        .primary-btn { background: #d4af37; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        
        @media (max-width: 1024px) {
            .dashboard-split { grid-template-columns: 1fr; }
            .admin-sidebar { width: 200px; }
        }
        @media (max-width: 768px) {
             .admin-layout { flex-direction: column; overflow: auto; height: auto; }
             .admin-sidebar { width: 100%; height: auto; }
             .sidebar-nav { display: flex; overflow-x: auto; padding: 0.5rem; }
             .nav-btn { width: auto; white-space: nowrap; }
             .admin-main { overflow: visible; }
        }
      `}</style>
    </div>
  );
}

function translateCategory(cat) {
  if (cat === 'rings') return 'Yüzük';
  if (cat === 'necklaces') return 'Kolye';
  return cat;
}
