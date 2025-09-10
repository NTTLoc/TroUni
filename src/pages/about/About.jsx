import React from "react";
import "./About.scss";
import { assets } from "../../../src/assets/assets.js";

const About = () => {
  return (
    <>
      <div className="about-page">
        <div className="about-header">
          <h1>Về TroUni</h1>
          <p>
            Nền tảng giúp sinh viên tìm trọ an toàn, tiện nghi và tiết kiệm.
          </p>
        </div>

        <div className="about-sections">
          <div className="about-card">
            <img src={assets.missionImg} alt="Sứ mệnh" />
            <div className="card-content">
              <h2>🌟 Sứ mệnh của chúng tôi</h2>
              <p>
                TroUni giúp sinh viên dễ dàng tìm kiếm và thuê nhà trọ phù hợp
                với nhu cầu học tập và tài chính. Mọi thông tin phòng trọ đều
                được xác minh minh bạch.
              </p>
            </div>
          </div>

          <div className="about-card reverse">
            <img src={assets.featuresImg} alt="Tính năng" />
            <div className="card-content">
              <h2>🔍 Tính năng nổi bật</h2>
              <ul>
                <li>Danh sách trọ có hình ảnh và đánh giá rõ ràng.</li>
                <li>Bộ lọc theo khu vực, giá, tiện ích.</li>
                <li>Quản lý trọ dễ dàng với tài khoản chủ trọ.</li>
                <li>Hệ thống báo cáo và xác minh để bảo vệ người dùng.</li>
              </ul>
            </div>
          </div>

          <div className="about-card">
            <img src={assets.missionImg} alt="Đối tác" />
            <div className="card-content">
              <h2>🤝 Đối tác & hỗ trợ</h2>
              <p>
                TroUni hợp tác với các trường đại học, ký túc xá và chủ nhà trọ
                uy tín. Đội ngũ hỗ trợ hoạt động 24/7 để giải đáp thắc mắc cho
                sinh viên.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
