import React, { useEffect, useState } from 'react';

function FetchData() {
    const [records, setRecords] = useState([]); // Khởi tạo state

    useEffect(() => {
        // Fetch dữ liệu từ API
        fetch('https://localhost:7180/api/Products/GetAllProducts')
            .then(response => response.json())
            .then(data => {
                setRecords(data); // Lưu dữ liệu vào state
            })
            .catch(error => {
                console.error('Error fetching data:', error); // Log lỗi
            });
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <div>
            <ul>
                {records.map((list, index) => (
                    <li key={index}>
                        {list.productId} | {list.productName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FetchData;
