import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.scss";
import { createUserApi, loginApi, loginGoogleApi } from "../../utils/api";
import { notification } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

const AuthForm = ({ isRegister }) => {
  const [agreePolicy, setAgreePolicy] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleAuthSuccess = (res) => {
    if (res?.code === "SUCCESS" && res?.data) {
      // Lưu token
      localStorage.setItem("access_token", res.data.token);

      // Lưu thông tin user
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        })
      );

      // Update state toàn cục
      setAuth({
        isAuthenticated: true,
        user: {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        },
      });

      navigate("/");
    }
  };

  const onFinish = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");

    try {
      const res = isRegister
        ? await createUserApi(username, email, password)
        : await loginApi(email, password);

      handleAuthSuccess(res);
    } catch (err) {
      console.log(">>> API error: ", err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // tokenResponse chứa access_token của Google
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
      {isRegister ? (
        // register
        <main className="page-content register">
          <div className="register__container">
            <img src="/logo.png" alt="TroUni logo" className="register__logo" />
            <h2>"Đăng ký tài khoản TroUni"</h2>

            <form className="register__form" onSubmit={onFinish}>
              <label>Họ tên</label>
              <input
                type="text"
                name="username"
                placeholder="Nhập họ tên"
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                required
              />

              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="Tạo mật khẩu"
                required
              />

              <div className="register__checkbox">
                <input
                  type="checkbox"
                  id="agreePolicy"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  required
                />
                <label htmlFor="agreePolicy">
                  Tôi đồng ý với{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Chính sách bảo mật
                  </a>{" "}
                  và{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Điều khoản sử dụng
                  </a>
                </label>
              </div>

              <button type="submit" className="register__submit">
                Đăng ký
              </button>

              <div className="text__bonus">
                <hr />
                <span>Hoặc đăng nhập bằng</span>
                <hr />
              </div>

              <button
                type="button"
                className="login__google"
                onClick={() => handleGoogleLogin()}
              >
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google icon"
                />
                Đăng nhập bằng Google
              </button>
            </form>

            <div className="register__extra">
              <p>
                Đã có tài khoản?{" "}
                <Link to="/login" className="register__login-link">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </main>
      ) : (
        // login
        <main className="page-content login">
          <div className="login__container">
            <img
              src="/logo.png" // Bạn cần có logo đặt trong public/logo.png
              alt="TroUni logo"
              className="login__logo"
            />
            <h2>Đăng nhập vào TroUni</h2>

            <form className="login__form" onSubmit={onFinish}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                required
              />

              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                required
              />

              <Link to="/forgot-password">Quên mật khẩu?</Link>

              <button type="submit" className="login__submit">
                Đăng nhập
              </button>

              <div className="text__bonus">
                <hr />
                <span>Hoặc đăng nhập bằng</span>
                <hr />
              </div>

              <button
                type="button"
                className="login__google"
                onClick={() => handleGoogleLogin()}
              >
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google icon"
                />
                Đăng nhập bằng Google
              </button>
            </form>

            <div className="login__extra">
              <p>
                Chưa có tài khoản?{" "}
                <Link to="/register" className="login__register-link">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default AuthForm;
