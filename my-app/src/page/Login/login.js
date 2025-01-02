import React, { useState } from 'react';
import axios from 'axios';
// import './login.css'; // Bạn có thể thêm CSS để thiết kế giao diện

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Gửi yêu cầu đến API ASP.NET
            const response = await axios.post('https://localhost:7180/api/Auth/login', {
                userName,
                password,
            });

            // Lưu token vào localStorage
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            setLoading(false);

            // Điều hướng (nếu cần) hoặc gọi hàm xử lý khác
            // window.location.href = '/dashboard'; 
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data); // Hiển thị lỗi từ API
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="userName">Username:</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
