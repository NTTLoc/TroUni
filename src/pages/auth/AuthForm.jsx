import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, notification } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { path } from "../../utils/constants";
import { getUserDetailsApi } from "../../services/userApi.js";
import {
  loginGoogleApi,
  createUserApi,
  loginApi,
} from "../../services/authApi.js";
import useMessage from "../../hooks/useMessage.js";
import "./AuthForm.scss";

const AuthForm = ({ isRegister }) => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const message = useMessage();

  const handleAuthSuccess = async (res) => {
    if (res?.code === "SUCCESS" && res?.data) {
      message.success("Đăng nhập thành công", 1);

      const userData = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
      };

      localStorage.setItem("access_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      if (res.data.role !== "ADMIN") {
        try {
          const profileRes = await getUserDetailsApi();
          localStorage.setItem("profile", JSON.stringify(profileRes.data));
        } catch (err) {
          console.error("Lỗi lấy profile:", err);
        }
        navigate("/");
      } else {
        navigate(path.ADMIN);
      }

      setAuth({ isAuthenticated: true, user: userData });
    }
  };

  const onFinish = async (values) => {
    const { username, email, password, role } = values;

    try {
      if (isRegister) {
        const res = await createUserApi(username, email, password, role);
        if (res?.code === "SUCCESS") {
          navigate(path.VERIFY_EMAIL, { state: { email } });
        }
      } else {
        const res = await loginApi(email, password);
        handleAuthSuccess(res);
      }
    } catch (err) {
      console.log(">>> API error: ", err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await loginGoogleApi(tokenResponse.access_token);
        handleAuthSuccess(res);
      } catch (err) {
        console.log(">>> Google login error: ", err);
      }
    },
    onError: () => {
      notification.error({
        message: "Google Login",
        description: "Đăng nhập thất bại",
      });
    },
  });

  return (
    <div className="page-container">
      <main className={`auth ${isRegister ? "register" : "login"}`}>
        <div className="auth__container">
          <img src="/logo.png" alt="TroUni logo" className="auth__logo" />
          <h2>
            {isRegister ? "Đăng ký tài khoản TroUni" : "Đăng nhập vào TroUni"}
          </h2>

          <Form layout="vertical" className="auth__form" onFinish={onFinish}>
            {isRegister && (
              <Form.Item
                label="Họ tên"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            )}

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

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            {isRegister && (
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
            )}

            {isRegister && (
              <Form.Item
                label="Bạn là"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="STUDENT">Sinh viên</Option>
                  <Option value="LANDLORD">Chủ trọ</Option>
                </Select>
              </Form.Item>
            )}

            {!isRegister && (
              <Link to={path.FORGOT_PASSWORD} className="auth__link">
                Quên mật khẩu?
              </Link>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {isRegister ? "Đăng ký" : "Đăng nhập"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text__bonus">
            <hr />
            <span>Hoặc đăng nhập bằng</span>
            <hr />
          </div>

          <Button
            type="default"
            block
            className="auth__google"
            onClick={() => handleGoogleLogin()}
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google icon"
              style={{ marginRight: "8px" }}
            />
            Đăng nhập bằng Google
          </Button>

          <div className="auth__extra">
            {isRegister ? (
              <p>
                Đã có tài khoản?{" "}
                <Link to="/login" className="auth__link">
                  Đăng nhập
                </Link>
              </p>
            ) : (
              <p>
                Chưa có tài khoản?{" "}
                <Link to="/register" className="auth__link">
                  Đăng ký
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthForm;
