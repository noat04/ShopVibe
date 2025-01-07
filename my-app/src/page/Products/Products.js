import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { getAllProducts } from '../../fetchData'; // Import getAllProducts từ fetchData.js
import ProductList from '../../component/mainProduct/ProductList';
import Filter from '../../component/Filter/Filter';
import Footer from '../../component/Footer/Footer';
import '../../component/mainProduct/productList.css';
function Product() {
    const [products, setProducts] = useState([]); // Khởi tạo state
    useEffect(() => {
        const getData = async () => {
            const data = await getAllProducts(); // Gọi hàm getAllProducts để lấy dữ liệu
            setProducts(data); // Lưu dữ liệu vào state
        };
        getData(); // Thực thi hàm fetch
    }, []); // Chạy một lần khi component được mount

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
