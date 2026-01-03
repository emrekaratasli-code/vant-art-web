import { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('orders');
            return saved ? JSON.parse(saved) : [];
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
