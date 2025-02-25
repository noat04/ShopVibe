import Navbar from "../../component/Navbar/Navbar";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Information = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    useEffect(() => {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        if (customers.length > 0) {
            const customerId = customers[0]?.id; // Kiểm tra phần tử đầu tiên có tồn tại
            if (customerId) {
                setCustomer(customerId);
            } else {
                setCustomer(null);
            }
        } else {
            setCustomer(null);
        }
    }, [id]);
    return (
        <div>
            <h1>Information</h1>
        </div>
    );
}
export default Information;