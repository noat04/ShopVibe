import React from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './CartItem.css';

const CartTab = () => {
    const carts = useSelector(store => store.cart.items);
    const statusTab = useSelector((store) => store.cart.statusTab);
    console.log("StatusTab:", statusTab); // Kiểm tra giá trị statusTab khi nhấn giỏ hàng

    return (
        <div
            className={`cart-tab position-fixed top-0 end-0 bg-dark text-white w-25 h-100 z-index:1050
            ${statusTab ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ transition: 'transform 0.3s ease' }}
        >
            <h2 className="p-4">Shopping Cart</h2>
            <div className="overflow-auto" style={{ height: 'calc(100% - 120px)' }}>
                {carts.map((item, index) => (
                    <CartItem key={index} data={item} />
                ))}
            </div>
            <div className="d-flex justify-content-between p-3">
                <button className="btn btn-light">CLOSE</button>
                <button className="btn btn-danger">CHECKOUT</button>
            </div>
        </div>
    );
};

export default CartTab;
