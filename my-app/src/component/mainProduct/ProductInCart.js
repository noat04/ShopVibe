import React from 'react';
import { toast } from 'react-toastify';

const ProductInCart = ({ data, deleteFromCart }) => {
    const productName = data?.product?.productName || 'Unnamed Product';
    const price = data?.product?.price || 0;
    const formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const quantity = data?.quantity || 0;
    const image = data?.product?.image || 'default-image-url';

    const handleDelete = () => {
        deleteFromCart(data.productId, data.color, data.size); // Call delete action from props
        toast.success(`${productName} đã được xóa khỏi giỏ hàng!`);
    };

    return (
        <div className="cart-item">
            <div className="cart-item-left">
                <img src={image} alt={productName} />
            </div>
            <div className="cart-item-right">
                <div className="cart-name">{productName}</div>
                <div className="cart-price">{formattedPrice}</div>
                <div className="cart-quantity">Quantity: {quantity}</div>
                <span onClick={handleDelete}>
                    <img
                        src="https://cdn4.iconfinder.com/data/icons/software-menu-icons/256/SoftwareIcons-67-512.png"
                        className="logo"
                        style={{ width: "20px", height: "20px" }}
                        alt="Remove Item"
                    />
                    Remove Item
                </span>
            </div>
        </div>
    );
};

export default ProductInCart;
