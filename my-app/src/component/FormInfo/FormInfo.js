import React, { useState, useEffect, useReducer } from "react";
import { useCart } from '../../stores/CartContext';
import Navbar from '../../component/Navbar/Navbar';
import { useNavigate } from "react-router-dom";
import { saveToken, removeToken, getToken } from "../AuthStorage/AuthStorage";
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';

const FormInfo = () => {
    const { total } = useCart();
    console.log(total);
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const handleOpenCart = () => {
        dispatch(toggleStatusTab());
        navigate("/information");
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        const validAmount = parseFloat(formData.Amount);
        const isValidString = (str) => /^[a-zA-Z0-9\s]*$/.test(str.trim());

        if (isNaN(validAmount) || validAmount <= 0) {
            alert("Amount phải là một số dương và lớn hơn 0.");
            return;
        }

        if (
            !isValidString(formData.OrderDescription) ||
            !isValidString(formData.OrderType) ||
            !isValidString(formData.Name)
        ) {
            alert("Dữ liệu không hợp lệ. Chỉ được chứa chữ cái, số và khoảng trắng.");
            return;
        }

        fetch("https://localhost:7180/api/Payment/CreatePayment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`, // Đính kèm token vào header
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(error.message || "Có lỗi xảy ra khi tạo URL thanh toán.");
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data.paymentUrl) {

                    window.location.href = data.paymentUrl;
                } else {
                    alert("Không thể tạo URL thanh toán.");
                }
            })
            .catch((error) => alert(`Error: ${error.message}`));
    };

    const [formData, setFormData] = useState({
        OrderType: "other",
        Amount: total > 0 ? total : 1, // Đảm bảo Amount luôn là số dương
        OrderDescription: "Thanh toan qua Vnpay tai HieuTanStore".replace(/[^\w\s]/g, '').trim(),
        Name: "User".replace(/[^\w\s]/g, '').trim(),
    });

    console.log(JSON.stringify(formData)); // Kiểm tra xem dữ liệu có đúng định dạng không

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <Navbar />
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="form-control" name="Name" value={formData.Name} onChange={handleInputChange} />
                    <input type="number" className="form-control" name="Amount" value={formData.Amount} onChange={handleInputChange} />
                    <input
                        type="text"
                        className="form-control"
                        name="OrderDescription"
                        value={formData.OrderDescription}
                        onChange={handleInputChange}
                    />
                    <input type="text" className="form-control" name="OrderType" value={formData.OrderType} onChange={handleInputChange} />
                    <button type="submit" className="btn btn-success">
                        Pay with Vnpay
                    </button>
                </form>
            </div>
        </div>
    )
};

export default FormInfo;