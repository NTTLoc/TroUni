import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VerifyEmail.scss";
import { verifyEmailApi } from "../../utils/api/authApi.js";
import { path } from "../../utils/constants.js";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await verifyEmailApi(email, code);

      if (res?.code === "200") {
        navigate(path.LOGIN);
      } else {
        setError(res?.message || "Mã xác thực không đúng");
      }
    } catch (err) {
      console.error("Verify error:", err);
      setError("Có lỗi xảy ra, thử lại sau.");
    } finally {
      setLoading(false);
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
          {error && <div className="verify-error">{error}</div>}

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
          <button
            className="link-btn"
            type="button"
            onClick={() => console.log("Resend code")}
          >
            Gửi lại mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
