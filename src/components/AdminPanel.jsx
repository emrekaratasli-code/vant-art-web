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
        // EXPLICITLY SELECT first_name, last_name. DO NOT USE 'name'.
        const { data: empData, error } = await supabase.from('employees').select('id, first_name, last_name, email, status, is_approved');
        if (error) throw error;
        if (empData) setEmployees(empData);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
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
              <main className="admin-content">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'employees' && renderEmployees()}
                {activeTab === 'settings' && <div className="placeholder-view">Ayarlar Yapım Aşamasında</div>}
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
          position: fixed; /* Fixed for simpler desktop layout too, or sticky */
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
        .admin-badge { font-size: 0.7rem; background: #222; padding: 2px 6px; border-radius: 4px; margin-top: 5px; color: #888; }
        
        .close-btn-mobile {
          display: none; /* Desktop hidden */
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .admin-nav {
          flex: 1;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-nav button {
          background: transparent;
          border: none;
          color: #888;
          text-align: left;
          padding: 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .admin-nav button:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .admin-nav button.active {
          color: #d4af37;
          background: rgba(212,175,55,0.1);
          border-left: 3px solid #d4af37;
        }

        .sidebar-footer {
          padding: 2rem;
          border-top: 1px solid #222;
        }
        .logout-btn {
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid #333;
          color: #ff4d4d;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover { border-color: #ff4d4d; background: rgba(255, 77, 77, 0.1); }

        /* --- MAIN CONTENT --- */
        .admin-content {
          flex: 1;
          margin-left: 260px; /* Offset for sidebar */
          padding: 2rem;
          overflow-y: auto;
        }

        .luxury-card {
          background: #0f0f0f;
          border: 1px solid #222;
          padding: 1.5rem;
          border-radius: 8px;
        }
        .no-data {
          color: #666;
          font-style: italic;
          padding: 1rem;
          text-align: center;
        }

        /* --- STATS GRID --- */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card h3 { font-size: 0.9rem; color: #888; margin-bottom: 0.5rem; }
        .stat-value { font-size: 1.8rem; font-weight: bold; color: #f0f0f0; }

        /* --- CHARTS --- */
        .charts-section { margin-bottom: 2rem; }
        .chart-container h3 { color: #d4af37; margin-bottom: 1rem; }

        /* --- TABLES --- */
        .table-responsive { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .admin-table th { text-align: left; padding: 1rem; color: #666; border-bottom: 1px solid #222; font-weight: normal; font-size: 0.8rem; }
        .admin-table td { padding: 1rem; border-bottom: 1px solid #1a1a1a; color: #ddd; vertical-align: middle; }
        .product-cell { display: flex; alignItems: center; gap: 1rem; }
        .table-thumb { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; background: #222; }
        
        .gold-btn {
          background: #d4af37; color: #000; border: none; padding: 0.5rem 1rem; cursor: pointer; font-weight: bold;
        }

        .action-btn { background: none; border: none; cursor: pointer; font-size: 0.8rem; margin-right: 0.5rem; }
        .delete { color: #ff4d4d; }
        .approve { color: #4caf50; }
        .view { color: #d4af37; }

        /* --- RESPONSIVE / MOBILE --- */
        .mobile-admin-header { display: none; }
        .sidebar-overlay { display: none; }

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
          .mobile-title {
            color: #d4af37; font-weight: bold; letter-spacing: 0.1em;
          }

          .close-btn-mobile { display: block; }
          
          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
        }
      `}</style>
            </div>
          );
}
