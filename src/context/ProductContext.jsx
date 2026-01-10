import { createContext, useState, useContext } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        return initialProducts.map(p => ({
            ...p,
            stock: p.stock || Math.floor(Math.random() * 50) + 5 // Random stock for demo
        }));
    });

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            price: parseFloat(product.price)
        };
        setProducts(prev => [newProduct, ...prev]);
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
