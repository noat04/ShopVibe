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
            <div className="product-detail-page">
                {/* Hình ảnh sản phẩm */}
                <div className="product-image-section">
                    <div className="main-image">
                        <img src={product.image} alt={product.productName} />
                    </div>
                    {/* <div className="thumbnail-images">
                    {product.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index}`}
                        />
                    ))}
                </div> */}
                </div>

                {/* Chi tiết sản phẩm */}
                <div className="product-info-section">
                    <h1 className="product-title">{product.productName}</h1>
                    <div className="product-price">
                        <span className="current-price">{product.price}₫</span>
                    </div>
                    {/* <div className="product-options">
                    <h3>Phân Loại</h3>
                    <div className="categories">
                        {product.categories.map((category, index) => (
                            <button
                                key={index}
                                className={product.selectedCategory === category ? 'selected' : ''}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <h3>Size</h3>
                    <div className="sizes">
                        {product.sizes.map((size, index) => (
                            <button
                                key={index}
                                className={product.selectedSize === size ? 'selected' : ''}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div> */}
                    <div className="product-description">
                        <h3>Mô tả sản phẩm</h3>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetailPage;