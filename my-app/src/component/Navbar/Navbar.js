import React, { useState, useEffect, useReducer } from "react";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import cartReducer, { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage } from '../../stores/cartData';
import { saveToken, removeToken, getToken } from "../AuthStorage/AuthStorage";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");  // Quản lý trạng thái tìm kiếm
  const [totalQuantity, setTotalQuantity] = useState(0);  // Quản lý số lượng giỏ hàng
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [user, setUser] = useState(null);
  // const [token, setToken] = useState(null);
  const token = getToken();
  //Kiểm tra token hết hạn
  const isTokenExpired = (token) => {
    if (!token) return true; // Nếu không có token, coi như hết hạn
    const { exp } = jwtDecode(token); // Decode token để lấy giá trị exp
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
    return exp < currentTime; // Token hết hạn nếu exp nhỏ hơn thời gian hiện tại
  };

  // if (isTokenExpired(token)) {
  //   console.log("Access Token đã hết hạn, cần làm mới.");
  // }

  // Tính tổng số lượng trong giỏ hàng
  useEffect(() => {
    // if (user === null) {
    let uniqueItemsCount = state.items.length;
    setTotalQuantity(uniqueItemsCount);
    // } else {
    //   setTotalQuantity(0);
    // }
  }, [state.items]);

  useEffect(() => {
    if (!token) {
      console.log("Chưa đăng nhập");
      return;
    }

    if (token && typeof token === "string" && isTokenExpired(token) === false) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Thông tin từ token:", decodedToken);

        fetch("https://localhost:7180/api/Auth/intospect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.isValid) {
              setUser(decodedToken.sub || ""); // Gán thông tin người dùng
            } else {
              console.log(data.message);
              removeToken(); // Xóa token nếu không hợp lệ
            }
          })
          .catch((error) => {
            console.error("Lỗi xác thực token:", error);
            // removeToken(); // Xóa token trong trường hợp xảy ra lỗi
          });
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        // removeToken(); // Xóa token nếu không thể giải mã
      }
    } else {
      fetch("https://localhost:7180/api/Auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user, refreshToken: token }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isValid) {
            saveToken(data.accessToken);
          } else {
            console.log(data.message);
            // removeToken(); // Xóa token nếu không hợp lệ
          }
        })
        .catch((error) => {
          console.error("Lỗi xác thực token:", error);
          // removeToken(); // Xóa token trong trường hợp xảy ra lỗi
        });
    }

  }, []);




  const checkToken = async () => {
    const token = getToken(); // Lấy token từ localStorage hoặc cookie
    if (!token) {
      console.error("Token không tồn tại.");
      return false; // Không có token
    }

    try {
      const response = await fetch("https://localhost:7180/api/Auth/intospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }), // Gửi token trong body
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        return data.isValid; // Trả về true nếu hợp lệ
      } else {
        console.error("Lỗi từ API:", response.status);
        return false; // Token không hợp lệ
      }
    } catch (error) {
      console.error("Lỗi kết nối khi kiểm tra token:", error);
      return false; // Nếu xảy ra lỗi, coi như token không hợp lệ
    }
  };


  // Xử lý hành động mở/đóng tab giỏ hàng
  const handleOpenTabCart = () => {
    dispatch(toggleStatusTab());
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchValue}`);
  };



  const handleOpenCart = () => {
    dispatch(toggleStatusTab());
    navigate("/cart");
  };

  const handleOpenAccount = async () => {
    const isValid = await checkToken(); // Chờ kết quả từ hàm checkToken()
    if (isValid) { // Nếu token hợp lệ
      navigate("/account"); // Chuyển hướng đến trang /account
    } else {
      // console.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      // Thực hiện hành động khác như thông báo lỗi hoặc chuyển hướng đến trang đăng nhập
      toast.error(`Vui lòng đăng nhập trước`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const [isRegister, setIsRegister] = useState(false); // Xác định hiển thị form đăng ký hay đăng nhập
  const [showForm, setShowForm] = useState(false); // Quản lý trạng thái hiển thị form
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", });

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
  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const token = getToken();
      const response = await fetch('https://localhost:7180/api/Auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Đính kèm token vào header
        },
      });

      if (response.ok) {
        // Xóa token khỏi localStorage
        removeToken();
        localStorage.removeItem("userId");
        localStorage.removeItem("customers");
        localStorage.removeItem("refreshToken");
        setUser(null); // Xóa thông tin người dùng
        // Chuyển hướng người dùng về trang đăng nhập
        window.location.href = '/Home';
        toast.success("Đăng xuất tài khoản thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const errorData = await response.json();
        console.error('Lỗi đăng xuất:', errorData.message || 'Không rõ lỗi');
      }
    } catch (error) {
      console.error('Đăng xuất thất bại:', error.message);
    }
  };
  //Xử lý đăng nhập / đăng ký google

  const handleGoogleAuth = async () => {
    const isRegister = false; // Hoặc giá trị từ state của bạn
    const apiUrl = isRegister
      ? "https://localhost:7180/api/Auth/register-google"
      : "https://localhost:7180/api/Auth/login-google";

    // Mở popup
    const popup = window.open(apiUrl, "_blank", "width=500,height=600");

    if (!popup) {
      console.error("Không thể mở popup.");
      return;
    }

    // Lắng nghe thông điệp từ popup
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://localhost:7180") {
        console.warn("Origin không hợp lệ:", event.origin);
        return;
      }

      const { accessToken, refreshToken, user } = event.data;

      // Lưu dữ liệu vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Điều hướng về home
      window.location.href = "/home";
    });
  };


  const handleForgotPassword = async () => {
    try {
      const response = await fetch("https://localhost:7180/api/Auth/SendMailForgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
        })
      });

      if (response.ok) {
        // Nếu API trả về thành công, có thể hiển thị thông báo thành công
        toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Nếu API trả về lỗi, bạn có thể lấy message lỗi từ response (nếu có)
        const errorData = await response.json();
        toast.error(`Lỗi: ${errorData.message || "Cập nhật mật khẩu thất bại"}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error(`${error} Cập nhật mật khẩu thất bại`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  // Xử lý response từ Email
  const handleEmailResponse = async () => {

  };

  const handleGoogleResponse = async () => {
    try {
      const response = await fetch("https://localhost:7180/api/Auth/google-response", {
        method: "GET",
      });

      if (!response.ok) {
        const errorDetail = await response.text(); // Lấy thông tin chi tiết từ phản hồi lỗi
        throw new Error(`Failed to retrieve token from Google login: ${response.status} - ${errorDetail}`);
      }

      const { Token } = await response.json();
      localStorage.setItem("authToken", Token);

      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      window.location.href = "/Home";
    } catch (error) {
      console.error("Error during Google Auth response handling:", error);
      toast.error(`Đăng nhập thất bại: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };


  // Xử lý đăng nhập/đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
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
        console.log(result);
        console.log(result.user);
        if (response.ok) {

          saveToken(result.response.accessToken);
          localStorage.setItem("userId", result.user.id);
          localStorage.setItem("refreshToken", result.response.refreshToken);
          setUser(result.user.userName);

          fetch("https://localhost:7180/api/Customers/GetCustomersByUserId/" + result.user.id, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.response.accessToken}`, // Đính kèm token vào header
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json(); // Phân tích cú pháp JSON từ phản hồi
            })
            .then((data) => {
              if (data.length === 0) {
                console.log("No customers found.");
                return;
              }
              // Lưu danh sách khách hàng vào localStorage dưới dạng chuỗi JSON
              localStorage.setItem("customers", JSON.stringify(data));
              console.log("Customers saved to localStorage:", data);
            })
            .catch((error) => {
              console.error("Error fetching customers:", error);
            });


          toast.success(`Đăng nhập thành công`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log(result);
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
            <span className="cart-count"> ({totalQuantity})</span>  {/* Hiển thị số lượng sản phẩm khác nhau */}
            <img
              src="https://cdn-icons-png.flaticon.com/128/5001/5001572.png"
              alt="Notification"
              className="navbar-icon"
            />
            <div className="navbar-user-icon">
              {/* {user ? (
                <span className="user-name">{user}</span>  // Hiển thị tên người dùng
              ) : ( */}
              <img
                src="https://cdn-icons-png.flaticon.com/128/456/456212.png"
                alt="User"
                className="navbar-icon"
                onClick={handleOpenAccount}
              />
              {/* )} */}
            </div>
          </div>
          {/* Login/Signup */}
          <div className="d-flex">
            {user ? (
              <>
                <span>Xin chào, {user}</span> &nbsp;
                <a onClick={handleLogout}>Đăng xuất</a>
              </>

            ) : (
              <>
                <a href="" onClick={handleShowLogin}>Đăng nhập</a>
                <span>/</span>
                <a href="" onClick={handleShowRegister}>Đăng ký</a>
              </>
            )}
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
                <span onClick={handleForgotPassword}>FORGOT PASSWORD ?</span>
                <button type="submit">
                  {isRegister ? "Đăng ký" : "Đăng nhập"}
                </button>
              </form>
              <button type="button" onClick={handleGoogleAuth}>
                {isRegister ? "Đăng ký bằng Google" : "Đăng nhập bằng Google"}
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
