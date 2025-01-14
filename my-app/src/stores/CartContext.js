import React, { createContext, useReducer, useContext } from 'react';
import cartReducer, { initialState } from './cartData';  // default import

// Tạo một context mới cho giỏ hàng
const CartContext = createContext();

// Tạo provider để bao quanh các component sử dụng cart state
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook để dễ dàng sử dụng trong các component khác
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được sử dụng trong CartProvider');
    }
    return context;
};
