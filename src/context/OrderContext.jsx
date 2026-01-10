import { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('orders');
            return saved ? JSON.parse(saved) : [
                { id: 'ORD-1024', date: new Date().toISOString(), status: 'Delivered', amount: 1250, billingDetails: { name: 'Ayşe Yılmaz', email: 'ayse@example.com', city: 'İstanbul' } },
                { id: 'ORD-1025', date: new Date(Date.now() - 86400000).toISOString(), status: 'Shipped', amount: 450, billingDetails: { name: 'Mehmet Demir', email: 'mehmet@example.com', city: 'Ankara' } },
                { id: 'ORD-1026', date: new Date(Date.now() - 172800000).toISOString(), status: 'Preparing', amount: 3500, billingDetails: { name: 'Zeynep Kaya', email: 'zeynep@example.com', city: 'İzmir' } }
            ];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString(),
            status: 'Preparing', // Preparing, Shipped, Delivered, Cancelled
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder.id;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};
