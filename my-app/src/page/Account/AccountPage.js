import Navbar from "../../component/Navbar/Navbar";
import React, { useState, useEffect, useReducer } from "react";
import History from '../../component/Account/History';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';

const AccountPage = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const handleOpenInfor = () => {
        dispatch(toggleStatusTab());
        navigate("/account/info");
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