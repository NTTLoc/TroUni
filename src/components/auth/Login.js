import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Đăng nhập thành công!");
      navigate(from, { replace: true });
    } catch (error) {
      setError("Email hoặc mật khẩu không đúng");
      toast.error("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center position-relative"
        style={{
          minHeight: "40vh",
          background: "linear-gradient(120deg, #60efff 0%, #00ff87 100%)",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.45)",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        ></div>
        <div className="container" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-md-7 text-center">
              <h1 className="display-4 fw-bold mb-3">Đăng Nhập</h1>
              <p className="lead mb-4">
                Chào mừng bạn quay lại Trọ UNI! Đăng nhập để trải nghiệm dịch vụ
                tìm phòng trọ hiện đại, an toàn, tiện lợi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body>
                <div className="text-center mb-4">
                  <i className="bi bi-person-circle fs-1 text-primary"></i>
                </div>
                <h2 className="text-center mb-4">Đăng Nhập</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập email của bạn"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Nhập mật khẩu của bạn"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-2"
                    disabled={loading}
                  >
                    Đăng Nhập
                  </Button>
                </Form>

                <Button
                  as={Link}
                  to="/"
                  variant="outline-secondary"
                  className="w-100 mt-2"
                  aria-label="Quay về trang chủ"
                >
                  ← Quay về trang chủ
                </Button>

                <div className="text-center mt-3">
                  <p>
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-decoration-none">
                      Đăng ký ngay
                    </Link>
                  </p>
                  <Link to="/forgot-password" className="text-decoration-none">
                    Quên mật khẩu?
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
