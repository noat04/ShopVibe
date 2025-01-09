import React, { useState, useEffect } from 'react';
import { getProductId } from '../../fetchData';
import { useParams } from 'react-router-dom';
import '../../component/mainProduct/ProductDetails.css';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';
const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            const fetchedProduct = await getProductId(id);
            setProduct(fetchedProduct);
        };
        fetchProductDetails();
    }, [id]);

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
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
                    </div>
                    <div className="btn-cart">
                        <button>MUA NGAY</button>
                    </div>
                </div>
            </div>
            <div className="container-description">
                <h2>Mô tả sản phẩm</h2>

            </div>
            <Footer />
        </>
    );
};

export default ProductDetailPage;