import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';
import { useEffect } from 'react';

// Test component to consume context
const TestComponent = ({ action }) => {
    const cart = useCart();

    useEffect(() => {
        if (action) action(cart);
    }, [action, cart]);

    return (
        <div>
            <span data-testid="count">{cart.cartCount}</span>
            <span data-testid="total">{cart.cartTotal}</span>
        </div>
    );
};

describe('CartContext Logic', () => {
    it('should initialize with 0 items', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );
        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('should add items to cart', () => {
        let addToCartFn;

        render(
            <CartProvider>
                <TestComponent action={(cart) => { addToCartFn = cart.addToCart; }} />
            </CartProvider>
        );

        act(() => {
            addToCartFn({ id: 1, price: 100, name: 'Test Item' });
        });

        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('total')).toHaveTextContent('100');
    });
});
