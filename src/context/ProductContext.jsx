import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH PRODUCTS
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        // REALTIME SUBSCRIPTION
        const subscription = supabase
            .channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setProducts(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'DELETE') {
                    // Robustly remove using ID, handling potential type mismatches
                    setProducts(prev => prev.filter(p => p.id != payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // ADD PRODUCT
    const addProduct = async (product) => {
        try {
            const payload = {
                name: product.name,
                price: parseFloat(product.price),
                category: product.category,
                // User requested 'image_url' instead of 'image'
                image_url: product.image,
                description: product.description,
                material: product.material, // Added material
                stock: parseInt(product.stock || 10)
            };

            console.log('📦 Sending Product Payload used for DB:', payload);

            const { data, error } = await supabase
                .from('products')
                .insert([payload])
                .select();

            if (error) throw error;
            // Optimistic update handled by realtime or can be manual:
            // if(data) setProducts([data[0], ...products]); 
            return data;
        } catch (error) {
            console.error('Error adding product:', error);
            // Explicitly show error as requested by user
            alert(`Hata kodu: ${error.code || error.status || 'Bilinmiyor'} - ${error.message || 'Yetki Eksikliği'}`);
            throw error; // Re-throw so AdminPanel knows it failed
        }
    };

    // DELETE PRODUCT (Robust)
    const deleteProduct = async (id) => {
        try {
            // 1. Optimistic Update (Instant Feedback)
            const prevProducts = [...products];
            setProducts(prev => prev.filter(p => p.id !== id));

            // 2. Perform Delete
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            // 3. Rollback if error
            if (error) {
                console.error('Supabase delete error:', error);
                setProducts(prevProducts); // Revert
                throw error;
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Silme işlemi başarısız: ' + error.message);
            throw error; // Re-throw so caller knows
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct, loading, fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
