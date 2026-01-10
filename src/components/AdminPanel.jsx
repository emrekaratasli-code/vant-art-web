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

import { useAuth } from '../context/AuthContext'; // Added
import { useSettings } from '../context/SettingsContext'; // Added

// ... (existing imports)

export default function AdminPanel() {
  const { user } = useAuth(); // Added
  const { products, addProduct, deleteProduct: deleteFromContext } = useProducts(); // Renamed to avoid confusion
  const { orders } = useOrders();
  const { getStats } = useAnalytics();
  const { settings, updateSetting } = useSettings();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Added missing state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '', material: '' });

  // WORKER DATA STATE (Moved up for access in handleDelete)
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Ahmet', surname: 'Yılmaz', email: 'ahmet@vantonline.com', position: 'Depo Sorumlusu', role: 'worker', status: 'active', salary: 28000, startDate: '2024-01-15' },
    { id: 2, name: 'Zeynep', surname: 'Kaya', email: 'zeynep@vantonline.com', position: 'Satış Uzmanı', role: 'worker', status: 'active', salary: 32000, startDate: '2023-11-20' },
    { id: 3, name: 'Can', surname: 'Vural', email: 'can@vantonline.com', position: 'Stajyer', role: 'worker', status: 'pending', salary: 17002, startDate: '2025-01-09' }
  ]);

  // Custom delete handler with security check
  const handleDeleteProduct = (id) => {
    console.log("Attempting to delete product:", id);
    // 1. Godmode & Approval Check
    const isGodmode = user?.email === 'emrekaratasli@vantonline.com';
    // Check if current user is an active worker
    const currentWorkerProfile = workers.find(w => w.email === user?.email);
    const isAuthorized = isGodmode || (user?.role === 'admin') || (currentWorkerProfile?.status === 'active');

    console.log("Auth Status:", { isGodmode, role: user?.role, workerStatus: currentWorkerProfile?.status, isAuthorized });

    if (!isAuthorized) {
      alert('⛔ Yetkiniz yok! Sadece onaylı çalışanlar veya Godmode (Owner) silebilir.');
      return;
    }

    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      deleteFromContext(id);
    }
  };
  const [workerFormData, setWorkerFormData] = useState({ name: '', surname: '', email: '', position: 'Satış Temsilcisi', role: 'worker', salary: '', startDate: '' });

  // CATEGORY DATA STATE
  const [categories, setCategories] = useState([
    { id: 'rings', name: 'Yüzükler', icon: '💍', description: 'Eşsiz el yapımı yüzük koleksiyonu.' },
    { id: 'necklaces', name: 'Kolyeler', icon: '📿', description: 'Zarif ve modern kolye tasarımları.' },
    { id: 'bracelets', name: 'Bileklikler', icon: '🔱', description: 'Özel tasarım bileklikler.' }
  ]);
  const [categoryFormData, setCategoryFormData] = useState({ id: '', name: '', icon: '', description: '' });

  // Update active tab if user role changes or on mount to enforce restriction
  // This simple check ensures if they somehow got to dashboard, they are moved to products
  if (user?.role === 'worker' && ['dashboard', 'workers', 'settings'].includes(activeTab)) {
    setActiveTab('products');
  }

  // --- ACCESS CHECK ---
  // --- ACCESS CHECK ---
  // Allow 'owner', 'admin', 'worker' but check permissions
  if (!user || user.role === 'customer') {
    return (
      <div className="admin-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Erişim Yetkisi Yok</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Bu paneli görüntülemek için yetkili hesapla giriş yapmalısınız.</p>
          <a href="/login" style={{ padding: '10px 20px', background: '#d4af37', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Giriş Yap</a>
        </div>
      </div>
    );
  }

  // CHECK APPROVAL FOR WORKERS/ADMINS (Excluding Owner)
  // In a real app, this status would come from the user object or API
  // Here we mock check against our internal workers list if email matches
  const currentUserRecord = workers.find(w => w.email === user.email);
  if (user.role !== 'owner' && (!currentUserRecord || currentUserRecord.status === 'pending')) {
    return (
      <div className="admin-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳ Onay Bekliyor</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Hesabınız oluşturuldu ancak yönetici onayı bekliyor.</p>
          <a href="/" style={{ textDecoration: 'underline', color: '#d4af37' }}>Siteye Dön</a>
        </div>
      </div>
    );
  }

  // MOCK NOTIFICATIONS
  const notifications = [
    { id: 1, text: 'Yeni sipariş: #ORD-9921', time: '5 dk önce' },
    { id: 2, text: 'Stok uyarısı: Zultanit Yüzük', time: '1 saat önce' },
    { id: 3, text: 'Günlük rapor hazır', time: 'Bugün' }
  ];

  const handleViewSite = () => {
    window.open('/', '_blank');
  };

  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  const stats = useMemo(() => {
    try {
      return (getStats && typeof getStats === 'function') ? (getStats() || {}) : {};
    } catch (e) {
      console.error("Stats Error:", e);
      return {};
    }
  }, [getStats]);

  // Chart Data - Safe Access
  const activityData = stats.activityData || [];
  const categoryData = Object.entries(stats.categoryClicks || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ['#d4af37', '#2a2a2a', '#999', '#555'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) return;
    addProduct(formData);
    setFormData({ name: '', price: '', category: '', image: '', description: '', material: '' });
    alert(t('addedAlert'));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- SAFETY CHECK (MOVED TO END) ---
  if (!products || !orders) {
    return (
      <div className="admin-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Panel Yükleniyor...</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Veriler hazırlanıyor.</p>
        </div>
      </div>
    );
  }

  const isWorker = user?.role === 'worker';

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>VANT<span className="gold">.panel</span></h2>
        </div>

        <nav className="sidebar-nav">
          {!isWorker && (
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <IconDashboard /> <span>Genel Bakış</span>
            </button>
          )}
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <IconProducts /> <span>Ürün Yönetimi</span>
          </button>
          <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <IconOrders /> <span>Siparişler</span>
          </button>
          <button className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <IconDashboard /> <span>Kategoriler</span>
          </button>
          {!isWorker && (
            <>
              <button className={`nav-btn ${activeTab === 'workers' ? 'active' : ''}`} onClick={() => setActiveTab('workers')}>
                <IconUsers /> <span>Çalışan Yönetimi</span>
              </button>
              <div className="nav-divider"></div>
              <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <IconSettings /> <span>Ayarlar</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="avatar" style={{ textTransform: 'uppercase' }}>{user.name.substring(0, 2)}</div>
            <div className="user-info">
              <span className="name" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
              <span className="role">
                {user.role === 'owner' ? '👑 Kurucu & Owner' : (isWorker ? 'Personel' : 'Yönetici')}
              </span>
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
                  {/* Views & Favorites Chart */}
                  <div className="chart-box">
                    <h3>📈 Ürün İlgi Analizi (Görüntülenme vs Favori)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.entries(stats.productViews || {}).map(([name, views]) => ({
                          name: name.length > 10 ? name.substring(0, 10) + '...' : name,
                          fullName: name,
                          views,
                          likes: stats.wishlistAdds?.[name] || 0
                        })).sort((a, b) => b.views - a.views).slice(0, 7)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis />
                          <Tooltip cursor={{ fill: 'transparent' }} />
                          <Legend />
                          <Bar dataKey="views" name="Görüntülenme" fill="#2a2a2a" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="likes" name="Favorilenme" fill="#d4af37" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-box">
                    <h3>Gelir & Trafik Analizi</h3>
                    {/* SAFE CHART: Only render if data exists and is valid */}
                    <div style={{ width: '100%', height: 300 }}>
                      {activityData && activityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
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
                      ) : <div className="empty-state-chart">Veri Yükleniyor veya Yok</div>}
                    </div>
                  </div>

                  <div className="journey-section">
                    <h3>📍 Canlı Müşteri Akışı</h3>
                    <div className="journey-list">
                      {(stats.recentActivity || []).map((item, idx) => (
                        <div key={idx} className={`journey-item ${item.action.includes('Sipariş') ? 'highlight' : ''}`}>
                          <span className="time">{item.time}</span>
                          <span className="user">{item.user}</span>
                          <span className="action">
                            {item.action === 'Favorilere Ekleme' ? '❤️ ' : ''}
                            {item.action} ({item.detail})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sidebar-widgets">
                  <div className="widget-box">
                    <h3>❤️ En Çok Favorilenenler</h3>
                    <ul className="stock-list">
                      {Object.entries(stats.wishlistAdds || {})
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([name, count], i) => (
                          <li key={i} className="stock-item">
                            <div className="avatar-circle" style={{ background: '#d4af37', fontSize: '0.9rem' }}>{i + 1}</div>
                            <div className="info">
                              <span className="name">{name}</span>
                              <span className="status warning">{count} Kişi Favoriledi</span>
                            </div>
                          </li>
                        ))}
                      {(!stats.wishlistAdds || Object.keys(stats.wishlistAdds).length === 0) && <p className="text-muted text-sm decoration-gray-400">Henüz veri yok.</p>}
                    </ul>
                  </div>

                  <div className="widget-box">
                    <h3>📦 Kritik Stok</h3>
                    <ul className="stock-list">
                      {/* SAFE SORT */}
                      {(products || []).sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 4).map(p => (
                        <li key={p.id} className="stock-item">
                          <img src={p.image} alt="" onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=Prod' }} />
                          <div className="info">
                            <span className="name">{p.name}</span>
                            <span className="status warning">
                              {p.stock} Adet Kaldı
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="widget-box">
                    <h3>Kategori İlgi</h3>
                    <div className="mini-pie-container" style={{ width: '100%', height: 200 }}>
                      {/* SAFE PIE CHART */}
                      {categoryData && categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#888" paddingAngle={5} dataKey="value">
                              {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      ) : <div className="empty-state-chart">Veri Yok</div>}
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
                    {/* SAFE MAP */}
                    {(products || []).map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="prod-cell-lg">
                            <img src={p.image} alt={p.name} onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=Prod' }} />
                            <div>
                              <strong style={{ display: 'block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</strong>
                              <span className="sub-id">SKU: VNT-{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>{translateCategory(p.category)}</td>
                        <td className="font-mono">₺{p.price}</td>
                        <td>
                          <div className="stock-indicator">
                            <div className="bar" style={{ width: Math.min(100, (p.stock || 0) * 2) + '%' }}></div>
                            <span>{p.stock}</span>
                          </div>
                        </td>
                        <td>
                          <button className="icon-action delete" onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW (Visible only on mobile) */}
              <div className="mobile-card-view">
                {(products || []).map(p => (
                  <div key={p.id} className="mobile-card">
                    <div className="card-image">
                      <img src={p.image} alt={p.name} onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image' }} />
                    </div>
                    <div className="card-details">
                      <div className="card-header">
                        <span className="card-id">#{p.id}</span>
                        <div className="stock-bg">
                          <span className={`stock-status ${p.stock < 5 ? 'critical' : 'ok'}`}>Stok: {p.stock}</span>
                        </div>
                      </div>
                      <h4 style={{ wordBreak: 'break-word', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{p.name}</h4>
                      <p className="card-category">{translateCategory(p.category)}</p>

                      <div className="card-footer">
                        <span className="card-price">₺{p.price}</span>
                        <button className="icon-action delete mobile-btn" onClick={() => handleDeleteProduct(p.id)}>Sil 🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


              <div className="add-product-form-panel" id="add-form">
                <h3>⚡ Hızlı Ürün Ekleme</h3>
                <form onSubmit={handleSubmit} className="grid-form">
                  <div className="form-group"><label>Ürün Adı</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Fiyat (₺)</label><input name="price" value={formData.price} onChange={handleChange} type="number" required /></div>
                  <div className="form-group"><label>Görsel URL</label><input name="image" value={formData.image} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="">Seçiniz</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="submit-btn full-width">Kataloğa Ekle</button>
                </form>
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

        /* TOGGLE SWITCH */
        .setting-row { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
        .setting-info h4 { margin: 0 0 4px 0; font-size: 1rem; }
        .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #d4af37; }
        input:focus + .slider { box-shadow: 0 0 1px #d4af37; }
        input:checked + .slider:before { transform: translateX(24px); }

        /* MOBILE CARDS */
        .mobile-card-view { display: none; }
        
        @media (max-width: 768px) {
            .data-table-container { display: none; }
            .mobile-card-view { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
            
            .mobile-card {
              background: #fff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              display: flex;
              border: 1px solid #eee;
            }
            .card-image { width: 100px; height: 100%; min-height: 120px; }
            .card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
            
            .card-details { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
            .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .card-id { font-size: 0.7rem; color: #999; font-family: monospace; }
            
            .card-details h4 { font-size: 0.95rem; margin: 0; color: #333; font-family: 'Inter', sans-serif; font-weight: 600; }
            .card-category { font-size: 0.8rem; color: #666; margin-bottom: 8px; }
            
            .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
            .card-price { font-weight: 700; color: #d4af37; font-size: 1rem; }
            
            .stock-bg { background: #f9fafb; padding: 4px 8px; border-radius: 4px; }
            .stock-status { font-size: 0.75rem; font-weight: 600; color: #10b981; }
            .stock-status.critical { color: #ef4444; }

            /* Adjust Layout for Mobile */
            .admin-layout { flex-direction: column; height: auto; overflow: auto; }
            .admin-sidebar { width: 100%; height: auto; flex-shrink: 0; }
            .sidebar-nav { display: flex; overflow-x: auto; padding: 0.5rem; background: #111; gap: 1rem; }
            .nav-btn { color: #ccc; padding: 8px 12px; font-size: 0.85rem; border: 1px solid #333; border-radius: 20px; white-space: nowrap; }
            .nav-btn.active { background: #d4af37; color: #000; border-color: #d4af37; font-weight: bold; }
            
            .content-scrollable { padding: 1rem; overflow: visible; }
            
             /* Hide topbar search on mobile to save space */
            .search-bar { display: none; }
            .admin-topbar { padding: 0 1rem; }
            
            /* Mobile Buttons */
            .mobile-btn { padding: 8px 16px; border-radius: 6px; background: #fee2e2; color: #ef4444; font-weight: 600; font-size: 0.85rem; border: none; }
            .mobile-btn:hover { background: #fecaca; }
        }
      `}</style>
    </div >
  );
}


function translateCategory(cat) {
  // Basic mapping, in real app this would look up from category state or map
  // Since we now have dynamic categories, we might want to pass the list or use a hook
  // For this simple demo, we rely on the ID being close enough or just return ID if not found
  const map = {
    'rings': 'Yüzükler',
    'necklaces': 'Kolyeler',
    'bracelets': 'Bileklikler',
    'earrings': 'Küpe',
    'watches': 'Saat'
  };
  return map[cat] || cat;
}
