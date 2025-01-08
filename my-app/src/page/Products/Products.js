import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { getAllProducts } from '../../fetchData'; // Import getAllProducts từ fetchData.js
import ProductList from '../../component/mainProduct/ProductList';
import Filter from '../../component/Filter/Filter';
import Footer from '../../component/Footer/Footer';
import '../../component/mainProduct/productList.css';
import { getDataFilter } from '../../fetchData';
import { useParams } from 'react-router-dom';
function Product() {
    const [products, setProducts] = useState([]); // Khởi tạo state
    const [loading, setLoading] = useState(false);
    const { category } = useParams();
    console.log(category);
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let data;
                if (!category) {
                    // Nếu không có category -> lấy tất cả sản phẩm
                    data = await getAllProducts();
                } else {
                    // Gọi API lọc theo category
                    data = await getDataFilter(category);
                }
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]); // Thay đổi khi URL category thay đổi

    return (
        <div>
            <Navbar></Navbar>
            <Filter />
            <div className='product-container'>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductList key={product.productId} data={product} />
                    ))
                ) : (
                    <p>data null</p>
                )}

            </div>

            <Footer /> {/* Footer component */}
        </div>


    );
}

export default Product;
