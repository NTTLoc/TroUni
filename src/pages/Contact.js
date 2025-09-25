import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      <Helmet>
        <title>Liên hệ | Trọ UNI</title>
        <meta
          name="description"
          content="Đội ngũ Trọ UNI luôn sẵn sàng hỗ trợ bạn 24/7. Hãy gửi tin nhắn hoặc liên hệ trực tiếp qua các kênh bên dưới!"
        />
        <meta property="og:title" content="Liên hệ | Trọ UNI" />
        <meta
          property="og:description"
          content="Đội ngũ Trọ UNI luôn sẵn sàng hỗ trợ bạn 24/7. Hãy gửi tin nhắn hoặc liên hệ trực tiếp qua các kênh bên dưới!"
        />
      </Helmet>
      <div>
        {/* Hero Section */}
        <section
          className="d-flex align-items-center justify-content-center position-relative"
          style={{
            minHeight: "40vh",
            background: "linear-gradient(120deg, #60efff 0%, #00ff87 100%)",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
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
                <h1 className="display-4 fw-bold mb-3">
                  Liên hệ với chúng tôi
                </h1>
                <p className="lead mb-4">
                  Đội ngũ Trọ UNI luôn sẵn sàng hỗ trợ bạn 24/7. Hãy gửi tin
                  nhắn hoặc liên hệ trực tiếp qua các kênh bên dưới!
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        <Container className="py-5">
          <Row className="justify-content-center">
            {/* Contact Information */}
            <Col md={4} className="mb-4">
              <Card className="shadow-lg border-0 text-center h-100">
                <Card.Body>
                  <h4 className="mb-4">Thông tin liên hệ</h4>
                  <div className="mb-3">
                    <i className="bi bi-geo-alt fs-2 text-primary"></i>
                    <p className="mb-2 mt-2">
                      123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                    </p>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-telephone fs-2 text-primary"></i>
                    <p className="mb-2 mt-2">0123 456 789</p>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-envelope fs-2 text-primary"></i>
                    <p className="mb-2 mt-2">info@rentalhousing.com</p>
                  </div>
                  <div>
                    <i className="bi bi-clock fs-2 text-primary"></i>
                    <p className="mb-0 mt-2">
                      Thứ 2 - Thứ 6: 8:00 - 17:30
                      <br />
                      Thứ 7: 8:00 - 12:00
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Form */}
            <Col md={8}>
              <Card className="shadow-lg border-0">
                <Card.Body>
                  <h4 className="mb-4 text-center">
                    Gửi tin nhắn cho chúng tôi
                  </h4>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và tên</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tiêu đề</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Nội dung</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button variant="primary" type="submit" size="lg">
                        Gửi tin nhắn
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Contact;
