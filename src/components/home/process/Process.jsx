import React from "react";
import { Avatar } from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "./Process.scss";

const steps = [
  {
    icon: <UserAddOutlined />,
    title: "Đăng ký tài khoản",
    desc: "Tạo tài khoản miễn phí, chỉ mất 1 phút với email hoặc Facebook",
  },
  {
    icon: <SearchOutlined />,
    title: "Tìm phòng/Đăng tin",
    desc: "Tìm kiếm phòng hoặc đăng tin cho thuê dễ dàng với bộ lọc thông minh",
  },
  {
    icon: <MessageOutlined />,
    title: "Liên hệ & giao dịch",
    desc: "Kết nối nhanh chóng, an toàn, bảo mật với thanh toán online",
  },
];

const Process = () => {
  return (
    <section className="steps">
      <h2 className="steps-title">Quy trình sử dụng đơn giản</h2>
      <div className="steps-container">
        {steps.map((step, idx) => (
          <div className="step" key={idx}>
            <Avatar size={64} icon={step.icon} />
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;
