import React, { useState } from "react";
import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null); // Quản lý trạng thái menu dropdown
  const [searchValue, setSearchValue] = useState(""); // Quản lý trạng thái tìm kiếm

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchValue}`);
    // Thực hiện logic tìm kiếm tại đây (VD: gọi API, điều hướng đến trang kết quả, v.v.)
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="./Home">
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
              <a className="nav-link" href="#">
                BLACK FRIDAY
              </a>
            </li>

            {/* product */}
            <li className="nav-item">
              <a className="nav-link" href="./Product">
                PRODUCTS
              </a>
            </li>

            {/* About */}
            <li className="nav-item">
              <a className="nav-link" href="#">
                ABOUT
              </a>
            </li>
          </ul>

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
          <div className="navbar-component d-flex align-items-center ms-3">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3514/3514491.png"
              alt="Cart"
              className="navbar-icon"
            />
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
