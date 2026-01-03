import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';

export default function AdminPanel() {
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    material: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) return;

    addProduct(formData);
    setFormData({ name: '', price: '', category: '', image: '', description: '', material: '' });
    alert(t('addedAlert'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="admin-section">
      <div className="container">
        <h2 className="admin-title">{t('adminTitle')}</h2>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            {t('currentCollection')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            {t('adminOrders')}
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="admin-grid">
            <div className="add-product-form">
              <h3>{t('addProductTitle')}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('nameLabel')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('namePlaceholder')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('priceLabel')}</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder={t('pricePlaceholder')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('categoryLabel')}</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder={t('categoryPlaceholder')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('materialLabel')}</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder={t('materialPlaceholder')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('descLabel')}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('descPlaceholder')}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>{t('imageLabel')}</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder={t('imagePlaceholder')}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">{t('addBtn')}</button>
              </form>
            </div>

            <div className="product-list">
              <h3>{t('currentCollection')} ({products.length})</h3>
              <div className="list-container">
                {products.map(p => (
                  <div key={p.id} className="list-item">
                    <div className="item-info">
                      <img src={p.image} alt={p.name} />
                      <div>
                        <h4 title={p.description}>{p.name}</h4>
                        <p>${p.price}</p>
                        {p.material && <span className="item-material">{p.material}</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteProduct(p.id)} className="delete-btn">{t('removeBtn')}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="orders-panel">
            {orders.length === 0 ? (
              <p className="no-data">{t('noOrders')}</p>
            ) : (
              <div className="table-responsive">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>{t('orderId')}</th>
                      <th>{t('orderDate')}</th>
                      <th>{t('customer')}</th>
                      <th>{t('total')}</th>
                      <th>{t('status')}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{order.billingDetails?.name || 'Guest'}</td>
                        <td>{order.amount ? `₺${(order.amount).toLocaleString()}` : '-'}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {t(`status${order.status}`) || order.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="Preparing">{t('statusPreparing')}</option>
                            <option value="Shipped">{t('statusShipped')}</option>
                            <option value="Delivered">{t('statusDelivered')}</option>
                            <option value="Cancelled">{t('statusCancelled')}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        .admin-section {
          padding: var(--spacing-md) 0;
          color: var(--color-text);
          min-height: 80vh;
        }
        .admin-title {
          text-align: center;
          margin-bottom: var(--spacing-md);
          color: var(--color-accent);
          font-family: var(--font-heading);
        }
        .admin-tabs {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .tab-btn {
            background: transparent;
            border: 1px solid var(--color-border);
            color: var(--color-text-muted);
            padding: 0.5rem 1.5rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: var(--font-heading);
        }
        .tab-btn.active {
            background: var(--color-accent);
            color: #000;
            border-color: var(--color-accent);
            font-weight: bold;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr; }
        }
        h3 {
          margin-bottom: var(--spacing-sm);
          font-size: 1.25rem;
          color: var(--color-text);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.5rem;
        }
        
        .add-product-form {
          background: var(--color-surface);
          padding: var(--spacing-md);
          border: 1px solid var(--color-border);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          font-family: var(--font-body);
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--color-accent);
          outline: none;
        }
        
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--color-accent);
          color: var(--color-bg);
          font-weight: 700;
          text-transform: uppercase;
          transition: 0.3s;
        }
        .submit-btn:hover {
          background: var(--color-accent-hover);
        }

        .product-list {
          background: var(--color-surface);
          padding: var(--spacing-md);
          border: 1px solid var(--color-border);
          height: fit-content;
        }
        .list-container {
          max-height: 600px;
          overflow-y: auto;
        }
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .item-info {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .item-info img {
          width: 50px;
          height: 50px;
          object-fit: cover;
        }
        .item-info h4 {
          font-size: 0.95rem;
          color: var(--color-text);
          margin: 0;
        }
        .item-info p {
          font-size: 0.85rem;
          color: var(--color-accent);
          margin: 0.1rem 0;
        }
        .item-material {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        .delete-btn {
          color: #ff4d4d;
          font-size: 0.8rem;
          text-decoration: underline;
        }
        .delete-btn:hover {
          color: #ff1a1a;
        }

        /* Order Table */
        .orders-panel {
            background: var(--color-surface);
            padding: 1rem;
            border-radius: var(--radius-sm);
            border: 1px solid var(--color-border);
            overflow-x: auto;
        }
        .orders-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .orders-table th, .orders-table td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid var(--color-border);
        }
        .orders-table th {
            color: var(--color-text-muted);
            font-weight: 500;
        }
        .status-badge {
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-badge.preparing { background: rgba(212, 175, 55, 0.2); color: var(--color-accent); }
        .status-badge.shipped { background: rgba(0, 128, 0, 0.2); color: #4ade80; }
        .status-badge.delivered { background: rgba(0, 0, 255, 0.2); color: #60a5fa; }
        .status-badge.cancelled { background: rgba(255, 0, 0, 0.2); color: #f87171; }

        .status-select {
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            color: var(--color-text);
            padding: 0.3rem;
        }
      `}</style>
    </section>
  );
}
