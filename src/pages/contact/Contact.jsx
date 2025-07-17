import React from "react";
import "../contact/Contact.scss";

const Contact = () => {
  return (
    <div className="page-container">
      <main className="page-content contact">
        <div className="contact-container">
          <h1 className="contact-title">Liên hệ với TroUni</h1>
          <p className="contact-subtitle">
            Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy để lại lời nhắn hoặc liên
            hệ trực tiếp qua thông tin dưới đây.
          </p>

          <div className="contact-content">
            <div className="contact-form">
              <form>
                <label>Họ và tên</label>
                <input type="text" placeholder="Nguyễn Văn A" />

                <label>Email</label>
                <input type="email" placeholder="example@gmail.com" />

                <label>Nội dung</label>
                <textarea placeholder="Viết lời nhắn của bạn..." rows="5" />

                <button type="submit">Gửi liên hệ</button>
              </form>
            </div>

            <div className="contact-info">
              <h3>📍 Địa chỉ</h3>
              <p>123 Đường Sinh Viên, Quận 1, TP.HCM</p>

              <h3>📞 Số điện thoại</h3>
              <p>0123 456 789</p>

              <h3>📧 Email</h3>
              <p>tro.uni@gmail.com</p>

              <h3>🕒 Giờ làm việc</h3>
              <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
