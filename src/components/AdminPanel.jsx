import { useState, useMemo, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { supabase } from '../lib/supabaseClient';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext';


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
  const { products, addProduct, deleteProduct: deleteFromContext, fetchProducts } = useProduct();
  const { orders, updateOrderStatus } = useOrders();
  const { getStats } = useAnalytics();

  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '', material: '', stock: '' });

  // FETCHED DATA STATES
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // REUSABLE FETCH FUNCTIONS
  const fetchCategoriesData = async () => {
    try {
      const { data: catData, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      setCategories(catData || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchEmployeesData = async () => {
    try {
      const { data: empData, error } = await supabase
        .from('employees')
        .select('id, first_name, last_name, email, is_approved');

      if (error) throw error;
      setEmployees(empData || []);
    } catch (err) {
      console.error("❌ Failed to fetch employees:", err);
      setFetchError(err.message);
    }
  };

  // FETCH EMPLOYEES & CATEGORIES & CUSTOMERS
  useEffect(() => {
    // If no user, ensure we aren't stuck in loading
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        await Promise.all([
          fetchEmployeesData(),
          fetchCategoriesData(),
          (async () => {
            try {
              const { data: custData, error } = await supabase.from('profiles').select('*');
              if (error) console.warn("Profiles fetch error:", error.message);
              else setCustomers(custData || []);
            } catch (err) { console.error("Failed to fetch customers:", err); }
          })()
        ]);
      } catch (globalErr) {
        console.error("Global Data Fetch Error:", globalErr);
        setFetchError("Veri yüklenirken beklenmedik bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [activeTab, user]);

  // Placeholder state for new Category
  const [newCatName, setNewCatName] = useState('');

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
    try {
      await deleteFromContext(id);
      alert('Ürün silindi.');
      fetchProducts(); // Refresh list immediately
    } catch (e) {
      alert('Silinemedi: ' + e.message);
    }
  };

  const handleApproveWorker = async (workerId) => {
    // Only owner email can approve
    if (user.email !== 'emrekaratasli@vantonline.com') return;
    try {
      const { error } = await supabase.from('employees').update({ is_approved: true }).eq('id', workerId);
      if (error) throw error;
      setEmployees(prev => prev.map(w => w.id === workerId ? { ...w, is_approved: true } : w));
    } catch (e) { alert('Onay hatası: ' + e.message); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      // Preview
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: objectUrl, imageFile: file }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('🚀 Starting Product Submit...');
      // 0. AUTH CHECK
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      }

      let imageUrl = formData.image;

      // 1. Upload Image if file exists
      if (formData.imageFile) {
        console.log('📸 Uploading Image:', formData.imageFile.name);
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, formData.imageFile);

        if (uploadError) {
          console.error('❌ Image Upload Error:', uploadError);
          throw uploadError;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // 2. Insert into DB
      console.log('💾 Saving to DB:', { ...formData, image: imageUrl });

      // Using Context's addProduct
      await addProduct({
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock || 10)
      });

      console.log('✅ Product Saved Successfully');

      // Reset Form Safely
      setFormData(prev => ({
        name: '', price: '', category: '', image: '', description: '', material: '', stock: ''
      }));

      // Success Feedback
      if (window.confirm('✅ Ürün başarıyla eklendi! Listeyi yenilemek ister misiniz?')) {
        fetchProducts();
      } else {
        fetchProducts(); // Silent refresh anyway
      }

    } catch (error) {
      console.error('❌ Save Product CRITICAL Error:', error);

      // Safe Error Extraction to prevent "o is not a function" type crashes
      let errorMsg = 'Bir hata oluştu.';
      let errorCode = 'Bilinmiyor';

      try {
        if (typeof error === 'object') {
          errorMsg = error.message || JSON.stringify(error);
          errorCode = error.code || error.status || 'N/A';
        } else {
          errorMsg = String(error);
        }

        if (String(errorCode) === '406') {
          errorMsg = 'Hata 406: Veri formatı kabul edilmedi. (Şema veya RLS hatası olabilir)';
        }
      } catch (parseErr) {
        errorMsg = "Hata detayı okunamadı.";
      }

      alert(`Hata Oluştu!\nKod: ${errorCode}\nMesaj: ${errorMsg}`);
    } finally {
      console.log('🏁 Save process finished, resetting button...');
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      console.log('📂 Adding Category:', newCatName);
      const { data, error } = await supabase.from('categories').insert([{ name: newCatName }]).select();

      if (error) throw error;

      console.log('✅ Category Added:', data);

      setNewCatName('');
      alert('Kategori eklendi');
      fetchCategoriesData(); // Refresh dropdown immediately 
    } catch (err) {
      console.error('❌ Add Category Failed:', err);
      alert('Kategori eklenemedi: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      alert('Kategori silindi.');
      fetchCategoriesData(); // Refresh list immediately
    } catch (err) {
      alert('Silinemedi: ' + err.message);
    }
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
            <div className="drawer-footer" style={{ marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="avatar" style={{ width: 40, height: 40, background: '#d4af37', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {user.name?.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', lineHeight: '1.2' }}>{user.name}</span>
                <span style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>{isWorker ? 'Employee' : 'Owner'}</span>
              </div>
            </div>
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
                  </select>
                  <input type="text" placeholder="Materyal (Altın, Gümüş...)" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
                  <input type="number" placeholder="Stok Adedi" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                  <input type="file" onChange={handleImageUpload} className="file-input" />
                  <textarea placeholder="Ürün Açıklaması" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
                  <button type="submit" className="submit-btn full-width" disabled={isSubmitting}>
                    {isSubmitting ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
                  </button>
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
                    {Array.isArray(orders) && orders.map(o => (
                      <tr key={o.id}>
                        <td>#{o.id ? o.id.slice(0, 8) : 'N/A'}</td>
                        <td>{o.billingDetails?.name || o.user?.email || 'Misafir'}</td>
                        <td>₺{parseFloat(o.amount || 0).toLocaleString('tr-TR')}</td>
                        <td><span className={`status-badge ${o.status ? o.status.toLowerCase() : 'processing'}`}>{o.status || 'Processing'}</span></td>
                        <td>
                          <select value={o.status || 'Processing'} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="status-select">
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
              {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#d4af37' }}>
                  <div className="spinner" style={{ width: 30, height: 30, border: '3px solid rgba(212,175,55,0.3)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s infinite', margin: '0 auto 1rem' }}></div>
                  Veriler Yükleniyor...
                </div>
              ) : (
                <>
                  <div className="desktop-table-container">
                    <table className="admin-table">
                      <thead><tr><th>Ad Soyad</th><th>Email</th><th>Onay</th></tr></thead>
                      <tbody>
                        {employees.map(w => (
                          <tr key={w.id}>
                            {/* SCHEMA FIX: Use first_name last_name */}
                            <td>{w.first_name} {w.last_name}</td>
                            <td>{w.email}</td>
                            <td>
                              {!w.is_approved && (
                                <button className="gold-btn small" onClick={() => handleApproveWorker(w.id)}>Onayla</button>
                              )}
                              {w.is_approved && <span className="text-green">✔ Onaylı</span>}
                            </td>
                          </tr>
                        ))}
                        {employees.length === 0 && (
                          <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4d' }}>
                              {fetchError ? (
                                <div style={{ background: 'rgba(255, 0, 0, 0.1)', padding: '1rem', borderRadius: '4px' }}>
                                  ⚠️ {fetchError}
                                </div>
                              ) : (
                                <>
                                  <div style={{ fontWeight: 'bold' }}>Veri bulunamadı.</div>
                                  <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>Veritabanı bağlantısında veya yetkilendirmede sorun olabilir.</div>
                                </>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mobile-card-grid">
                    {employees.map(w => (
                      <div className="mobile-card" key={w.id}>
                        <div className="mobile-card-header">{w.first_name} {w.last_name}</div>
                        <div className="mobile-card-body">
                          <p>{w.email}</p>
                          {!w.is_approved && <button className="gold-btn small" onClick={() => handleApproveWorker(w.id)}>Onayla</button>}
                          {w.is_approved && <span className="text-green">✔ Onaylı</span>}
                        </div>
                      </div>
                    ))}
                    {employees.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4d' }}>
                        Personel bulunamadı. (RLS Politikası?)
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="categories-view">
              <div className="section-header"><h2>Kategori Yönetimi</h2></div>

              {/* Add Category Form */}
              <div className="luxury-card mb-4">
                <h3>Yeni Kategori</h3>
                <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Kategori Adı"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                    style={{ flex: 1, padding: '0.8rem', background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
                  />
                  <button type="submit" className="gold-btn">Ekle</button>
                </form>
              </div>

              {/* List Categories */}
              <div className="desktop-table-container">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Kategori Adı</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>
                          <button className="icon-action delete" onClick={() => handleDeleteCategory(c.id)}>🗑️ Sil</button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && <tr><td colSpan="3" className="no-data">Kategori bulunamadı.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mobile-card-grid">
                {categories.map(c => (
                  <div className="mobile-card" key={c.id}>
                    <div className="mobile-card-header">{c.name}</div>
                    <div className="mobile-card-body">
                      <button className="icon-action delete" onClick={() => handleDeleteCategory(c.id)}>Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        .mobile-drawer-overlay { display: none; }
        .mobile-card-grid { display: none; } /* Hidden on desktop */

        @media (max-width: 768px) {
          .admin-sidebar {
            display: none; /* Completely hide desktop sidebar on mobile */
          }
          
          .admin-content {
            margin-left: 0; 
            padding-top: 5rem; /* Space for mobile header */
            padding-inline: 1rem;
            width: 100%;
          }
          
          .admin-topbar { display: none; } 
          .desktop-table-container { display: none; } 
          .mobile-card-grid { display: flex; flex-direction: column; gap: 1rem; } 

          /* HEADER */
          .mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 60px;
            background: #050505;
            border-bottom: 1px solid #222;
            padding: 0 1rem;
            z-index: 1500;
          }
          .hamburger-btn {
            background: none; border: none; color: #d4af37; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;
          }
          .mobile-brand { font-family: 'Playfair Display', serif; color: #fff; font-size: 1.2rem; }

          /* DRAWER */
          .mobile-drawer-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85); 
            z-index: 2000;
            display: flex;
            animation: fadeIn 0.3s ease;
          }
          
          .mobile-drawer {
             width: 85%; max-width: 320px; 
             background: #0a0a0a; 
             height: 100vh; 
             padding: 1.5rem;
             display: flex; 
             flex-direction: column;
             border-right: 1px solid #333;
             transform: translateX(0);
             animation: slideIn 0.3s ease;
          }
          
          .drawer-header {
             display: flex; justify-content: space-between; align-items: center;
             margin-bottom: 2rem; border-bottom: 1px solid #222; padding-bottom: 1rem;
          }
          .drawer-header h3 { margin: 0; color: #d4af37; font-family: 'Playfair Display'; }
          .drawer-header button { background: none; border: none; color: #fff; cursor: pointer; }

          .drawer-nav { display: flex; flex-direction: column; gap: 0.5rem; }
          .drawer-nav button {
             width: 100%; padding: 1rem; 
             background: transparent; color: #ccc; 
             border: none; border-radius: 4px;
             text-align: left; font-size: 1rem;
             transition: 0.2s;
          }
          .drawer-nav button:hover, .drawer-nav button:active {
             background: #1a1a1a; color: #d4af37;
          }

          /* CARDS */
          .mobile-card {
            background: #0a0a0a; 
            border: 1px solid #222; 
            padding: 1rem; 
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          }
          .mobile-card-header { 
            display: flex; align-items: center; gap: 10px; 
            font-weight: bold; font-family: 'Playfair Display';
            border-bottom: 1px solid #222; 
            padding-bottom: 0.5rem; margin-bottom: 0.75rem; 
            color: #fff;
          }
          .mobile-card-header img.table-thumb {
            width: 40px; height: 40px; border-radius: 4px; object-fit: cover;
          }
          .mobile-card-body p { margin-bottom: 0.25rem; color: #bbb; font-size: 0.9rem; }
          .mobile-card-body .small-text { font-size: 0.8rem; color: #666; }
          
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        }
      `}</style>
    </div>
  );
}
