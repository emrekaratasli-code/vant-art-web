import { useState, useMemo, useEffect } from 'react';
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
  const { orders, updateOrderStatus } = useOrders();
  const { getStats } = useAnalytics();
  const { settings, updateSetting } = useSettings();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '', material: '' });

  // CUSTOMER DATA STATE (Persisted)
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('vant_customers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 101, name: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '0532 111 22 33', city: 'İstanbul', totalOrders: 3, lastLogin: '2 gün önce' },
      { id: 102, name: 'Mehmet Demir', email: 'mehmet@example.com', phone: '0555 444 55 66', city: 'Ankara', totalOrders: 1, lastLogin: '1 hafta önce' },
      { id: 103, name: 'Zeynep Kaya', email: 'zeynep@example.com', phone: '0542 999 88 77', city: 'İzmir', totalOrders: 5, lastLogin: 'Bugün' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('vant_customers', JSON.stringify(customers));
  }, [customers]);

  // WORKER DATA STATE (Persisted)
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('vant_workers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Ahmet', surname: 'Yılmaz', email: 'ahmet@vantonline.com', position: 'Depo Sorumlusu', role: 'worker', status: 'active', salary: 28000, startDate: '2024-01-15' },
      { id: 2, name: 'Zeynep', surname: 'Kaya', email: 'zeynep@vantonline.com', position: 'Satış Uzmanı', role: 'worker', status: 'active', salary: 32000, startDate: '2023-11-20' },
      { id: 3, name: 'Can', surname: 'Vural', email: 'can@vantonline.com', position: 'Stajyer', role: 'worker', status: 'pending', salary: 17002, startDate: '2025-01-09' }
    ];
  });

  // Save workers to LocalStorage whenever usage changes
  useEffect(() => {
    localStorage.setItem('vant_workers', JSON.stringify(workers));
  }, [workers]);

  // Transactional Delete Product (Async + Optimistic UI + Rollback)
  const handleDeleteProduct = async (id) => {
    // 1. Authorization Check (Godmode > Owner > Active Worker)
    const isGodmode = user?.email === 'emrekaratasli@vantonline.com';
    const isOwner = user?.role === 'owner';
    const currentWorkerProfile = workers.find(w => w.email === user?.email);
    const isActiveWorker = user?.role === 'worker' && currentWorkerProfile?.status === 'active';

    if (!isGodmode && !isOwner && !isActiveWorker) {
      alert('⛔ Yetkiniz yok! Bu işlem için onaylı personel veya yönetici olmalısınız.');
      return;
    }

    // 2. Confirmation Modal
    if (!window.confirm('⚠️ Bu ürünü silmek üzeresiniz. Bu işlem geri alınamaz!\n\nDevam etmek istiyor musunuz?')) {
      return;
    }

    // 3. Optimistic UI Logic
    const previousProducts = [...products]; // Backup for rollback
    // Optimistically remove from context (simulated here since context is local-only)
    deleteFromContext(id);

    try {
      // 4. Simulate Async Backend Request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 10% failure chance for robust testing
          const success = Math.random() > 0.1;
          success ? resolve() : reject(new Error('Sunucu yanıt vermedi.'));
        }, 600);
      });
      // Success Notification (Toast would be better, using alert for now as per minimal deps)
      // console.log('Product deleted successfully');
    } catch (error) {
      // 5. Rollback on Failure
      console.error('Delete failed, rolling back:', error);
      alert('❌ Silme işlemi başarısız oldu! Değişiklikler geri alınıyor.');
      // Ideally we would have a 'setProducts' exposed or 'addProduct' back, 
      // but since we rely on sync context, we might need a reload or a restore function.
      // For this "Production" mock, we'll verify the concept. 
      // Since context set is one-way here, let's warn. In real app, we'd dispatch({ type: 'RESTORE', payload: previousProducts });
      // Reloading is a brute-force rollback for this specific architecture.
      window.location.reload();
    }
  };

  // Local Media Pipeline
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Lütfen geçerli bir resim dosyası (.jpg, .png) seçiniz.');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: objectUrl });
    }
  };

  // ... (existing helper functions)

  // ...

  // Update form render
  {/* <div className="form-group"><label>Görsel URL</label><input name="image" value={formData.image} onChange={handleChange} required /></div> */ }

  // We need to replace the form part later in the file.
  // This replacement block focuses on the logic handlers.
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

          <button className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <IconUsers /> <span>Müşteriler</span>
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
                      {/* SAFE SORT (Low to high) */}
                      {(products || []).sort((a, b) => (a.stock || 0) - (b.stock || 0)).slice(0, 4).map(p => (
                        <li key={p.id} className="stock-item">
                          <img src={p.image} alt="" onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=Prod' }} />
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
                        <button className="mobile-btn" style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', zIndex: 10, cursor: 'pointer' }} onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(p.id);
                        }}>Sil 🗑️</button>
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
                  <div className="form-group">
                    <label>Ürün Görseli</label>
                    <div className="image-upload-container" style={{ border: '2px dashed #ccc', padding: '1rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>
                      <input type="file" id="prod-img" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      <label htmlFor="prod-img" style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
                        {formData.image ? (
                          <div style={{ position: 'relative' }}>
                            <img src={formData.image} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '4px' }} />
                            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#666' }}>Görseli Değiştir</div>
                          </div>
                        ) : (
                          <div style={{ padding: '20px' }}>
                            <span style={{ fontSize: '2rem' }}>📷</span>
                            <p>Fotoğraf Yükle veya Sürükle</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
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

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="orders-view">
              <div className="section-header"><h2>Sipariş Yönetimi</h2></div>
              <div className="data-table-container">
                {(!orders || orders.length === 0) ? <div className="empty-state">Henüz sipariş yok.</div> :
                  <table className="data-table">
                    <thead><tr><th>Sipariş No</th><th>Müşteri</th><th>Tarih</th><th>Tutar</th><th>Durum</th></tr></thead>
                    <tbody>
                      {(orders || []).map(o => (
                        <tr key={o.id}>
                          <td className="font-mono">#{o.id}</td>
                          <td>{o.billingDetails?.name}<br /><span className="sub-text">{o.billingDetails?.email}</span></td>
                          <td>{new Date(o.date).toLocaleDateString()}</td>
                          <td className="font-mono">₺{o.amount}</td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                              className={`status-select ${o.status === 'Cancelled' ? 'cancelled' : ''}`}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '0.8rem',
                                background: o.status === 'Delivered' ? '#dcfce7' : (o.status === 'Cancelled' ? '#fee2e2' : '#fff'),
                                color: o.status === 'Delivered' ? '#16a34a' : (o.status === 'Cancelled' ? '#ef4444' : '#333')
                              }}
                            >
                              <option value="Preparing">Hazırlanıyor</option>
                              <option value="Shipped">Kargolandı</option>
                              <option value="Delivered">Teslim Edildi</option>
                              <option value="Cancelled">İptal Edildi</option>
                            </select>
                          </td>
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
              <div className="data-table-container">
                <table className="data-table">
                  <thead><tr><th>Müşteri</th><th>İletişim</th><th>Konum</th><th>Siparişler</th><th>Son Giriş</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td className="font-bold">{c.name}</td>
                        <td>{c.email}<br /><span className="sub-text">{c.phone}</span></td>
                        <td>{c.city}</td>
                        <td><span className="badge-pill">{c.totalOrders} Sipariş</span></td>
                        <td className="text-muted">{c.lastLogin}</td>
                        <td>
                          <button className="icon-action delete" onClick={() => {
                            if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
                              setCustomers(customers.filter(cust => cust.id !== c.id));
                            }
                          }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View for Customers */}
              <div className="mobile-card-view">
                {customers.map(c => (
                  <div key={c.id} className="mobile-card">
                    <div className="card-details">
                      <div className="card-header">
                        <span className="font-bold">{c.name}</span>
                        <span className="badge-pill">{c.totalOrders} Sipariş</span>
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>{c.email}</p>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>{c.phone}</p>

                      <div className="card-footer" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', justifyContent: 'flex-end' }}>
                        <button className="mobile-btn" style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => {
                          if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
                            setCustomers(customers.filter(cust => cust.id !== c.id));
                          }
                        }}>Sil 🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKERS VIEW */}
          {activeTab === 'workers' && (
            <div className="workers-view">
              <div className="section-header">
                <h2>Çalışan Yönetimi</h2>
                <button className="primary-btn" onClick={() => document.getElementById('add-worker-form').scrollIntoView({ behavior: 'smooth' })}>
                  + Yeni Çalışan Ekle
                </button>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ad Soyad</th>
                      <th>Pozisyon</th>
                      <th>Maaş</th>
                      <th>Durum / Yetki</th>
                      <th>İşe Giriş</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(worker => (
                      <tr key={worker.id} style={{ opacity: worker.status === 'pending' ? 0.6 : 1 }}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar-circle" style={{ background: worker.role === 'owner' ? '#d4af37' : '#2a2a2a' }}>{worker.name.charAt(0)}</div>
                            <div>
                              <div className="font-bold">{worker.name} {worker.surname}</div>
                              <div className="sub-text">{worker.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{worker.position}</td>
                        <td className="font-mono">₺{worker.salary ? worker.salary.toLocaleString() : '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                            <span className={`badge-status ${worker.role === 'admin' || worker.role === 'owner' ? 'shipped' : 'pending'}`}>
                              {worker.role === 'owner' ? 'OWNER' : (worker.role === 'admin' ? 'Yönetici' : 'Çalışan')}
                            </span>
                            {worker.status === 'pending' && <span className="badge-status critical" style={{ fontSize: '0.65rem' }}>Onay Bekliyor</span>}
                          </div>
                        </td>
                        <td>{worker.startDate}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            {worker.status === 'pending' && user.role === 'owner' && (
                              <button className="primary-btn" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => {
                                setWorkers(workers.map(w => w.id === worker.id ? { ...w, status: 'active' } : w));
                              }}>✅ Onayla</button>
                            )}
                            {worker.role !== 'owner' && (
                              <button className="icon-action delete" onClick={() => {
                                if (window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
                                  setWorkers(workers.filter(w => w.id !== worker.id));
                                }
                              }}>🗑️</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW FOR WORKERS */}
              <div className="mobile-card-view">
                {workers.map(worker => (
                  <div key={worker.id} className="mobile-card" style={{ opacity: worker.status === 'pending' ? 0.7 : 1 }}>
                    <div className="card-details">
                      <div className="card-header">
                        <span className="card-id">#{worker.id}</span>
                        <span className={`badge-status ${worker.status === 'active' ? 'shipped' : 'pending'}`}>{worker.status === 'active' ? 'Aktif' : 'Onay Bekliyor'}</span>
                      </div>
                      <h4>{worker.name} {worker.surname}</h4>
                      <p className="card-category">{worker.position}</p>

                      <span style={{ fontSize: '0.8rem', color: '#666' }}>{worker.email}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                        <span className="font-mono" style={{ fontWeight: 'bold' }}>₺{worker.salary}</span>

                        <div className="card-actions" style={{ display: 'flex', gap: '10px' }}>
                          {worker.status === 'pending' && user.role === 'owner' && (
                            <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => {
                              setWorkers(workers.map(w => w.id === worker.id ? { ...w, status: 'active' } : w));
                            }}>Onayla ✅</button>
                          )}
                          {worker.role !== 'owner' && (
                            <button className="icon-action delete mobile-btn" onClick={() => {
                              if (window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
                                setWorkers(workers.filter(w => w.id !== worker.id));
                              }
                            }}>Sil 🗑️</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-product-form-panel" id="add-worker-form">
                <h3>👥 Yeni Çalışan Ekle (Pasif Olarak Eklenir)</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Regex Validations
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const phoneRegex = /^[0-9]{10,11}$/;

                  if (!workerFormData.name || !workerFormData.email || !workerFormData.phone) {
                    alert('Lütfen tüm zorunlu alanları doldurunuz.');
                    return;
                  }
                  if (!emailRegex.test(workerFormData.email)) {
                    alert('Geçerli bir e-posta adresi giriniz.');
                    return;
                  }
                  if (!phoneRegex.test(workerFormData.phone)) {
                    alert('Geçerli bir telefon numarası giriniz (10-11 hane, sadece rakam).');
                    return;
                  }

                  setWorkers([...workers, { ...workerFormData, id: Date.now(), status: 'pending' }]);
                  setWorkerFormData({ name: '', surname: '', email: '', phone: '', position: 'Satış Temsilcisi', role: 'worker', salary: '', startDate: '' });
                  alert('Çalışan başarıyla listeye eklendi. Erişim için yönetici onayı gereklidir.');
                }} className="grid-form">
                  <div className="form-group"><label>Ad</label><input value={workerFormData.name} onChange={e => setWorkerFormData({ ...workerFormData, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Soyad</label><input value={workerFormData.surname} onChange={e => setWorkerFormData({ ...workerFormData, surname: e.target.value })} required /></div>
                  <div className="form-group"><label>E-posta (@vantonline.com)</label><input type="email" value={workerFormData.email} onChange={e => setWorkerFormData({ ...workerFormData, email: e.target.value })} required /></div>
                  <div className="form-group"><label>Telefon</label><input type="tel" placeholder="05551234567" value={workerFormData.phone} onChange={e => setWorkerFormData({ ...workerFormData, phone: e.target.value })} required /></div>

                  <div className="form-group"><label>Pozisyon</label>
                    <select value={workerFormData.position} onChange={e => setWorkerFormData({ ...workerFormData, position: e.target.value })}>
                      <option value="Satış Temsilcisi">Satış Temsilcisi</option>
                      <option value="Depo Sorumlusu">Depo Sorumlusu</option>
                      <option value="Operasyon Müdürü">Operasyon Müdürü</option>
                      <option value="Stajyer">Stajyer</option>
                      <option value="Muhasebe">Muhasebe</option>
                    </select>
                  </div>

                  <div className="form-group"><label>Maaş (₺)</label><input type="number" value={workerFormData.salary} onChange={e => setWorkerFormData({ ...workerFormData, salary: e.target.value })} required /></div>
                  <div className="form-group"><label>İşe Giriş Tarihi</label><input type="date" value={workerFormData.startDate} onChange={e => setWorkerFormData({ ...workerFormData, startDate: e.target.value })} required /></div>

                  <div className="form-group"><label>Yetki Seviyesi</label>
                    <select value={workerFormData.role} onChange={e => setWorkerFormData({ ...workerFormData, role: e.target.value })}>
                      <option value="worker">Çalışan (Kısıtlı)</option>
                      <option value="admin">Yönetici (Tam Yetki)</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn full-width">Kayıt Oluştur</button>

                </form>
              </div>
            </div>
          )}


          {/* CATEGORIES VIEW */}
          {activeTab === 'categories' && (
            <div className="categories-view">
              <div className="section-header">
                <h2>Kategori Yönetimi</h2>
                <button className="primary-btn" onClick={() => document.getElementById('add-cat-form').scrollIntoView({ behavior: 'smooth' })}>
                  + Yeni Kategori
                </button>
              </div>

              {/* DESKTOP TABLE */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>İkon</th>
                      <th>Kategori Adı</th>
                      <th>Açıklama</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td style={{ fontSize: '1.5rem' }}>{cat.icon}</td>
                        <td className="font-bold">{cat.name}</td>
                        <td className="text-muted">{cat.description}</td>
                        <td>
                          <button className="icon-action delete" onClick={() => {
                            if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
                              setCategories(categories.filter(c => c.id !== cat.id));
                            }
                          }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="mobile-card-view">
                {categories.map(cat => (
                  <div key={cat.id} className="mobile-card">
                    <div className="card-details">
                      <div className="card-header">
                        <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                      </div>
                      <h4>{cat.name}</h4>
                      <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>{cat.description}</p>

                      <div className="card-footer" style={{ borderTop: '1px solid #eee', paddingTop: '8px', justifyContent: 'flex-end' }}>
                        <button className="icon-action delete mobile-btn" onClick={() => {
                          if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
                            setCategories(categories.filter(c => c.id !== cat.id));
                          }
                        }}>Kategoriyi Sil 🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-product-form-panel" id="add-cat-form">
                <h3>📂 Yeni Kategori Ekle</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!categoryFormData.name || !categoryFormData.id) return;
                  setCategories([...categories, categoryFormData]);
                  setCategoryFormData({ id: '', name: '', icon: '', description: '' });
                  alert('Kategori eklendi.');
                }} className="grid-form">
                  <div className="form-group"><label>Kategori ID (örn: saatler)</label><input value={categoryFormData.id} onChange={e => setCategoryFormData({ ...categoryFormData, id: e.target.value.toLowerCase().replace(/ /g, '-') })} required /></div>
                  <div className="form-group"><label>Kategori Adı</label><input value={categoryFormData.name} onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })} required /></div>
                  <div className="form-group"><label>İkon (Emoji)</label><input value={categoryFormData.icon} onChange={e => setCategoryFormData({ ...categoryFormData, icon: e.target.value })} placeholder="⌚" /></div>
                  <div className="form-group"><label>Açıklama</label><input value={categoryFormData.description} onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })} /></div>
                  <button type="submit" className="submit-btn full-width">Kategori Oluştur</button>
                </form>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="settings-view">
              <div className="section-header"><h2>Panel Ayarları</h2></div>

              <div className="widget-box" style={{ maxWidth: '600px' }}>
                <h3>📢 Sosyal Kanıt Yönetimi</h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <h4>Aktif Ziyaretçi Gösterimi</h4>
                    <p className="text-muted text-sm">Ürün detay sayfalarında "Şu an X kişi inceliyor" uyarısını göster.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.showSocialProof}
                      onChange={(e) => updateSetting('showSocialProof', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="widget-box" style={{ maxWidth: '600px', marginTop: '2rem' }}>
                <h3>⚠️ Bakım Modu</h3>
                <div className="setting-row">
                  <div className="setting-info">
                    <h4>Siteyi Bakım Moduna Al</h4>
                    <p className="text-muted text-sm">Sadece adminler siteye erişebilir. Ziyaretçiler bakım sayfası görür.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
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
        .admin-layout { display: flex; height: 100vh; background: #f4f5f7; font-family: var(--font-body); overflow: hidden; }
        .admin-sidebar { width: 260px; background: #1a1a1a; color: #fff; display: flex; flex-direction: column; flex-shrink: 0; transition: width 0.3s; }
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .content-scrollable { flex: 1; overflow-y: auto; padding: 2rem; }

        /* SIDEBAR */
        .sidebar-header { padding: 1.5rem; border-bottom: 1px solid #333; }
        .sidebar-header h2 { font-family: var(--font-heading); font-size: 1.5rem; letter-spacing: 1px; }
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
        
        @media (max-width: 768px) {
            .data-table-container { display: none; }
        }
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
