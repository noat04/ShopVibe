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

    useEffect(() => {
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

    const handleAddToCart = () => {
        if (!selectColor || !selectSize) {
            toast.error('Vui lòng chọn màu và kích thước trước khi thêm vào giỏ hàng.');
            return;
        }

        // Gọi action addToCart từ context
        addToCart(product, quality, selectColor, selectSize);

        // Hiển thị thông báo
        toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
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
