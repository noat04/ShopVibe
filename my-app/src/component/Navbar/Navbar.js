import React, { useState, useEffect, useReducer } from "react";
import { toast } from 'react-toastify';
import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");  // Quản lý trạng thái tìm kiếm
  const [totalQuantity, setTotalQuantity] = useState(0);  // Quản lý số lượng giỏ hàng
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Tính tổng số lượng trong giỏ hàng khi cart thay đổi
  useEffect(() => {
    let total = 0;
    state.items.forEach((item) => {
      total += item.quantity;
    });
    setTotalQuantity(total);
  }, [state.items]);

  // Xử lý hành động mở/đóng tab giỏ hàng
  const handleOpenTabCart = () => {
    dispatch(toggleStatusTab());
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchValue}`);
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (productId, quantity) => {
    dispatch(addToCart(productId, quantity));
    toast.success('Sản phẩm đã được thêm vào giỏ hàng!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleOpenCart = () => {
    dispatch(toggleStatusTab());
    navigate("/cart");
  };

  const [isRegister, setIsRegister] = useState(false); // Xác định hiển thị form đăng ký hay đăng nhập
  const [showForm, setShowForm] = useState(false); // Quản lý trạng thái hiển thị form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Xử lý thay đổi giá trị trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hiển thị form đăng nhập
  const handleShowLogin = (e) => {
    e.preventDefault();
    setIsRegister(false);
    setShowForm(true);
  };

  // Hiển thị form đăng ký
  const handleShowRegister = (e) => {
    setIsRegister(true);
    setShowForm(true);
    e.preventDefault();
  };

  // Đóng form
  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  // Xử lý đăng nhập/đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // Xử lý đăng ký
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
      }

      try {
        const response = await fetch("https://localhost:7180/api/Auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success(`Đăng nhập thành công`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          handleCloseForm();
        } else {
          toast.error(result.message || `Đăng ký thất bại`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // alert(result.message || "Đăng ký thất bại!");
        }
      } catch (error) {
        toast.error(`${error}Đăng ký thất bại`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.error("Đăng ký lỗi:", error);
        // alert("Lỗi hệ thống khi đăng ký!");
      }
    } else {
      // Xử lý đăng nhập
      try {
        const response = await fetch("https://localhost:7180/api/Auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success(`Đăng nhập thành công`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // alert("Đăng nhập thành công!");
          handleCloseForm();
        } else {
          toast.error(result.message || `Đăng nhập thất bại`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // alert(result.message || "Đăng nhập thất bại!");
        }
      } catch (error) {
        toast.error(`${error}Đăng nhập thất bại`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.error("Đăng nhập lỗi:", error);
        // alert("Lỗi hệ thống khi đăng nhập!");
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="/Home">
          <img
            className="logo"
            src="https://bizweb.dktcdn.net/100/347/064/themes/717243/assets/logo.png?1715653251743"
            alt="Logo"
          />
        </a>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto">
            {/* BLACK FRIDAY */}
            <li className="nav-item">
              <a className="nav-link" href="/blackfriday">
                BLACK FRIDAY
              </a>
            </li>

            {/* product */}
            <li className="nav-item">
              <a className="nav-link" href="/Products">
                PRODUCTS
              </a>
            </li>

            {/* About */}
            <li className="nav-item">
              <a className="nav-link" href="/about">
                ABOUT
              </a>
            </li>
          </ul>

          {/* Search Bar */}
          {/* Search Bar */}
          <form
            className="d-flex align-items-center search-form"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tìm kiếm sản phẩm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="btn btn-outline-dark search-form" type="submit">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3031/3031293.png"
                alt="Search"
                style={{ width: "20px", height: "20px" }}
              />
            </button>
          </form>

          {/* Icons */}
          <div className="navbar-component d-flex align-items-center ms-3 rounded-full" onClick={handleOpenTabCart}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/3514/3514491.png"
              alt="Cart"
              className="navbar-icon"
              onClick={handleOpenCart}
            />
            <span className="cart-count"> ({totalQuantity})</span>
            <img
              src="https://cdn-icons-png.flaticon.com/128/5001/5001572.png"
              alt="Notification"
              className="navbar-icon"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/456/456212.png"
              alt="User"
              className="navbar-icon"
            />
          </div>
          {/* Login/Signup */}
          <div className="d-flex">
            <a href="" onClick={handleShowLogin}>Đăng nhập</a>
            <span>/</span>
            <a href="" onClick={handleShowRegister}>Đăng ký</a>
          </div>
        </div>
      </div>

      {/* Authentication Form */}
      {showForm && (
        <>
          <div
            className={`auth-overlay ${showForm ? "active" : ""}`}
            onClick={handleCloseForm}
          ></div>
          <div className={`auth-modal ${showForm ? "active" : ""}`}>
            <div className="auth-form">
              <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="username">Tên người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Nhập tên người dùng"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />

                {isRegister && (
                  <>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Nhập email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </>
                )}

                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />

                {isRegister && (
                  <>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </>
                )}

                <button type="submit">
                  {isRegister ? "Đăng ký" : "Đăng nhập"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
