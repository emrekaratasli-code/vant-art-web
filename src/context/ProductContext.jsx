import { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        if (saved) {
            return JSON.parse(saved);
        }
        return initialProducts.map(p => ({
            ...p,
            stock: p.stock || Math.floor(Math.random() * 50) + 5
        }));
    });

    // Save to LocalStorage whenever products change
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            price: parseFloat(product.price)
        };
        setProducts(prev => [newProduct, ...prev]);
    };

    const deleteProduct = (id) => {
        console.log("Context deleting product:", id);
        setProducts(prev => {
            const updated = prev.filter(p => String(p.id) !== String(id));
            console.log("New products length:", updated.length);
            return updated;
        });
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
