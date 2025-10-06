import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import { resetPasswordApi } from "../../services/authApi.js";
import { path } from "../../utils/constants.js";
import "./ResetPassword.scss";
import useMessage from "../../hooks/useMessage.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const message = useMessage();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { token, password } = values;
    setLoading(true);
    try {
      const res = await resetPasswordApi(token, password);
      if (res?.code === "SUCCESS") {
        message.success("Mật khẩu đã được đặt lại thành công");
        navigate(path.LOGIN);
      } else {
        message.error("Lỗi khi đặt lại mật khẩu! Vui lòng thử lại");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <img src="/logo.png" alt="TroUni Logo" className="reset-logo" />
        <h2>Đặt lại mật khẩu</h2>
        <p>Nhập mã xác thực và mật khẩu mới của bạn để tiếp tục.</p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mã xác thực"
            name="token"
            rules={[{ required: true, message: "Vui lòng nhập mã xác thực" }]}
          >
            <Input placeholder="Nhập mã xác thực" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
