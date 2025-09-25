import React from "react";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-col">
        <h4>Trọ UNI</h4>
        <p>
          Tìm kiếm phòng trọ, căn hộ cho thuê nhanh chóng, an toàn và tiện lợi.
        </p>
      </div>
      <div className="footer-col">
        <h4>Liên Kết Nhanh</h4>
        <ul>
          <li>Trang Chủ</li>
          <li>Phòng Trọ</li>
          <li>Giới Thiệu</li>
          <li>Liên Hệ</li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Liên Hệ</h4>
        <p>
          <EnvironmentOutlined /> TP. HCM
        </p>
        <p>
          <PhoneOutlined /> 0359 176 711
        </p>
        <p>
          <MailOutlined /> quannse184831@fpt.edu.vn
        </p>
        <p>
          <ClockCircleOutlined /> Thứ 2 - Chủ Nhật: 8:00 - 22:00
        </p>
      </div>
    </footer>
  );
};

export default Footer;
