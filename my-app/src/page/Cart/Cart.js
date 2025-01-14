import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import ProductInCart from '../../component/mainProduct/ProductInCart';
import { loadCartFromLocalStorage } from '../../stores/cartData'; // Import action để load từ localStorage
import '../../component/mainProduct/ProductInCart.css';

const Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart || { items: [] });
    console.log(localStorage.getItem('cartItems'));  // Kiểm tra xem dữ liệu giỏ hàng có tồn tại trong localStorage không

    const [loading, setLoading] = useState(true);

    // useEffect để load giỏ hàng từ localStorage vào Redux store
    useEffect(() => {
        dispatch(loadCartFromLocalStorage());  // Load giỏ hàng từ localStorage
        setLoading(false);  // Đặt loading thành false sau khi load xong
    }, [dispatch]);  // Chạy một lần khi component mount

    return (
        <div>
            <Navbar />
            <h1>Cart</h1>
            <div className="cart-container">
                {loading ? (
                    <p>Loading...</p>
                ) : cart.items.length > 0 ? (
                    cart.items.map((item, index) => (
                        <ProductInCart key={item.productId || index} data={item} />
                    ))
                ) : (
                    <h1>NO ITEMS</h1>
                )}
            </div>
        </div>
    );
}

export default Cart;

