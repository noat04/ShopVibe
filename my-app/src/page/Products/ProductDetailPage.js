import React, { useState, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { getProductId } from '../../fetchData';
import { useParams } from 'react-router-dom';
import '../../component/mainProduct/ProductDetails.css';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';
import { useCart } from '../../stores/CartContext';  // Nhập useCart

// ProductDetailPage component
const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quality, setQuality] = useState(1);
    const [selectColor, setSelectColor] = useState('');
    const [selectSize, setSelectSize] = useState('');
    // Sử dụng useReducer để quản lý giỏ hàng
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        const fetchProductDetails = async () => {
            const fetchedProduct = await getProductId(id);
            setProduct(fetchedProduct);

            // Đặt màu và size mặc định (nếu cần)
            if (fetchedProduct?.variants?.length > 0) {
                setSelectColor(fetchedProduct.variants[0].color);
                setSelectSize(fetchedProduct.variants[0].size);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handlePlusQuality = () => setQuality(quality + 1);
    const handleMinusQuality = () => quality > 1 && setQuality(quality - 1);

    const handleAddToCart = () => {
        if (!selectColor || !selectSize) {
            toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
            return;
        }

        // Gửi hành động tới reducer
        dispatch({
            type: 'ADD_TO_CART',
            payload: { product, quantity: quality, color: selectColor, size: selectSize },
        });

        // Hiển thị thông báo khi thêm vào giỏ hàng
        toast.success(`${product.productName} đã được thêm vào giỏ hàng!`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
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
                    <div className="thumbnail-images">
                        {product.variants.map((variant, index) => (
                            <img key={index} src={variant.img} alt={`Thumbnail ${index}`} />
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <span className="product-name">{product.productName}</span>
                    <span className="product-price">
                        {product.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </span>

                    {/* Chọn màu */}
                    <div className="product-option">
                        <span>Màu</span>
                        {product.variants.map((variant, index) => (
                            <button
                                key={index}
                                className={`btn-color ${selectColor === variant.color ? 'active' : ''}`}
                                style={{ backgroundColor: variant.color }}
                                onClick={() => setSelectColor(variant.color)}
                            ></button>
                        ))}
                    </div>

                    {/* Chọn size */}
                    <div className="product-option">
                        <span>Size</span>
                        {product.variants.map((variant, index) => (
                            <button
                                key={index}
                                className={`btn-size ${selectSize === variant.size ? 'active' : ''}`}
                                onClick={() => setSelectSize(variant.size)}
                            >
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
