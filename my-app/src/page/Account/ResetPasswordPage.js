import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');
    console.log(token, email);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu và xác nhận không khớp!");
            return;
        }
        try {
            const response = await fetch(
                `https://localhost:7180/api/Auth/UpdatePassword`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token, email , newPassword })
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Cập nhật mật khẩu thất bại");
            }
            toast.success("Cập nhật mật khẩu thành công!");
            // Sau khi thành công, chuyển hướng về trang chủ hoặc đăng nhập
            navigate("/Home");
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Cập nhật mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Cập nhật mật khẩu</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
