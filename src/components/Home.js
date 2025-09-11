import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchFilter from "./property/SearchFilter";
import { useTheme } from "../contexts/ThemeContext";

function Home() {
  const { theme } = useTheme();
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">
                Tìm Phòng Trọ Sinh Viên
                <br />
                <span className="text-primary">Nhanh Chóng & An Toàn</span>
              </h1>
              <p className="lead mb-4">
                Trọ UNI - Nền tảng kết nối sinh viên với phòng trọ chất lượng.
                Tìm kiếm, đặt lịch xem phòng và thanh toán trực tuyến một cách
                dễ dàng.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/login" variant="primary" size="lg">
                  Đăng Nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-primary"
                  size="lg"
                >
                  Đăng Ký
                </Button>
              </div>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <img
                src="/images/hero-image.jpg"
                alt="Rental Housing"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Tìm Kiếm Phòng Trọ</h2>
        <SearchFilter />
      </Container>

      {/* Features Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Tại Sao Chọn Chúng Tôi?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div
                className="p-4"
                style={{
                  background: theme === "dark" ? "#23272b" : "#fff",
                  color: theme === "dark" ? "#fff" : "#222",
                  border: theme === "light" ? "1px solid #e0e0e0" : "none",
                  boxShadow:
                    theme === "light" ? "0 2px 8px #0001" : "0 4px 16px #0008",
                  borderRadius: 16,
                  minHeight: 260,
                  transition: "all 0.3s",
                }}
              >
                <i
                  className="bi bi-house-door fs-1 mb-3"
                  style={{
                    color: "#00ffb8",
                    background: "linear-gradient(45deg, #00ff87, #60efff)",
                    borderRadius: "50%",
                    padding: 18,
                    fontSize: 40,
                    marginBottom: 18,
                  }}
                ></i>
                <h3 className="fw-bold">Đa Dạng Lựa Chọn</h3>
                <p>Hàng ngàn phòng trọ, căn hộ với đầy đủ tiện nghi</p>
              </div>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div
                className="p-4"
                style={{
                  background: theme === "dark" ? "#23272b" : "#fff",
                  color: theme === "dark" ? "#fff" : "#222",
                  border: theme === "light" ? "1px solid #e0e0e0" : "none",
                  boxShadow:
                    theme === "light" ? "0 2px 8px #0001" : "0 4px 16px #0008",
                  borderRadius: 16,
                  minHeight: 260,
                  transition: "all 0.3s",
                }}
              >
                <i
                  className="bi bi-shield-check fs-1 mb-3"
                  style={{
                    color: "#00ffb8",
                    background: "linear-gradient(45deg, #00ff87, #60efff)",
                    borderRadius: "50%",
                    padding: 18,
                    fontSize: 40,
                    marginBottom: 18,
                  }}
                ></i>
                <h3 className="fw-bold">An Toàn & Đáng Tin Cậy</h3>
                <p>Xác minh thông tin chủ trọ và đánh giá từ người dùng</p>
              </div>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div
                className="p-4"
                style={{
                  background: theme === "dark" ? "#23272b" : "#fff",
                  color: theme === "dark" ? "#fff" : "#222",
                  border: theme === "light" ? "1px solid #e0e0e0" : "none",
                  boxShadow:
                    theme === "light" ? "0 2px 8px #0001" : "0 4px 16px #0008",
                  borderRadius: 16,
                  minHeight: 260,
                  transition: "all 0.3s",
                }}
              >
                <i
                  className="bi bi-chat-dots fs-1 mb-3"
                  style={{
                    color: "#00ffb8",
                    background: "linear-gradient(45deg, #00ff87, #60efff)",
                    borderRadius: "50%",
                    padding: 18,
                    fontSize: 40,
                    marginBottom: 18,
                  }}
                ></i>
                <h3 className="fw-bold">Hỗ Trợ 24/7</h3>
                <p>Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Home;
