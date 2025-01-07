import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container"> {/* Dùng className thay vì class */}
        {/* <!-- Cột 1: Thông tin liên hệ --> */}
        <div className="footer-column">
          <h3>Thông tin liên hệ</h3>
          <p>Địa chỉ: 123 Đường ABC, Phường XYZ, TP.HCM
            <br />Hotline: 0987 654 321
            <br />Email: contact@abc.com
          </p>
        </div>

        {/* <!-- Cột 3: Giới thiệu và hướng dẫn --> */}
        <div className="footer-column">
          <h3>Thông tin hữu ích</h3>
          <ul>
            <li><a href="/gioi-thieu">Giới thiệu</a></li>
            <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
            <li><a href="/quy-dinh-su-dung">Quy định sử dụng</a></li>
          </ul>
        </div>

        {/* <!-- Cột 2: Link liên hệ --> */}
        <div className="footer-column">
          <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
          <div className="img-container">
            <a href="/facebook"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8rWtyZay930YEYrIhNkdMon2UcFubUO0y4MFcwi8DQKI8F452FLb1OljUfe1djImwvQI&usqp=CAU" alt="Facebook" /></a>
            <a href="/zalo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo" /></a>
            <a href="/instagram"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeHWLyaSJh_FHHKfVYk2Uo5lsfCprd1H9E0Q&s" alt="Instagram" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
