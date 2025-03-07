import Navbar from "../../component/Navbar/Navbar";
import React, { useState, useEffect, useReducer } from "react";
import History from '../../component/Account/History';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';

const AccountPage = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const customers = JSON.parse(localStorage.getItem('customers'));
    const customerId = customers[0].id; // Lấy ID từ phần tử đầu tiên của mảng
    const handleOpenInfor = () => {
        dispatch(toggleStatusTab());
        navigate(`/account/update-customer/${customerId}`);

    };

    return (
        <div>
            <Navbar></Navbar>
            <h1>Account Page</h1>
            <span onClick={handleOpenInfor}>Information</span>
            <History></History>
        </div>
    );
}
export default AccountPage;