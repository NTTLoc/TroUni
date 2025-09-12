import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaHome, FaUsers, FaShieldAlt, FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function About() {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi | Trọ UNI</title>
        <meta
          name="description"
          content="Nền tảng kết nối sinh viên với phòng trọ chất lượng, an toàn và tiện nghi."
        />
        <meta property="og:title" content="Về chúng tôi | Trọ UNI" />
        <meta
          property="og:description"
          content="Nền tảng kết nối sinh viên với phòng trọ chất lượng, an toàn và tiện nghi."
        />
      </Helmet>
      <div>
        {/* Hero Section */}
        <section
          className="d-flex align-items-center justify-content-center position-relative"
          style={{
            minHeight: "45vh",
            background: "linear-gradient(120deg, #60efff 0%, #00ff87 100%)",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80')",
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
          <Container style={{ zIndex: 2 }}>
            <Row className="align-items-center">
              <Col md={8} className="mx-auto text-center">
                <h1 className="display-4 fw-bold mb-3">Về Trọ UNI</h1>
                <p className="lead mb-4">
                  Nền tảng kết nối sinh viên với phòng trọ chất lượng, an toàn
                  và tiện nghi.
                </p>
                <Button
                  as="a"
                  href="/register"
                  variant="light"
                  size="lg"
                  aria-label="Tham gia ngay"
                >
                  Tham gia ngay
                </Button>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Mission & Vision */}
        <Container className="py-5">
          <Row className="mb-5">
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-lg border-0">
                <Card.Body>
                  <h3 className="mb-3 text-primary">Sứ mệnh</h3>
                  <p>
                    Mang đến giải pháp nhà ở an toàn, tiện nghi và phù hợp với
                    sinh viên. Trọ UNI không chỉ là nơi tìm kiếm phòng trọ, mà
                    còn là cộng đồng kết nối sinh viên với những ngôi nhà thứ
                    hai của họ.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-lg border-0">
                <Card.Body>
                  <h3 className="mb-3 text-primary">Tầm nhìn</h3>
                  <p>
                    Trở thành nền tảng hàng đầu trong lĩnh vực cho thuê phòng
                    trọ sinh viên, góp phần nâng cao chất lượng cuộc sống và học
                    tập của sinh viên Việt Nam.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Giá trị cốt lõi */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-4 fw-bold">Giá trị cốt lõi</h2>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm text-center border-0">
                <Card.Body>
                  <FaHome className="display-4 mb-3 text-primary" />
                  <h5>Đa dạng lựa chọn</h5>
                  <p>
                    Hàng nghìn phòng trọ chất lượng, đa dạng về vị trí và giá cả
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm text-center border-0">
                <Card.Body>
                  <FaUsers className="display-4 mb-3 text-primary" />
                  <h5>Cộng đồng sinh viên</h5>
                  <p>Kết nối, chia sẻ kinh nghiệm và hỗ trợ lẫn nhau</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm text-center border-0">
                <Card.Body>
                  <FaShieldAlt className="display-4 mb-3 text-primary" />
                  <h5>An toàn & Đáng tin cậy</h5>
                  <p>Kiểm duyệt kỹ lưỡng về chất lượng và an ninh</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm text-center border-0">
                <Card.Body>
                  <FaHandshake className="display-4 mb-3 text-primary" />
                  <h5>Hỗ trợ 24/7</h5>
                  <p>Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Đội ngũ (nếu muốn thêm) */}
          {/* <Row className="mt-5">
            <Col>
              <h2 className="text-center mb-4 fw-bold">Đội ngũ phát triển</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={3} className="text-center mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Img variant="top" src="/images/avatar1.jpg" className="rounded-circle mx-auto mt-3" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                <Card.Body>
                  <h5>Nguyễn Văn A</h5>
                  <p>Founder & CEO</p>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}

          {/* Contact Info */}
          <Row className="mt-5">
            <Col md={8} className="mx-auto">
              <Card className="shadow-lg border-0">
                <Card.Body>
                  <h3 className="text-center mb-4">Liên hệ với chúng tôi</h3>
                  <Row>
                    <Col md={4} className="text-center mb-3">
                      <h5>Địa chỉ</h5>
                      <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <h5>Email</h5>
                      <p>contact@trouni.com</p>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <h5>Hotline</h5>
                      <p>1900 1234</p>
                    </Col>
                  </Row>
                </Card.Body>
                <Button
                  as={Link}
                  to="/contact"
                  variant="primary"
                  size="lg"
                  className="mt-4 px-5 align-self-center"
                >
                  Liên hệ ngay
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default About;
