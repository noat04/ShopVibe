import React, { useEffect, useState } from 'react';

function Product() {
    const [products, setProducts] = useState([]); // Khởi tạo state

    useEffect(() => {
        // Fetch dữ liệu từ API
        fetch('https://localhost:7180/api/Products/GetAllProducts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data); // Lưu dữ liệu vào state
            })
            .catch((error) => {
                console.error('Error fetching data:', error); // Log lỗi
            });
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <div>
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.productId}>
                        {product.productId} | {product.productName}
                    </div>
                ))
            ) : (
                <p>data null</p>
            )}
        </div>
    );    
}

export default Product;
