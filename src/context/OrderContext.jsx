import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH ORDERS
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          user:user_id (email)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform Data
            const formattedOrders = (data || []).map(o => ({
                ...o,
                date: o.created_at,
                billingDetails: {
                    name: o.guest_email || o.user?.email || 'Misafir',
                    email: o.guest_email || o.user?.email
                }
            }));

            setOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // REALTIME
        const channel = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addOrder = async (orderData) => {
        const { error } = await supabase.from('orders').insert([orderData]);
        if (error) console.error(error);
    };

    const updateOrderStatus = async (id, newStatus, trackingNumber = null) => {
        try {
            const updateData = { status: newStatus };
            if (trackingNumber !== null) {
                updateData.tracking_number = trackingNumber;
            }

            const { error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            // Optimistic UI update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updateData } : o));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Durum güncellenemedi.');
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, loading }}>
            {children}
        </OrderContext.Provider>
    );
};
