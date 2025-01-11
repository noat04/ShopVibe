import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartData';

export const store = configureStore({
    reducer: {
        cart: cartReducer,

    }
});