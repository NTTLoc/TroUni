import React from "react";
import { FaHome, FaShieldAlt, FaHeadset, FaCamera } from "react-icons/fa";

const features = [
  {
    icon: <FaHome />,
    title: "Đa dạng lựa chọn",
    desc: "Hàng ngàn phòng trọ, căn hộ với đầy đủ tiện nghi phù hợp mọi nhu cầu",
  },
  {
    icon: <FaShieldAlt />,
    title: "An toàn & Đáng tin cậy",
    desc: "Xác minh thông tin chủ trọ và đánh giá từ người dùng thực tế",
  },
  {
    icon: <FaHeadset />,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc và hỗ trợ sinh viên",
  },
  {
    icon: <FaCamera />,
    title: "Đăng tin miễn phí",
    desc: "Không mất phí đăng tin, tiếp cận hàng ngàn khách hàng tiềm năng",
  },
];

const FeatureList = () => {
  return (
    <section className="features">
      <h2 className="section-title">Tại sao chọn Trọ UNI?</h2>
      <div className="feature-grid">
        {features.map((f, i) => (
          <div className="card" key={i}>
            <div className="bg-icon">
              <div className="icon">{f.icon}</div>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureList;
