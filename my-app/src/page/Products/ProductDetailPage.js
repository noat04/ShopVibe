import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProductId } from '../../fetchData';
import { useParams } from 'react-router-dom';
import '../../component/mainProduct/ProductDetails.css';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';
import { useCart } from '../../stores/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [quality, setQuality] = useState(1);
    const [selectColor, setSelectColor] = useState('');
    const [selectSize, setSelectSize] = useState('');
    const { addToCart } = useCart(); // Lấy action addToCart từ CartContext
    const [customer, setCustomer] = useState(null);
    const token = localStorage.getItem('token');
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const prepareCartDetails = () => {
        return items.map(item => ({
            productId: item.product?.productId || '',
            quantity: item.quantity || 0,
            size: item.size || '',
            color: item.color || '',
            price: item.product?.price || 0,
        }));
    };
    const cartDetails = prepareCartDetails(); // Chuẩn bị dữ liệu
    useEffect(() => {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        if (customers.length > 0) {
            const customerId = customers[0]?.id; // Kiểm tra phần tử đầu tiên có tồn tại
            if (customerId) {
                setCustomer(customerId);
            } else {
                setCustomer(null);
            }
        } else {
            setCustomer(null);
        }
        const fetchProductDetails = async () => {
            const fetchedProduct = await getProductId(id);
            setProduct(fetchedProduct);

            if (fetchedProduct?.variants?.length > 0) {
                setSelectColor(fetchedProduct.variants[0].color);
                setSelectSize(fetchedProduct.variants[0].size);
            }
        };
        fetchProductDetails();
    }, [id]);


    const handlePlusQuality = () => setQuality(quality + 1);
    const handleMinusQuality = () => quality > 1 && setQuality(quality - 1);

    // const handleAddToCart = async () => {
    //     // Thêm sản phẩm vào giỏ hàng
    //     const cartDetails = [{
    //         productId: product.productId,
    //         quantity: quality,
    //         size: selectSize,
    //         color: selectColor,
    //         price: product.price,
    //     }];
    //     if (!selectColor || !selectSize) {
    //         toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
    //         return;
    //     }

    //     if (customer === null) {

    //         addToCart(product, quality, selectColor, selectSize);
    //         toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
    //         setTimeout(() => window.location.reload(), 4000);
    //         return;
    //     }

    //     try {
    //         // let cartId = null;

    //         // Lấy thông tin giỏ hàng
    //         const cartResponse = await fetch(`https://localhost:7180/api/Cart/GetCartDetails/${customer}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (cartResponse.ok) {
    //             const cartData = await cartResponse.json();
    //             setCartId(cartData.cartId); // Cập nhật cartId
    //             cartId = cartData.cartId; // Sử dụng giá trị trực tiếp

    //         } else {
    //             console.log('Giỏ hàng không tồn tại. Tạo giỏ hàng mới...');
    //             const createCartResponse = await fetch(`https://localhost:7180/api/Cart/CreateCart/${customer}`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });

    //             if (createCartResponse.ok) {
    //                 const newCart = await createCartResponse.json();
    //                 console.log('Phản hồi từ API CreateCart:', newCart); // Log phản hồi
    //                 // console.log('Phản hồi từ API CreateCart:', newCart.cart.cartId);
    //                 setCartId(newCart);
    //                 cartId = newCart; // Cập nhật giá trị trực tiếp
    //                 console.log(cartId);
    //             } else {
    //                 const errorResponse = await createCartResponse.json();
    //                 console.error('Lỗi khi tạo giỏ hàng:', createCartResponse.status, errorResponse);
    //                 throw new Error('Không thể tạo giỏ hàng mới.');
    //             }
    //         }

    //         console.log(cartId);
    //         // Kiểm tra cartId
    //         if (cartId == null) {
    //             console.error('cartId không tồn tại sau khi gọi API.');
    //             throw new Error('Giỏ hàng không tồn tại hoặc không thể tạo mới.');
    //         }

    //         const addCartDetailsResponse = await fetch(`https://localhost:7180/api/Cart/AddCartDetails/${cartId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(cartDetails),
    //         });

    //         if (addCartDetailsResponse.ok) {
    //             addToCart(product, quality, selectColor, selectSize);
    //             toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
    //         } else {
    //             const errorResponse = await addCartDetailsResponse.json();
    //             console.error('Lỗi HTTP:', addCartDetailsResponse.status, errorResponse);
    //             toast.error(`Lỗi: ${errorResponse.Message || 'Không xác định'}`);
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi gọi API:', error);
    //         toast.error(`Lỗi hệ thống: ${error.message}. Vui lòng thử lại sau.`);
    //     }

    // };
    const handleAddToCart = async () => {
        const cartDetails = [{
            productId: product.productId,
            quantity: quality,
            size: selectSize,
            color: selectColor,
            price: product.price,
        }];

        if (!selectColor || !selectSize) {
            toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
            return;
        }

        if (customer === null) {

            addToCart(product, quality, selectColor, selectSize);
            toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
            setTimeout(() => window.location.reload(), 4000);
            return;
        }

        try {
            let currentCartId = cartId;

            // Nếu chưa có cartId trong state, lấy từ API
            if (!currentCartId) {
                const cartResponse = await fetch(`https://localhost:7180/api/Cart/GetCartDetails/${customer}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    currentCartId = cartData.cartId;
                    setCartId(currentCartId); // Cập nhật vào state
                } else {
                    console.log('Giỏ hàng không tồn tại. Tạo giỏ hàng mới...');
                    const createCartResponse = await fetch(`https://localhost:7180/api/Cart/CreateCart/${customer}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (createCartResponse.ok) {
                        const newCart = await createCartResponse.json();
                        currentCartId = newCart.cart.cartId;
                        setCartId(currentCartId); // Cập nhật vào state
                    } else {
                        const errorResponse = await createCartResponse.json();
                        console.error('Lỗi khi tạo giỏ hàng:', createCartResponse.status, errorResponse);
                        throw new Error('Không thể tạo giỏ hàng mới.');
                    }
                }
            }

            // Kiểm tra cartId
            if (!currentCartId) {
                console.error('cartId không tồn tại sau khi gọi API.');
                throw new Error('Giỏ hàng không tồn tại hoặc không thể tạo mới.');
            }

            // Gửi thông tin sản phẩm vào giỏ hàng
            const addCartDetailsResponse = await fetch(`https://localhost:7180/api/Cart/AddCartDetails/${currentCartId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cartDetails),
            });

            if (addCartDetailsResponse.ok) {

                addToCart(product, quality, selectColor, selectSize);
                toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
            } else {
                const errorResponse = await addCartDetailsResponse.json();
                console.error('Lỗi HTTP:', addCartDetailsResponse.status, errorResponse);
                toast.error(`Lỗi: ${errorResponse.Message || 'Không xác định'}`);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            toast.error(`Lỗi hệ thống: ${error.message}. Vui lòng thử lại sau.`);
        }
    };




    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container-detail">
                <div className="image-section">
                    <div className="main-image">
                        <img src={product.image} alt={product.productName} />
                    </div>
                </div>
                <div className="info-section">
                    <span className="product-name">{product.productName}</span>
                    <span className="product-price">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <div className="product-option">
                        <span>Màu</span>
                        {product.variants.map((variant, index) => (
                            <button key={index} className={`btn-color ${selectColor === variant.color ? 'active' : ''}`}
                                style={{ backgroundColor: variant.color }} onClick={() => setSelectColor(variant.color)} />
                        ))}
                    </div>
                    <div className="product-option">
                        <span>Size</span>
                        {product.variants.map((variant, index) => (
                            <button key={index} className={`btn-size ${selectSize === variant.size ? 'active' : ''}`}
                                onClick={() => setSelectSize(variant.size)}>
                                {variant.size}
                            </button>
                        ))}
                    </div>
                    <div className="count">
                        <p>Số lượng</p>
                        <button onClick={handleMinusQuality}>-</button>
                        <span>{quality}</span>
                        <button onClick={handlePlusQuality}>+</button>
                    </div>
                    <div className="btn-cart">
                        <button onClick={handleAddToCart}>THÊM GIỎ HÀNG</button>
                        <button>MUA NGAY</button>
                    </div>
                </div>
            </div>
            <div className="container-description">
                <h2>Mô tả sản phẩm</h2>
                <p>{product.description}</p>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetailPage;
