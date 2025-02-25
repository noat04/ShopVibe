import Navbar from "../../component/Navbar/Navbar";
import React, { useState } from 'react';
import History from '../../component/Account/History';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Information from "./InformationUser";

const AccountPage = () => {


    return (
        <div>
            <Navbar></Navbar>
            <h1>Account Page</h1>
            <Information></Information>
            <History></History>
        </div>
    );
}
export default AccountPage;