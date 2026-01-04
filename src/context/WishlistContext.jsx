import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAnalytics } from './AnalyticsContext'; // Import Added

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { showToast } = useToast();
    const { trackEvent } = useAnalytics(); // Hook Added

    useEffect(() => {
        // Load from local storage on mount
        const saved = localStorage.getItem('vant_wishlist');
        if (saved) {
            try {
                setWishlist(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wishlist', e);
            }
        }
    }, []);

    useEffect(() => {
        // Save to local storage on change
        localStorage.setItem('vant_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            setWishlist(prev => [...prev, product]);
            showToast(`${product.name} favorilere eklendi.`, 'success');
            trackEvent('add_to_wishlist', { productId: product.id, productName: product.name, price: product.price }); // Track Event
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        showToast('Ürün favorilerden kaldırıldı.', 'info');
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
