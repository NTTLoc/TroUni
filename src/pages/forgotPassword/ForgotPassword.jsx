import React from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../services/authApi";
import "./ForgotPassword.scss";
import { path } from "../../utils/constants";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await forgotPasswordApi(values.email);
      if (res?.code === "SUCCESS") {
        notification.success({
          message: "Thành công",
          description: "Vui lòng kiểm tra email để đặt lại mật khẩu.",
        });
        navigate(path.RESET_PASSWORD); // quay lại trang login
      } else {
        notification.error({
          message: "Thất bại",
          description: res?.message || "Không thể gửi email.",
        });
      }
    } catch (err) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <div className="page-container">
      <main className="auth forgot-password">
        <div className="auth__container">
          <h2>Quên mật khẩu</h2>
          <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Gửi liên kết
              </Button>
            </Form.Item>
          </Form>

          <Button type="link" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
