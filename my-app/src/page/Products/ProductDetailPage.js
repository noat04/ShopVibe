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
    //     if (customer === null) {
    //         // Xử lý logic khi không có thông tin khách hàng
    //         if (!selectColor || !selectSize) {
    //             toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
    //             return;
    //         }
    //         addToCart(product, quality, selectColor, selectSize);
    //         toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
    //         setTimeout(() => window.location.reload(), 4000);
    //         return;
    //     }

    //     try {
    //         const cartResponse = await fetch(`https://localhost:7180/api/Cart/GetCartDetails/${customer}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         let cartData;
    //         if (cartResponse.ok) {
    //             cartData = await cartResponse.json();
    //         } else {
    //             // Nếu phản hồi không phải JSON, xử lý phản hồi dạng text
    //             const errorText = await cartResponse.text();
    //             console.error('Error response:', errorText);
    //             throw new Error(errorText);
    //         }
    //         const cartId = cartData?.cart.cartId;

    //         console.log(cartData);
    //         if (!cartId) {
    //             console.error('cartId không tồn tại hoặc undefined:', cartData);
    //             throw new Error('Giỏ hàng không tồn tại.');
    //         }

    //         // Chuẩn bị thêm sản phẩm vào giỏ hàng
    //         addToCart(product, quality, selectColor, selectSize);

    //         console.log(cartId);
    //         const addCartDetailsResponse = await fetch(`https://localhost:7180/api/Cart/AddCartDetails/${cartId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(cartDetails),
    //         });

    //         if (addCartDetailsResponse.ok) {
    //             const result = await addCartDetailsResponse.json();
    //             console.log('Thêm sản phẩm thành công:', result);
    //             toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
    //         } else {
    //             const errorResponse = await addCartDetailsResponse.json();
    //             console.error('Lỗi HTTP:', addCartDetailsResponse.status, errorResponse);
    //             toast.error(`Lỗi: ${errorResponse.Message || 'Không xác định'}`);
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi gọi API:', error);
    //         toast.error(`Lỗi: ${error.message}`);
    //     }
    // };
    const handleAddToCart = async () => {
        if (!selectColor || !selectSize) {
            toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
            return;
        }
        if (customer === null) {
            // Xử lý logic khi không có thông tin khách hàng
            if (!selectColor || !selectSize) {
                toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
                return;
            }
            addToCart(product, quality, selectColor, selectSize);
            toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
            setTimeout(() => window.location.reload(), 4000);
            return;
        }

        try {
            let cartId = null;

            // Gọi API để lấy thông tin giỏ hàng
            const cartResponse = await fetch(`https://localhost:7180/api/Cart/GetCartDetails/${customer}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            let cartData;
            if (cartResponse.ok) {
                cartData = await cartResponse.json();
                cartId = cartData?.cart?.cartId || null;
                console.log(cartData);
            } else {
                const errorText = await cartResponse.text();
                console.error('Error response:', errorText);
                throw new Error(errorText);
            }

            // Nếu không tìm thấy giỏ hàng, tạo mới giỏ hàng
            if (!cartId) {
                console.log('Giỏ hàng không tồn tại. Tạo giỏ hàng mới...');
                const createCartResponse = await fetch('https://localhost:7180/api/Cart/CreateCart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ customerId: customer }),
                });

                if (createCartResponse.ok) {
                    const newCart = await createCartResponse.json();
                    cartId = newCart.cartId;
                } else {
                    throw new Error('Không thể tạo giỏ hàng mới.');
                }
            }

            // Chuẩn bị thêm sản phẩm vào giỏ hàng
            const cartDetails = [{
                productId: product.productId,
                quantity: quality,
                size: selectSize,
                color: selectColor,
                price: product.price,
            }];

            console.log(cartDetails);
            // console.log(cartId);
            // Gọi API để thêm hoặc cập nhật sản phẩm trong giỏ hàng
            const addCartDetailsResponse = await fetch(`https://localhost:7180/api/Cart/AddCartDetails/${cartId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cartDetails),
            });

            if (addCartDetailsResponse.ok) {
                const result = await addCartDetailsResponse.json();
                addToCart(product, quality, selectColor, selectSize);
                toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
            } else {
                const errorResponse = await addCartDetailsResponse.json();
                console.error('Lỗi HTTP:', addCartDetailsResponse.status, errorResponse);
                toast.error(`Lỗi: ${errorResponse.Message || 'Không xác định'}`);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            toast.error(`Lỗi: ${error.message}`);
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
