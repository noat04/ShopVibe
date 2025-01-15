import React from 'react';
import { useCart } from '../../stores/CartContext';
import ProductInCart from '../../component/mainProduct/ProductInCart';
import Navbar from '../../component/Navbar/Navbar';

const Cart = () => {
    const { state: { items }, deleteFromCart } = useCart();

    return (
        <div>
            <Navbar />
            <h1>Giỏ Hàng</h1>
            <div className="cart-container">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <ProductInCart
                            key={index}
                            data={item}
                            deleteFromCart={deleteFromCart}
                        />
                    ))
                ) : (
                    <h1>Giỏ hàng trống</h1>
                )}
            </div>
        </div>
    );
};

export default Cart;
