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
            const formattedOrders = (data || []).map(o => {
                // Extract Name from Shipping Address (JSONB) or User fallback
                const firstName = o.shipping_address?.name || '';
                const lastName = o.shipping_address?.surname || '';
                const fullName = (firstName + ' ' + lastName).trim();

                return {
                    ...o,
                    date: o.created_at,
                    billingDetails: {
                        name: fullName || o.guest_email || o.user?.email || 'Misafir',
                        email: o.shipping_address?.email || o.guest_email || o.user?.email
                    }
                };
            });

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

    // SEND NOTIFICATION EMAIL
    const sendShippingEmail = async (orderId, trackingNumber, customerEmail, customerName) => {
        try {
            // Only send if we have an email
            if (!customerEmail) return;

            console.log('Sending email to:', customerEmail);

            await fetch('/api/send-shipping-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: customerEmail,
                    trackingNumber,
                    customerName
                })
            });
        } catch (err) {
            console.error('Failed to send email:', err);
        }
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
            const updatedOrders = orders.map(o => o.id === id ? { ...o, ...updateData } : o);
            setOrders(updatedOrders);

            // TRIGGER EMAIL IF SHIPPED
            if (newStatus === 'Shipped' && trackingNumber) {
                const order = orders.find(o => o.id === id);
                if (order) {
                    const email = order.billingDetails?.email || order.user?.email;
                    const name = order.billingDetails?.name;
                    // Don't await email sending to keep UI snappy
                    sendShippingEmail(id, trackingNumber, email, name);
                }
            }

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
