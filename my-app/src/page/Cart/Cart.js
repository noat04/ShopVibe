import React, { useReducer, useEffect } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import ProductInCart from '../../component/mainProduct/ProductInCart';
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';
import '../../component/mainProduct/ProductInCart.css';

const Cart = () => {
    const [state, dispatch] = useReducer(cartReducer, undefined, (initial) => ({
        ...initial, // load cart from localStorage initially
        items: JSON.parse(localStorage.getItem('cartItems')) || [] // Giỏ hàng ban đầu từ LocalStorage
    }));
    const { items } = state;

    // Ghi lại giỏ hàng khi state items thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }, [items]); // Lưu lại vào LocalStorage khi thay đổi giỏ hàng

    return (
        <div>
            <Navbar />
            <h1>Cart</h1>
            <div className="cart-container">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <ProductInCart
                            key={item.productId || index}
                            data={item}
                            deleteFromCart={(productId) => dispatch(deleteFromCart(productId))}
                        />

                    ))
                ) : (
                    <h1>NO ITEMS</h1>
                )}
            </div>
        </div>
    );
}

export default Cart;
