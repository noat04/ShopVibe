import React, { createContext, useReducer, useContext, useEffect } from 'react';
import cartReducer, { initialState } from './cartData';

// Create cart context
const CartContext = createContext();

// Cart Provider that provides the cart state and actions
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const total = state.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

    // Update cart in localStorage when cart items change
    useEffect(() => {
        const prevItems = JSON.parse(localStorage.getItem('cartItems'));
        if (JSON.stringify(prevItems) !== JSON.stringify(state.items)) {
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        }
    }, [state.items]);

    const cartActions = {
        addToCart: (product, quantity, color, size) =>
            dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, color, size } }),
        deleteFromCart: (productId, color, size) =>
            dispatch({ type: 'DELETE_FROM_CART', payload: { productId, color, size } }),
        toggleStatusTab: () => dispatch({ type: 'TOGGLE_STATUS_TAB' }),
    };

    return (
        <CartContext.Provider value={{ state, ...cartActions, total }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook to access cart
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
