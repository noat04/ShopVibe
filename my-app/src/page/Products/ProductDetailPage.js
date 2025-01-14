import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProductId } from '../../fetchData';
import { useParams } from 'react-router-dom';
import '../../component/mainProduct/ProductDetails.css';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../stores/cartData';
const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quality, setQuality] = useState(1);
    useEffect(() => {
        const fetchProductDetails = async () => {
            const fetchedProduct = await getProductId(id);
            setProduct(fetchedProduct);
        };
        fetchProductDetails();
    }, [id]);
    const handlePlusQuality = () => {
        setQuality(quality + 1);
    };
    const handleMinusQuality = () => {
        if (quality > 1) {
            setQuality(quality - 1);
        }
    }
    // const handleAddToCart = () => {
    // eslint-disable-next-line no-unused-vars
    const carts = useSelector(store => store.cart?.items || []);
    console.log(carts);
    const dispatch = useDispatch();
    const handleAddToCart = () => {
        console.log("Product ID:", product.productId);
        console.log("Quantity:", quality);
        dispatch(addToCart({ product, quantity: quality }));
        // Hiển thị thông báo
        toast.success(`${product.productName} đã được thêm vào giỏ hàng!`, {
            position: "top-right",
            autoClose: 3000, // Thời gian tự động đóng (ms)
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
            <Navbar></Navbar>
            <div className="container-detail">
                {/* Hình ảnh sản phẩm */}
                <div className="image-section">
                    <div className="main-image">
                        <img src={product.image} alt={product.productName} />
                    </div>
                    <div className="thumbnail-images">
                        {product.variants.map((variant, index) => (
                            <img
                                key={index}
                                src={variant.img}
                                alt={`Thumbnail ${index}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Chi tiết sản phẩm */}
                <div className="info-section">
                    <span className="product-name">{product.productName}</span>
                    <span className="product-price">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    {/* Màu sắc */}
                    <div className="product-option">
                        <span>Màu </span>
                        {product.variants.map((variant, index) => (
                            <button className='btn-color' key={index} style={{ backgroundColor: variant.color }}></button>
                        ))}
                    </div>
                    <div className="product-option">
                        <span>Size</span>
                        {product.variants.map((variant, index) => (
                            <button className='btn-size' key={index}>{variant.size}</button>
                        ))}
                    </div>
                    <div className="count">
                        <p>Số lượng</p>
                        <button onClick={handleMinusQuality}>-</button>
                        <span>{quality}</span>
                        <button onClick={handlePlusQuality}>+</button>
                    </div>
                    <div className="btn-cart">
                        <button>MUA NGAY</button>
                    </div>
                    <div className="btn-cart">
                        <button onClick={handleAddToCart}>THÊM GIỎ HÀNG</button>
                    </div>
                </div>
            </div>
            <div className="container-description">
                <h2>Mô tả sản phẩm</h2>
                <h4>{product.description}</h4>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetailPage;