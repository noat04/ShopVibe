import React, { useState, useEffect, useReducer } from "react";
import { useCart } from '../../stores/CartContext';
import { jwtDecode } from "jwt-decode";
import Navbar from '../../component/Navbar/Navbar';
import { toast } from 'react-toastify';
import '../Cart/Cart.css';
import { useNavigate, useLocation } from "react-router-dom";
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';
import { saveToken, removeToken, getToken } from "../../component/AuthStorage/AuthStorage";

const Cart = () => {
    const location = useLocation();
    const { state: { items }, deleteFromCart } = useCart();
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const [cart, setCartOfUser] = useState(null);
    const [userName, setUserName] = useState(null);

    // Hàm để lấy query parameters
    const getQueryParams = (key) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };
    // Lấy các giá trị từ URL
    const message = getQueryParams("message");
    const PaymentMethod = getQueryParams("paymentMethod");
    const PaymentId = getQueryParams("paymentId");
    console.log("PaymentMethod:", PaymentMethod);
    console.log("PaymentId:", PaymentId);

    const handleOpenCart = () => {
        dispatch(toggleStatusTab());
        navigate("/cart/information");
    };
    useEffect(() => {
        const fetchCreateOrder = async () => {
            const token = getToken();
            console.log("Token:", token);
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.sub || ""); // Gán thông tin người dùng
            try {
                if (PaymentId && PaymentMethod) {
                    console.log("Dữ liệu gửi:", { PaymentMethod, PaymentId });

                    const response = await fetch('https://localhost:7180/api/Order/CheckOut', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            PaymentMethod: PaymentMethod,
                            PaymentId: PaymentId,
                            UserName: userName
                        }),
                    });

                    if (!response.ok) {
                        console.error("Lỗi khi gọi API:", response.status, response.statusText);
                        const error = await response.json();
                        console.error("Chi tiết lỗi:", error);
                        return;
                    }

                    const data = await response.json();
                    console.log("Đặt hàng thành công:", data);
                } else {
                    console.log("Thông tin thanh toán không hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchCreateOrder();
    }, []);

    useEffect(() => {
        const fetchCartDetails = async () => {
            const token = getToken(); // Lấy token từ localStorage
            try {
                const customers = JSON.parse(localStorage.getItem('customers'));
                const customerId = customers[0].id; // Lấy ID từ phần tử đầu tiên của mảng
                console.log(customerId);
                if (customerId !== null) {
                    const response = await fetch('https://localhost:7180/api/Cart/GetCartDetails/' + customerId, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`, // Đính kèm token vào header
                        },
                    });

                    if (!response.ok) {
                        console.error("Lỗi khi gọi API:", response.status, response.statusText);
                        return;
                    }

                    const data = await response.json(); // Chờ xử lý JSON từ response
                    setCartOfUser(data.cart); // Cập nhật state với dữ liệu nhận được
                    console.log(data); // Kiểm tra dữ liệu
                } else {
                    console.log("Không có ID khách hàng");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchCartDetails();
        console.log(cart);
    }, []);

    // const user = JSON.parse(localStorage.getItem('userId'));

    const prepareCartDetails = (index) => {
        if (!cart || !cart.cartDetails) {
            return [];
        }

        const item = cart.cartDetails[index];
        if (!item) {
            return [];
        }

        return [{
            productId: item.productId || '',
            quantity: item.quantity || 0,
            size: item.size || '',
            color: item.color || '',
            price: item.price || 0,
        }];
    };

    const handleDeletaItem = async (index) => {
        const token = getToken(); // Lấy token từ localStorage
        const cartDetail = cart.cartDetails[index]; // Lấy dữ liệu của item cần xóa
        try {
            // Gửi yêu cầu xóa sản phẩm lên server
            const response = await fetch('https://localhost:7180/api/Cart/DeleteCart/' + cart.cartId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Đính kèm token vào header
                },
                body: JSON.stringify(prepareCartDetails(index)), // Chỉ gửi dữ liệu của sản phẩm cần xóa
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(`Xóa sản phẩm khỏi giỏ hàng thành công! ${cartDetail.productId}`);

                // Cập nhật lại giỏ hàng trong localStorage
                const updatedLocalStorageCart = loadCartFromLocalStorage().filter(
                    (item) =>
                        item.product.productId !== cartDetail.productId ||
                        item.color !== cartDetail.color ||
                        item.size !== cartDetail.size
                );
                localStorage.setItem('cartItems', JSON.stringify(updatedLocalStorageCart));

                // Cập nhật lại giỏ hàng trong state
                setCartOfUser((prevCart) => ({
                    ...prevCart,
                    cartDetails: prevCart.cartDetails.filter((_, i) => i !== index),
                }));

                // // Đồng bộ hóa reducer (nếu cần thiết)
                // dispatch(deleteFromCart(cartDetail.productId, cartDetail.color, cartDetail.size));
            } else {
                console.error('Lỗi khi xóa sản phẩm:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    console.log(prepareCartDetails());
    return (
        <div>
            <Navbar />
            <div>
                <button onClick={handleOpenCart}>Check Out</button>
            </div>
            <div className="cart-container">
                {!cart || cart.length === 0 ? (
                    items.length > 0 ? (
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
                    )
                ) : (
                    cart && cart.cartDetails && cart.cartDetails.length > 0 ? (
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
                                    {cart.cartDetails.map((item, index) => {
                                        const productName = item?.productName || 'Unnamed Product';
                                        const price = item?.price || 0;
                                        const formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                        const quantity = item?.quantity || 0;
                                        const image = item?.image || 'default-image-url';
                                        const size = item.size || '-';
                                        const color = item.color || '-';
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
                                                        onClick={() => handleDeletaItem(index)}
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
                    )
                )}
            </div>
        </div>
    );
};

export default Cart;
