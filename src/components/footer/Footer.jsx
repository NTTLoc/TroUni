import React from "react";
import "../../components/footer/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__about">
          <h3>TroUni</h3>
          <p>
            Nền tảng tìm kiếm phòng trọ đáng tin cậy cho sinh viên. Chúng tôi
            kết nối bạn với hàng ngàn lựa chọn phù hợp và an toàn.
          </p>
        </div>

        <div className="footer__links">
          <h4>Về chúng tôi</h4>
          <ul>
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Hỗ trợ</h4>
          <ul>
            <li>
              <a href="#">Trung tâm trợ giúp</a>
            </li>
            <li>
              <a href="#">Câu hỏi thường gặp</a>
            </li>
            <li>
              <a href="#">Báo cáo vi phạm</a>
            </li>
          </ul>
        </div>

        <div className="footer__subscribe">
          <h4>Nhận thông báo mới</h4>
          <p>Đăng ký nhận email để không bỏ lỡ phòng trọ tốt.</p>
          <div className="footer__input-group">
            <input type="email" placeholder="Email của bạn" />
            <button>Gửi</button>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          &copy; {new Date().getFullYear()} TroUni. Tất cả bản quyền được bảo
          lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
