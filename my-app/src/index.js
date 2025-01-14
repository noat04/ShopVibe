import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './stores/CartContext'; // Import CartProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Bao bọc ứng dụng bằng CartProvider để cung cấp cart context cho toàn bộ ứng dụng
  <CartProvider>
    <App />
  </CartProvider>
);
