import React from 'react';
import { useCart } from '../../stores/CartContext';
import Navbar from '../../component/Navbar/Navbar';
import '../Cart/Cart.css';

const Cart = () => {
    const { state: { items }, deleteFromCart } = useCart();

    return (
        <div>
            <Navbar />
            <div className="cart-container">
                {items.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sản Phẩm</th>
                                    <th scope="col">Kích thước</th>
                                    <th scope="col">Màu sắc</th>
                                    <th scope="col">Đơn giá</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Số tiền</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => {
                                    const productName = item?.product?.productName || 'Unnamed Product';
                                    const price = item?.product?.price || 0;
                                    const formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                    const quantity = item?.quantity || 0;
                                    const image = item?.product?.image || 'default-image-url';
                                    const selectedVariant = item?.product?.variants.find(
                                        variant => variant.size === item.size && variant.color === item.color
                                    );
                                    const size = selectedVariant?.size || '-';
                                    const color = selectedVariant?.color || '-';
                                    const totalMoney = quantity * price;
                                    const formattedTotalMoney = totalMoney.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

                                    return (
                                        <tr key={index}>
                                            <td>
                                                <img
                                                    src={image}
                                                    alt={productName}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                                <p className='cart-item-name'>{productName}</p>
                                            </td>
                                            <td>{size}</td>
                                            <td>{color}</td>
                                            <td>{formattedPrice}</td>
                                            <td>{quantity}</td>
                                            <td>{formattedTotalMoney}</td>
                                            <td>
                                                <button
                                                    onClick={() => deleteFromCart(item.productId, color, size)}
                                                    style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <h1>Giỏ hàng trống</h1>
                )}
            </div>
        </div>
    );
};

export default Cart;
