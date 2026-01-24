import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

const CartContext = createContext();

// WebView-safe hook: Returns fallback if context not available
export const useCart = () => {
    const context = useContext(CartContext);

    // If context is undefined (WebView timing issues), return safe fallback
    if (!context) {
        console.warn('⚠️ CartContext not available, using fallback');
        return {
            cartItems: [],
            isCartOpen: false,
            addToCart: () => { },
            removeFromCart: () => { },
            updateQuantity: () => { },
            toggleCart: () => { },
            clearCart: () => { },
            cartTotal: 0,
            cartCount: 0
        };
    }

    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cartItems');
            return saved ? JSON.parse(saved) : [];
        } catch {
            console.error('Failed to load cart');
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // We can't safely use useToast here if ToastProvider is not definitely above CartProvider.
    // However, we will ensure that structure in App.jsx.
    // If we want to be safe, we can pass a callback or just assume the structural change will be made.
    // Let's assume structure: ToastProvider > CartProvider.

    // For now, to avoid "useToast must be used within ToastProvider" error before App.jsx is updated,
    // we can't use it directly in the initialization if the provider isn't wrapping yet.
    // Detailed plan sets ToastProvider wrapping AppContent, which contains CartProvider.
    const { showToast } = useToast() || { showToast: () => console.log('Toast not ready') };

    // We can access Language now because we reordered App.jsx
    const { t } = useLanguage();

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        // Notify user with localized message
        if (showToast) showToast(t('addedToCart') || 'Added to Cart');

        // Open the sidebar automatically - DISABLED per user request
        // setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const cartCount = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

