import React, { useEffect, useState } from 'react';

function Product() {
    const [records, setRecords] = useState([]); // Khởi tạo state

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
                setRecords(data); // Lưu dữ liệu vào state
            })
            .catch((error) => {
                console.error('Error fetching data:', error); // Log lỗi
            });
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <div>
            <h1>Product Page</h1>
            <ul>
                {records.length > 0 ? (
                    records.map((product) => (
                        <li key={product.productId}>
                            {product.productId} | {product.productName}
                        </li>
                    ))
                ) : (
                    <p>Loading data...</p>
                )}
            </ul>
        </div>
    );
}

export default Product;
