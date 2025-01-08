import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { getAllProducts, sortHighToLow, sortLowToHigh } from '../../fetchData'; // Import getAllProducts từ fetchData.js
import ProductList from '../../component/mainProduct/ProductList';
import Filter from '../../component/Filter/Filter';
import Footer from '../../component/Footer/Footer';
import '../../component/mainProduct/productList.css';
import { getDataFilter } from '../../fetchData';
import { useLocation } from 'react-router-dom';
function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // Lấy giá trị từ query params
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category'); // Lấy `category` từ query param
    const sort = queryParams.get('sort'); // Lấy `sort` từ query param
    console.log(category);
    console.log(sort);
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let data;
                if (!category) {
                    // Không chọn category -> Lấy tất cả sản phẩm
                    data = await getAllProducts();
                } else {
                    // Lọc sản phẩm theo category
                    data = await getDataFilter(category);
                }

                if (sort === 'High to low') {
                    data = await sortHighToLow(); // Sắp xếp giảm dần
                } else if (sort === 'Low to high') {
                    data = await sortLowToHigh(); // Sắp xếp tăng dần
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
    }, [category, sort]); // Thay đổi khi URL category thay đổi

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
                    <p>loading</p>
                )}

            </div>

            <Footer /> {/* Footer component */}
        </div>
        // Sửa

    );
}

export default Product;
