import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VerifyEmail.scss";
import { resendEmailApi, verifyEmailApi } from "../../services/authApi.js";
import { path } from "../../utils/constants.js";
import useMessage from "../../hooks/useMessage.js";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = useMessage();

  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await verifyEmailApi(email, code);

      if (res?.code === "200") {
        message.success("Đăng ký tài khoản thành công.");
        navigate(path.LOGIN);
      } else {
        message.error("Mã xác thực không đúng!");
      }
    } catch (err) {
      console.error("Verify error:", err);
      message.error("Có lỗi xảy ra, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendEmailApi(email);

      if (res?.code === 200) {
        message.success("Đã gửi lại mã. Vui lòng kiểm tra email.");
      } else {
        message.error("Đã gửi lại mã. Vui lòng kiểm tra email.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      message.error("Có lỗi xảy ra khi gửi lại mã.");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <img src="/logo.png" alt="TroUni Logo" className="verify-logo" />
        <h2>Xác minh email</h2>
        <p>
          Chúng tôi đã gửi mã xác minh đến <strong>{email}</strong>. <br />
          Vui lòng nhập mã để hoàn tất đăng ký.
        </p>

        <form onSubmit={handleVerify} className="verify-form">
          <input
            type="text"
            placeholder="Nhập mã xác minh"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang xác minh..." : "Xác minh"}
          </button>
        </form>

        <div className="verify-extra">
          <button
            className="link-btn"
            type="button"
            onClick={() => navigate("/register")}
          >
            Quay lại đăng ký
          </button>
          <button className="link-btn" type="button" onClick={handleResend}>
            Gửi lại mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
