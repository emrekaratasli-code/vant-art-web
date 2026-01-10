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
                console.log('Realtime change:', payload);
                if (payload.eventType === 'INSERT') {
                    setProducts(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'DELETE') {
                    setProducts(prev => prev.filter(p => p.id !== payload.old.id));
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
            // Optimistic update done via realtime, but distinct feedback is good
            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: product.name,
                    price: parseFloat(product.price),
                    category: product.category,
                    image: product.image, // Assuming URL is passed
                    description: product.description,
                    stock: parseInt(product.stock || 10)
                }])
                .select(); // Return detailed data

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Ürün eklenirken hata oluştu: ' + error.message);
        }
    };

    // DELETE PRODUCT
    const deleteProduct = async (id) => {
        try {
            // Optimistic delete happens via realtime or can be manual if needed
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Silme işlemi başarısız: ' + error.message);
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct, loading, fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
