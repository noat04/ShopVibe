import Navbar from "../../component/Navbar/Navbar";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { saveToken, removeToken, getToken } from "../../component/AuthStorage/AuthStorage";
import { toast } from 'react-toastify';

const Information = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        sex: "",
    });
    const token = getToken();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    useEffect(() => {
        const storeCustomer = JSON.parse(localStorage.getItem('customers')) || [];
        const foundCustomer = storeCustomer.find((cust) => cust.id === id);
        console.log("Found customer:", foundCustomer);

        if (foundCustomer) {
            setCustomer(foundCustomer);
            setFormData({
                // id: foundCustomer.id, // Đảm bảo id không rỗng
                firstName: foundCustomer.firstName || "",
                lastName: foundCustomer.lastName || "",
                email: foundCustomer.email || "",
                phone: foundCustomer.phone || "",
                address: foundCustomer.address || "",
                sex: foundCustomer.sex || "",
                // userId: foundCustomer.userId || "",
            });
        }
    }, [id]);


    // const handleSubmit = (e) => {
    //     // e.preventDefault(); // Ngăn reload trang

    //     // Lấy id từ customer nếu formData.id rỗng
    //     const updatedCustomer = {
    //         ...customer,
    //         ...formData,
    //         // id: formData.id || customer.id,
    //     };

    //     console.log("Updated customer (final):", updatedCustomer);
    //     try {
    //         const updateResponse = await fetch(`https://localhost:7180/api/Customers/UpdateCustomer/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(formData),
    //         })
    //         if (updateResponse.ok) {
    //             // Cập nhật thành công
    //             const storeCustomer = JSON.parse(localStorage.getItem('customers')) || [];
    //             const updatedCustomers = storeCustomer.map((cust) =>
    //                 cust.id === updatedCustomer.id ? updatedCustomer : cust
    //             );
    //             localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    //             toast.success("Thông tin đã được lưu thành công!");
    //             setCustomer(updatedCustomer);
    //         } else {
    //             toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    //             // const responseText = updateResponse.text();
    //             // console.error("Lỗi từ API:", responseText);
    //         }

    //     } catch (error) {
    //         console.error("Lỗi khi gọi API:", error);
    //     }
    // };
    const handleSubmit = async (e) => {
        // e.preventDefault(); // Ngăn reload trang
        const updatedCustomer = {
            ...customer,
            ...formData,
        };

        console.log("Updated customer (final):", updatedCustomer);
        try {
            const updateResponse = await fetch(`https://localhost:7180/api/Customers/UpdateCustomer/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedCustomer), // Gửi toàn bộ đối tượng cập nhật
            });

            if (updateResponse.ok) {
                // Lấy dữ liệu trả về từ server
                const updatedCustomerFromServer = await updateResponse.json();

                // Cập nhật localStorage
                const storeCustomer = JSON.parse(localStorage.getItem('customers')) || [];
                const updatedCustomers = storeCustomer.map((cust) =>
                    cust.id === updatedCustomerFromServer.id ? updatedCustomerFromServer : cust
                );
                localStorage.setItem('customers', JSON.stringify(updatedCustomers));

                // Hiển thị thông báo thành công
                toast.success("Thông tin đã được lưu thành công!");
                setCustomer(updatedCustomerFromServer);
            } else {
                const responseText = await updateResponse.text();
                console.error("Lỗi từ API:", responseText);
                toast.error("Cập nhật thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Có lỗi xảy ra khi kết nối tới server.");
        }
    };




    return (
        <div>
            <Navbar></Navbar>
            {/* customer: {customer} */}
            <form onSubmit={handleSubmit}>
                {/* <input
                    type="text"
                    className="form-control"
                    name="id"
                    value={formData.id}
                // onChange={handleInputChange}
                />
                <input
                    type="text"
                    className="form-control"
                    name="userId"
                    value={formData.userId}
                // onChange={handleInputChange}
                /> */}
                <label>Họ:</label>
                <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
                <label>Tên</label>
                <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
                <label>Email</label>
                <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <label>Phone</label>
                <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                />
                <label>Địa chỉ</label>
                <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                />
                <label>giới tính</label>
                <input
                    type="text"
                    className="form-control"
                    name="sex"
                    value={formData.sex || ''}
                    onChange={handleInputChange}
                />
                <button type="submit" className="btn btn-success">
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
}
export default Information;