import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="g-4">
          <Col xs={12} md={4}>
            <h5 className="mb-3">Trọ UNI</h5>
            <p className="mb-0">
              Tìm kiếm phòng trọ, căn hộ cho thuê nhanh chóng, an toàn và tiện
              lợi. Kết nối người cho thuê và người thuê một cách hiệu quả.
            </p>
          </Col>
          <Col xs={12} md={4}>
            <h5 className="mb-3">Liên Kết Nhanh</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  <i className="bi bi-house-door me-2"></i>
                  Trang Chủ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/properties"
                  className="text-light text-decoration-none"
                >
                  <i className="bi bi-building me-2"></i>
                  Phòng Trọ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">
                  <i className="bi bi-info-circle me-2"></i>
                  Giới Thiệu
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none">
                  <i className="bi bi-envelope me-2"></i>
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <h5 className="mb-3">Liên Hệ</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                TP. HCM
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                0359177611
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                quannsse184831@fpt.edu.vn
              </li>
              <li className="mb-2">
                <i className="bi bi-clock me-2"></i>
                Thứ 2 - Chủ Nhật: 8:00 - 22:00
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4 bg-light" />
        <Row className="align-items-center">
          <Col
            xs={12}
            md={6}
            className="text-center text-md-start mb-3 mb-md-0"
          >
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Trọ UNI. All rights reserved.
            </p>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a
                href="https://www.facebook.com/N.Kuann"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a
                href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fkuann.ns%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBEwcTdJQVdxSVQ4Ynd3N3hOTwEekPkEd5lBruCvAI6z_FGYryBCM5LjO11Lu3uuGweoKMHps3BAzL9EEz1oLQU_aem_Zzr5PLBv4C-yW5_kJqMGWw&h=AT0nAqWkK7Ia9oaL-M2hCn0nfZhXvAXPgZX4md24PUFTn7k6w3WXEELZ2NDPxknEYZBps8xibKD1veYanv4aYg__7dqUNEtnLMUFDOxROxVZoDBwGoxM4vXLicaR2bLI0HO3"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a
                href="https://www.bing.com/videos/riverview/relatedvideo?q=rick+roll&&mid=8A80C20EEF999DE5A8268A80C20EEF999DE5A826&FORM=VAMGZC"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-youtube fs-5"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
