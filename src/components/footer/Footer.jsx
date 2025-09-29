import React from "react";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      {/* Cột giới thiệu */}
      <div className="footer-col">
        <h4>Trọ UNI</h4>
        <p>
          Tìm kiếm phòng trọ, căn hộ cho thuê nhanh chóng, an toàn và tiện lợi.
        </p>
      </div>
      {/* Cột liên kết nhanh */}
      <div className="footer-col">
        <h4>Liên Kết Nhanh</h4>
        <ul>
          <li onClick={() => navigate("/")}>Trang Chủ</li>
          <li onClick={() => navigate("/posts")}>Phòng Trọ</li>
          <li onClick={() => navigate("/about")}>Giới Thiệu</li>
          <li onClick={() => navigate("/contact")}>Liên Hệ</li>
        </ul>
      </div>
      {/* Cột liên hệ */}{" "}
      <div className="footer-col">
        {" "}
        <h4>Liên Hệ</h4>{" "}
        <p>
          {" "}
          <EnvironmentOutlined /> TP. HCM{" "}
        </p>{" "}
        <p>
          {" "}
          <PhoneOutlined /> 0359 176 711{" "}
        </p>{" "}
        <p>
          {" "}
          <MailOutlined /> quannse184831@fpt.edu.vn{" "}
        </p>{" "}
        <p>
          {" "}
          <ClockCircleOutlined /> Thứ 2 - Chủ Nhật: 8:00 - 22:00{" "}
        </p>{" "}
      </div>
    </footer>
  );
};

export default Footer;
