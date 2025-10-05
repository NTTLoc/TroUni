import React from "react";
import "../contact/Contact.scss";
import ctImg from "../../assets/image/Vinhomes-Grand-Park.jpg";
import PanoramaViewer from "../../components/viewer360/Viewer360";
import { assets } from "../../assets/assets";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* <PanoramaViewer imageUrl="https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg" /> */}
      {/* <PanoramaViewer imageUrl={assets.anh360} /> */}
      <PanoramaViewer imageUrl={assets.anh360_3} />
      {/* Hero */}
      <section
        className="contact-hero"
        style={{ backgroundImage: `url(${ctImg})` }}
      >
        <div className="overlay" />
        <div className="hero-text">
          <h1>Liên hệ với chúng tôi</h1>
          <p>Đội ngũ Trọ UNI luôn sẵn sàng hỗ trợ bạn 24/7.</p>
        </div>
      </section>

      {/* Content */}
      <main className="contact-content">
        <div className="contact-card contact-info">
          <h2>Thông tin liên hệ</h2>
          <p>📍 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
          <p>📞 0123 456 789</p>
          <p>📧 info@rentalhousing.com</p>
          <p>
            🕒 Thứ 2 - Thứ 6: 8:00 - 17:30 <br /> Thứ 7: 8:00 - 12:00
          </p>
        </div>

        <div className="contact-card contact-form">
          <h2>Gửi tin nhắn cho chúng tôi</h2>
          <form>
            <div className="form-row">
              <input type="text" placeholder="Họ và tên" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="Số điện thoại" />
              <input type="text" placeholder="Tiêu đề" />
            </div>
            <textarea placeholder="Nội dung" rows="5"></textarea>
            <button type="submit">Gửi tin nhắn</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;
