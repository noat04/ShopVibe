// import React, { useEffect, useState } from 'react';
// import Navbar from '../../component/Navbar/Navbar';
// import { getAllProducts, sortHighToLow, sortLowToHigh } from '../../fetchData'; // Import getAllProducts từ fetchData.js
// import ProductList from '../../component/mainProduct/ProductList';
// import Filter from '../../component/Filter/Filter';
// import Footer from '../../component/Footer/Footer';
// import '../../component/mainProduct/productList.css';
// import { getDataFilter } from '../../fetchData';
// import { useLocation } from 'react-router-dom';
// function Product() {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const location = useLocation();

//     // Lấy giá trị từ query params
//     const queryParams = new URLSearchParams(location.search);
//     const category = queryParams.get('category'); // Lấy `category` từ query param
//     const sort = queryParams.get('sort'); // Lấy `sort` từ query param
//     console.log(category);
//     console.log(sort);
//     useEffect(() => {
//         const fetchProducts = async () => {
//             setLoading(true);
//             try {
//                 let data;
//                 if (!category) {
//                     // Không chọn category -> Lấy tất cả sản phẩm
//                     data = await getAllProducts();
//                 } else {
//                     // Lọc sản phẩm theo category
//                     data = await getDataFilter(category);
//                 }

//                 if (sort === 'High to low') {
//                     data = await sortHighToLow(); // Sắp xếp giảm dần
//                 } else if (sort === 'Low to high') {
//                     data = await sortLowToHigh(); // Sắp xếp tăng dần
//                 }
//                 setProducts(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//                 setProducts([]);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, [category, sort]); // Thay đổi khi URL category thay đổi

//     return (
//         <div>
//             <Navbar></Navbar>
//             <Filter />
//             <div className='product-container'>
//                 {products.length > 0 ? (
//                     products.map((product) => (
//                         <ProductList key={product.productId} data={product} />
//                     ))
//                 ) : (
//                     <p>loading</p>
//                 )}

//             </div>

//             <Footer /> {/* Footer component */}
//         </div>
//         // Sửa

//     );
// }

// export default Product;
import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { getPagesProduct, sortHighToLow, sortLowToHigh, getDataFilter } from '../../fetchData';  // Assuming this fetches paged data
import ProductList from '../../component/mainProduct/ProductList';
import Filter from '../../component/Filter/Filter';
import Footer from '../../component/Footer/Footer';
import '../../component/mainProduct/productList.css';


import { useLocation } from 'react-router-dom';

function Product() {
    const [products, setProducts] = useState([]);  // Initialize as empty array
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);  // Current page
    const [totalPages, setTotalPages] = useState(0);  // Total pages for pagination
    const [sort, setSort] = useState('');  // Sort order ('High to low' or 'Low to high')

    const location = useLocation();


    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category'); // Lấy `category` từ query param
    const sortQuery = queryParams.get('sort'); // Lấy `sort` từ query param

    // Set default sort if available from query param
    useEffect(() => {
        if (sortQuery) {
            setSort(sortQuery);
        }
    }, [sortQuery]);

    // Fetch products with pagination
    useEffect(() => {
        const fetchPagedProducts = async () => {
            setLoading(true);
            try {
                let data;
                // Fetch paginated products
                if (!category) {
                    data = await getPagesProduct(page);
                } else {

                    data = await getDataFilter(category);
                }

                if (data && data.items) {
                    setProducts(data.items);  // Set products
                    setTotalPages(data.totalPages);  // Set totalPages
                } else {
                    setProducts([]);  // Handle empty response
                    setTotalPages(0);  // Reset totalPages
                }

                // Apply sorting if needed
                if (sort === 'High to low') {
                    data = await sortHighToLow(); // Sắp xếp giảm dần  // Sort data in descending order
                } else if (sort === 'Low to high') {
                    data = await sortLowToHigh();  // Sort data in ascending order
                }   

                setProducts(data.items);  // Set sorted products
            } catch (error) {
                console.error('Error fetching paged products:', error);
                setProducts([]);  // Reset products in case of error
                setTotalPages(0);  // Reset totalPages in case of error
            } finally {
                setLoading(false);
            }
        };

        fetchPagedProducts();
    }, [page, category, sort]);  // Re-run whenever page, category, or sort changes

    return (
        <div>
            <Navbar />
            <Filter />
            <div className="product-container">
                {loading ? (
                    <p>Loading...</p>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductList key={product.productId} data={product} />
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>

            <Footer />
        </div>

    );
}

export default Product;
