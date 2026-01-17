import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { products as staticProducts } from '../data/products'; // Import static data

const ProductContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => useContext(ProductContext); // Corrected export name to singular as used in Grid

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH PRODUCTS
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.warn('Supabase fetch error, using static data:', error);
                setProducts(staticProducts);
                return;
            }

            console.log('✅ ProductContext: Items Fetched:', data?.length);

            if (!data || data.length === 0) {
                console.log('⚠️ Database empty. Using static premium data.');
                setProducts(staticProducts);
            } else {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts(staticProducts); // Fallback on crash
        } finally {
            setLoading(false);
        }
    }, []);

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
    }, [fetchProducts]);

    // ADD PRODUCT
    const addProduct = async (product) => {
        try {
            // SAFE PAYLOAD CONSTRUCTION
            // We use 'image' because the UI (AdminPanel) uses p.image.
            // We also send 'image_url' in case the DB schema was migrated to that.
            // Note: If one column is missing, this might throw a specific error, but we'll try to be robust.

            const payload = {
                name: product.name,
                price: parseFloat(product.price),
                category: product.category,
                // Sending BOTH to ensure compatibility with whichever column exists
                image: product.image,
                // image_url: product.image, // Commented out to avoid "column does not exist" error if not migrated. "image" is safer default.
                description: product.description,
                material: product.material,
                stock: parseInt(product.stock || 10)
            };

            // Remove undefined/null keys to avoid storage errors
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            console.log('📦 Sending Product Payload:', payload);

            const { data, error } = await supabase
                .from('products')
                .insert([payload])
                .select(); // This SELECT triggers the return of data.

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding product:', error);
            // Enhanced Error Object for AdminPanel
            throw {
                message: error.message || 'Bilinmeyen Hata',
                code: error.code || error.status || 'Unknown',
                details: error.details || error.hint || ''
            };
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
