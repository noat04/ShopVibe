import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteToCart } from '../../stores/cartData';
import { toast } from 'react-toastify';

const ProductInCart = ({ data }) => {
    const dispatch = useDispatch();

    // Giá trị mặc định để tránh lỗi undefined
    const productName = data?.product?.productName || 'Unnamed Product';
    const price = data?.product?.price || 0;
    const formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const quantity = data?.quantity || 0;
    const image = data?.product?.image || 'default-image-url';
    // const productId = data?.product?.productId;

    const handleDelete = () => {
        // if (!productId) {
        //     console.error('Product ID is missing, cannot delete the item');
        //     toast.error('Không thể xóa sản phẩm này vì ID không hợp lệ.');
        //     return;
        // }

        // console.log('Deleting product:', productId); // Log the product ID
        dispatch(deleteToCart({ productId: data.product.productId }));
        toast.success(`${productName} đã được xóa giỏ hàng!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
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
