import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPanel() {
    const { products, addProduct, deleteProduct } = useProducts();
    const { t } = useLanguage();
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
            </div>
            <style>{`
        .admin-section {
          padding: var(--spacing-md) 0;
          color: var(--color-text);
        }
        .admin-title {
          text-align: center;
          margin-bottom: var(--spacing-md);
          color: var(--color-accent);
          font-family: var(--font-heading);
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
      `}</style>
        </section>
    );
}
