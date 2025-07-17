import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.scss";
import { createUserApi, loginApi } from "../../utils/api";
import { notification } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../components/context/auth.context";

const AuthForm = ({ isRegister }) => {
  const [agreePolicy, setAgreePolicy] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (isRegister) {
      const res = await createUserApi(name, email, password);

      if (res) {
        notification.success({
          message: "CREATE USER",
          description: "Success",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "CREATE USER",
          description: "error",
        });
      }
    } else {
      const res = await loginApi(email, password);

      if (res && res.EC === 0) {
        localStorage.setItem("access_token", res.access_token);
        notification.success({
          message: "LOGIN USER",
          description: "Success",
        });
        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.user?.email ?? "",
            name: res?.user?.name ?? "",
          },
        });
        navigate("/");
      } else {
        notification.error({
          message: "LOGIN USER",
          description: res?.EM ?? "error",
        });
      }
    }
  };

  return (
    <div className="page-container">
      {isRegister ? (
        // register
        <main className="page-content register">
          <div className="register__container">
            <img src="/logo.png" alt="TroUni logo" className="register__logo" />
            <h2>"Đăng ký tài khoản TroUni"</h2>

            <form onSubmit={onFinish} className="register__form">
              <label>Họ tên</label>
              <input
                type="text"
                name="name"
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

              {/* <label>Xác nhận mật khẩu</label>
              <input type="password" placeholder="Nhập lại mật khẩu" required /> */}

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

              <button type="button" className="login__google">
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

            <form onSubmit={onFinish} className="login__form">
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

              <button type="button" className="login__google">
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
