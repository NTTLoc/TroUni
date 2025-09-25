import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Carousel,
  Badge,
  ProgressBar,
  Modal,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaShare,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import { MdVerified, MdSecurity, MdSpeed, MdPayment } from "react-icons/md";
import FAQ from "./FAQ";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../contexts/AuthContext";

const featuredProperties = [
  {
    id: 1,
    title: "Phòng trọ cao cấp",
    price: "2.500.000đ/tháng",
    location: "Quận 1, TP.HCM",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "Phòng trọ cao cấp, đầy đủ tiện nghi, gần trung tâm",
    rating: 4.8,
    reviews: 127,
    amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Máy giặt"],
    distance: "0.5km từ ĐH Bách Khoa",
    verified: true,
    discount: "Giảm 10% tháng đầu",
  },
  {
    id: 2,
    title: "Ký túc xá sinh viên",
    price: "1.800.000đ/tháng",
    location: "Quận Thủ Đức, TP.HCM",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    description: "Ký túc xá sinh viên, an ninh 24/7, wifi miễn phí",
    rating: 4.6,
    reviews: 89,
    amenities: ["Wifi", "An ninh 24/7", "Căng tin", "Thư viện"],
    distance: "0.2km từ ĐH Quốc Gia",
    verified: true,
    discount: "Miễn phí 1 tháng",
  },
  {
    id: 3,
    title: "Nhà nguyên căn",
    price: "8.000.000đ/tháng",
    location: "Quận 7, TP.HCM",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    description: "Nhà nguyên căn 2 phòng ngủ, đầy đủ nội thất",
    rating: 4.9,
    reviews: 203,
    amenities: ["Wifi", "Điều hòa", "Bếp", "Ban công"],
    distance: "1.2km từ ĐH FPT",
    verified: true,
    discount: "Giảm 15% 6 tháng",
  },
];

const reviews = [
  {
    name: "Nguyễn Văn A",
    comment:
      "Phòng đẹp, chủ thân thiện, gần trường! Tìm được phòng ưng ý chỉ sau 2 ngày.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    university: "ĐH Bách Khoa TP.HCM",
    date: "2 tuần trước",
  },
  {
    name: "Trần Thị B",
    comment:
      "Tiện nghi đầy đủ, an ninh tốt. Chủ trọ rất nhiệt tình và hỗ trợ sinh viên.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    university: "ĐH Kinh tế TP.HCM",
    date: "1 tháng trước",
  },
  {
    name: "Lê Văn C",
    comment:
      "Vị trí thuận tiện, giá cả hợp lý với sinh viên. Đặc biệt thích tính năng chat trực tiếp.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    university: "ĐH Quốc Gia TP.HCM",
    date: "3 tuần trước",
  },
];

const stats = [
  { label: "Phòng trọ", value: "15,000+", icon: "🏠" },
  { label: "Sinh viên", value: "50,000+", icon: "👨‍🎓" },
  { label: "Chủ trọ", value: "3,000+", icon: "👨‍💼" },
  { label: "Đánh giá", value: "25,000+", icon: "⭐" },
];

const universities = [
  "ĐH Bách Khoa TP.HCM",
  "ĐH Quốc Gia TP.HCM",
  "ĐH Kinh tế TP.HCM",
  "ĐH FPT",
  "ĐH Sư phạm TP.HCM",
  "ĐH Y Dược TP.HCM",
];

function Home() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [priceRange, setPriceRange] = useState([1000000, 5000000]);
  const [favorites, setFavorites] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useAuth();

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSearch = () => {
    setShowSearchModal(false);
    // Redirect to properties page with filters
  };

  return (
    <>
      <Helmet>
        <title>Trang chủ | Trọ UNI</title>
        <meta
          name="description"
          content="Tìm kiếm phòng trọ, căn hộ cho thuê nhanh chóng, an toàn và tiện lợi."
        />
        <meta property="og:title" content="Trang chủ | Trọ UNI" />
        <meta
          property="og:description"
          content="Tìm kiếm phòng trọ, căn hộ cho thuê nhanh chóng, an toàn và tiện lợi."
        />
      </Helmet>
      <div className="home-page">
        {/* Hero Section với Animation */}
        <section
          className="hero-section d-flex align-items-center justify-content-center position-relative"
          style={{
            minHeight: "80vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Elements */}
          <div className="floating-elements">
            <div
              className="floating-icon"
              style={{ top: "20%", left: "10%", animationDelay: "0s" }}
            >
              🏠
            </div>
            <div
              className="floating-icon"
              style={{ top: "60%", right: "15%", animationDelay: "2s" }}
            >
              🎓
            </div>
            <div
              className="floating-icon"
              style={{ top: "30%", right: "25%", animationDelay: "4s" }}
            >
              💡
            </div>
            <div
              className="floating-icon"
              style={{ top: "70%", left: "20%", animationDelay: "6s" }}
            >
              ⭐
            </div>
          </div>

          <div
            className="position-absolute w-100 h-100"
            style={{
              background: "rgba(0,0,0,0.4)",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          ></div>
          <Container style={{ zIndex: 2 }}>
            <Row className="align-items-center">
              <Col md={7} className="mb-4 mb-md-0">
                <div className="hero-content" data-aos="fade-right">
                  <h1 className="display-3 fw-bold mb-3 text-gradient">
                    Tìm kiếm nhà trọ đẳng cấp, an toàn, tiện nghi
                  </h1>
                  <p className="lead mb-4 fs-5">
                    Hàng ngàn phòng trọ, ký túc xá, căn hộ đang chờ bạn. Đăng
                    tin miễn phí, tìm phòng nhanh chóng, kết nối chủ trọ uy tín.
                  </p>

                  {/* Interactive Search Bar */}
                  <div className="search-container mb-4">
                    <Form className="d-flex search-form">
                      <Form.Control
                        type="text"
                        placeholder="Nhập khu vực, địa chỉ, trường đại học..."
                        className="me-2 shadow-lg search-input"
                        style={{
                          maxWidth: 400,
                          borderRadius: "25px",
                          border: "none",
                          padding: "15px 20px",
                          fontSize: "16px",
                        }}
                      />
                      <Button
                        variant="light"
                        size="lg"
                        className="search-btn"
                        style={{
                          borderRadius: "25px",
                          padding: "15px 30px",
                          fontWeight: "600",
                        }}
                        onClick={() => setShowSearchModal(true)}
                      >
                        🔍 Tìm phòng
                      </Button>
                    </Form>
                  </div>

                  <div className="hero-buttons">
                    {currentUser?.role === "owner" ? (
                      <Button
                        as={Link}
                        to="/dashboard/owner/post-property"
                        variant="outline-light"
                        size="lg"
                        className="me-3 mb-2 hero-btn"
                        style={{
                          borderRadius: "25px",
                          padding: "12px 30px",
                          borderWidth: "2px",
                          fontWeight: "600",
                        }}
                      >
                        📝 Đăng tin miễn phí
                      </Button>
                    ) : (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-disabled">
                            Chỉ chủ trọ mới có thể đăng tin. Vui lòng đăng nhập
                            bằng tài khoản chủ trọ.
                          </Tooltip>
                        }
                      >
                        <span>
                          <Button
                            variant="outline-light"
                            size="lg"
                            className="me-3 mb-2 hero-btn"
                            style={{
                              borderRadius: "25px",
                              padding: "12px 30px",
                              borderWidth: "2px",
                              fontWeight: "600",
                              pointerEvents: "none",
                              opacity: 0.7,
                            }}
                            disabled
                          >
                            �� Đăng tin miễn phí
                          </Button>
                        </span>
                      </OverlayTrigger>
                    )}
                    <Button
                      variant="light"
                      size="lg"
                      className="mb-2 hero-btn"
                      style={{
                        borderRadius: "25px",
                        padding: "12px 30px",
                        fontWeight: "600",
                      }}
                      onClick={() => setShowSearchModal(true)}
                    >
                      🎯 Tìm kiếm nâng cao
                    </Button>
                  </div>

                  {/* Quick Stats */}
                  <div className="quick-stats mt-4">
                    <Row>
                      {stats.map((stat, index) => (
                        <Col key={index} className="text-center">
                          <div className="stat-item">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </Col>
              <Col md={5} className="d-none d-md-block">
                <div className="hero-image-container" data-aos="fade-left">
                  <img
                    src="https://vinhomesgrandpark.tv/wp-content/uploads/2023/02/cv-scaled.jpg"
                    alt="Hero"
                    className="img-fluid rounded shadow-lg hero-image"
                    style={{
                      maxHeight: 450,
                      objectFit: "cover",
                      borderRadius: "20px",
                      transform: "perspective(1000px) rotateY(-5deg)",
                      transition: "transform 0.3s ease",
                    }}
                    loading="lazy"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Lợi ích/Ưu điểm với Animation */}
        <section className="benefits-section bg-light py-5">
          <Container>
            <h2
              className="text-center mb-5 fw-bold section-title"
              data-aos="fade-up"
            >
              Tại sao chọn Trọ UNI?
            </h2>
            <Row>
              <Col
                md={3}
                className="text-center mb-4"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="benefit-card p-4 h-100">
                  <div className="benefit-icon mb-3">
                    <i className="bi bi-house-door-fill"></i>
                  </div>
                  <h5 className="fw-bold">Đa dạng lựa chọn</h5>
                  <p className="">
                    Hàng ngàn phòng trọ, căn hộ với đầy đủ tiện nghi phù hợp mọi
                    nhu cầuc
                  </p>
                </div>
              </Col>
              <Col
                md={3}
                className="text-center mb-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="benefit-card p-4 h-100">
                  <div className="benefit-icon mb-3">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h5 className="fw-bold">An toàn & Đáng tin cậy</h5>
                  <p>
                    Xác minh thông tin chủ trọ và đánh giá từ người dùng thực tế
                  </p>
                </div>
              </Col>
              <Col
                md={3}
                className="text-center mb-4"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="benefit-card p-4 h-100">
                  <div className="benefit-icon mb-3">
                    <i className="bi bi-chat-dots-fill"></i>
                  </div>
                  <h5 className="fw-bold">Hỗ trợ 24/7</h5>
                  <p>
                    Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc và hỗ trợ
                    sinh viên
                  </p>
                </div>
              </Col>
              <Col
                md={3}
                className="text-center mb-4"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="benefit-card p-4 h-100">
                  <div className="benefit-icon mb-3">
                    <i className="bi bi-cash-coin"></i>
                  </div>
                  <h5 className="fw-bold ">Đăng tin miễn phí</h5>
                  <p>
                    Không mất phí đăng tin, tiếp cận hàng ngàn khách hàng tiềm
                    năng
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Danh sách phòng trọ nổi bật với Interactive Cards */}
        <section className="featured-properties py-5">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold section-title" data-aos="fade-right">
                Phòng trọ nổi bật
              </h2>
              <Button
                as={Link}
                to="/properties"
                variant="outline-primary"
                className="view-all-btn"
                data-aos="fade-left"
              >
                Xem tất cả →
              </Button>
            </div>
            <Row>
              {featuredProperties.map((property, index) => (
                <Col
                  key={property.id}
                  md={4}
                  className="mb-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="property-card shadow-sm h-100">
                    <div className="property-image-container">
                      <Card.Img
                        variant="top"
                        src={property.image}
                        className="property-image"
                      />
                      <div className="property-overlay">
                        <Button
                          variant="light"
                          size="sm"
                          className="favorite-btn"
                          onClick={() => toggleFavorite(property.id)}
                        >
                          <FaHeart
                            className={
                              favorites.includes(property.id)
                                ? "text-danger"
                                : "text-muted"
                            }
                          />
                        </Button>
                        <Button variant="light" size="sm" className="share-btn">
                          <FaShare />
                        </Button>
                      </div>
                      {property.discount && (
                        <Badge bg="danger" className="discount-badge">
                          {property.discount}
                        </Badge>
                      )}
                      {property.verified && (
                        <Badge bg="success" className="verified-badge">
                          <MdVerified /> Đã xác minh
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="property-header mb-2">
                        <Card.Title className="fw-bold mb-1">
                          {property.title}
                        </Card.Title>
                        <div className="property-location">
                          <FaMapMarkerAlt className="text-primary me-1" />
                          {property.location}
                        </div>
                      </div>

                      <div className="property-price mb-2">
                        <span className="price-amount">{property.price}</span>
                      </div>

                      <div className="property-rating mb-2">
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" />
                          <span className="fw-bold me-1">
                            {property.rating}
                          </span>
                          <span className="text-muted">
                            ({property.reviews} đánh giá)
                          </span>
                        </div>
                      </div>

                      <div className="property-distance mb-2">
                        <small className="text-success">
                          📍 {property.distance}
                        </small>
                      </div>

                      <div className="property-amenities mb-3">
                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge
                            key={idx}
                            bg="light"
                            text="dark"
                            className="me-1"
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge bg="light" text="dark">
                            +{property.amenities.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-auto">
                        <Button
                          as={Link}
                          to={`/property/${property.id}`}
                          variant="primary"
                          className="w-100 mb-2"
                        >
                          Xem chi tiết
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="flex-fill"
                          >
                            <FaPhone /> Gọi ngay
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="flex-fill"
                          >
                            <FaWhatsapp /> Chat
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Quy trình sử dụng với Progress Steps */}
        <section className="process-section bg-light py-5">
          <Container>
            <h2
              className="text-center mb-5 fw-bold section-title"
              data-aos="fade-up"
            >
              Quy trình sử dụng đơn giản
            </h2>
            <Row className="text-center">
              <Col
                md={4}
                className="mb-4"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-icon mb-3">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <h5 className="fw-bold">Đăng ký tài khoản</h5>
                  <p>
                    Tạo tài khoản miễn phí, chỉ mất 1 phút với email hoặc
                    Facebook
                  </p>
                </div>
              </Col>
              <Col
                md={4}
                className="mb-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-icon mb-3">
                    <i className="bi bi-search-heart-fill"></i>
                  </div>
                  <h5 className="fw-bold">Tìm phòng/Đăng tin</h5>
                  <p>
                    Tìm kiếm phòng phù hợp hoặc đăng tin cho thuê dễ dàng với bộ
                    lọc thông minh
                  </p>
                </div>
              </Col>
              <Col
                md={4}
                className="mb-4"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-icon mb-3">
                    <i className="bi bi-chat-dots-fill"></i>
                  </div>
                  <h5 className="fw-bold">Liên hệ & giao dịch</h5>
                  <p>
                    Kết nối nhanh chóng, giao dịch an toàn, bảo mật với thanh
                    toán online
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Đánh giá khách hàng với Interactive Carousel */}
        <section className="reviews-section py-5">
          <Container>
            <h2
              className="text-center mb-5 fw-bold section-title"
              data-aos="fade-up"
            >
              Khách hàng nói gì về Trọ UNI?
            </h2>
            <Carousel
              indicators={false}
              interval={5000}
              className="reviews-carousel"
              onSelect={(index) => setCurrentSlide(index)}
            >
              {reviews.map((review, idx) => (
                <Carousel.Item key={idx}>
                  <Card className="review-card shadow-sm border-0 p-4 text-center">
                    <div className="d-flex flex-column align-items-center">
                      <div className="review-avatar mb-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="rounded-circle"
                        />
                      </div>
                      <h5 className="fw-bold mb-1">{review.name}</h5>
                      <small className="text-muted mb-2">
                        {review.university}
                      </small>
                      <div className="rating-stars mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-warning"
                                : "text-secondary"
                            }
                          />
                        ))}
                      </div>
                      <p className="lead review-comment">"{review.comment}"</p>
                      <small className="text-muted">{review.date}</small>
                    </div>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>

            {/* Custom Carousel Indicators */}
            <div className="carousel-indicators-custom text-center mt-4">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator-dot ${
                    idx === currentSlide ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* CTA cuối trang với Animation */}
        <section className="cta-section bg-primary text-white py-5">
          <Container className="text-center">
            <div data-aos="zoom-in">
              <h2 className="fw-bold mb-3 display-5">
                Bạn đã sẵn sàng tìm phòng trọ lý tưởng?
              </h2>
              <p className="lead mb-4 fs-5">
                Tham gia Trọ UNI ngay hôm nay để trải nghiệm dịch vụ tìm kiếm và
                cho thuê phòng trọ hiện đại, an toàn, tiện lợi!
              </p>
              <div className="cta-buttons">
                <Button
                  as={Link}
                  to="/register"
                  variant="light"
                  size="lg"
                  className="me-3 mb-2 cta-btn"
                  style={{
                    borderRadius: "25px",
                    padding: "15px 40px",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  🚀 Đăng ký miễn phí
                </Button>
                <Button
                  as={Link}
                  to="/post-property"
                  variant="outline-light"
                  size="lg"
                  className="mb-2 cta-btn"
                  style={{
                    borderRadius: "25px",
                    padding: "15px 40px",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  📝 Đăng tin cho thuê
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Advanced Search Modal */}
        <Modal
          show={showSearchModal}
          onHide={() => setShowSearchModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>🔍 Tìm kiếm nâng cao</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trường đại học gần nhất</Form.Label>
                    <Form.Select
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                    >
                      <option value="">Chọn trường đại học</option>
                      {universities.map((uni, index) => (
                        <option key={index} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Khoảng giá (VNĐ/tháng)</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        placeholder="Từ"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value),
                            priceRange[1],
                          ])
                        }
                      />
                      <span className="mx-2">-</span>
                      <Form.Control
                        type="number"
                        placeholder="Đến"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tiện nghi</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Wifi",
                    "Điều hòa",
                    "Tủ lạnh",
                    "Máy giặt",
                    "Bếp",
                    "Ban công",
                    "An ninh 24/7",
                  ].map((amenity, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={amenity}
                      id={`amenity-${index}`}
                      className="amenity-checkbox"
                    />
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowSearchModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSearch}>
              🔍 Tìm kiếm
            </Button>
          </Modal.Footer>
        </Modal>

        <FAQ />

        {/* CSS Styles */}
        <style jsx>{`
          .home-page {
            overflow-x: hidden;
          }

          .hero-section {
            position: relative;
          }

          .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .floating-icon {
            position: absolute;
            font-size: 2rem;
            animation: float 6s ease-in-out infinite;
            opacity: 0.7;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .text-gradient {
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .search-container {
            position: relative;
          }

          .search-input:focus {
            box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
          }

          .hero-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .quick-stats {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
          }

          .stat-item {
            color: white;
          }

          .stat-icon {
            font-size: 2rem;
            margin-bottom: 5px;
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
          }

          .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
          }

          .hero-image:hover {
            transform: perspective(1000px) rotateY(0deg) scale(1.02);
          }

          .section-title {
            position: relative;
            padding-bottom: 15px;
          }

          .section-title::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(45deg, #00ff87, #60efff);
            border-radius: 2px;
          }

          .benefit-card {
            background: rgb(255, 255, 255);
            color: #fff !important;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            border-radius: 15px;
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
          }

          .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }

          .benefit-card .benefit-icon {
            color: #00ff87 !important;
            opacity: 1 !important;
          }

          .benefit-card h5,
          .benefit-card p {
            color: #23272b !important;
            opacity: 1 !important;
            font-weight: 600;
          }

          .property-card {
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
            border: none;
          }

          .property-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }

          .property-image-container {
            position: relative;
            overflow: hidden;
          }

          .property-image {
            height: 220px;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .property-card:hover .property-image {
            transform: scale(1.05);
          }

          .property-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .property-card:hover .property-overlay {
            opacity: 1;
          }

          .discount-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            border-radius: 20px;
          }

          .verified-badge {
            position: absolute;
            bottom: 10px;
            left: 10px;
            border-radius: 20px;
          }

          .price-amount {
            font-size: 1.2rem;
            font-weight: bold;
            color: #00ff87;
          }

          .process-step {
            position: relative;
            padding: 20px;
          }

          .step-number {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 30px;
            background: linear-gradient(45deg, #00ff87, #60efff);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
          }

          .step-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #00ff87, #60efff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            font-size: 1.5rem;
            color: white;
          }

          .reviews-carousel {
            max-width: 800px;
            margin: 0 auto;
          }

          .review-card {
            border-radius: 20px;
            background: white;
          }

          .review-avatar img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border: 3px solid #00ff87;
          }

          .rating-stars {
            font-size: 1.2rem;
          }

          .review-comment {
            font-style: italic;
            color: #666;
          }

          .carousel-indicators-custom {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .indicator-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: #ddd;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .indicator-dot.active {
            background: #00ff87;
            transform: scale(1.2);
          }

          .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }

          .view-all-btn {
            border-radius: 25px;
            padding: 8px 20px;
          }

          .amenity-checkbox {
            margin-right: 15px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .hero-section {
              min-height: 60vh;
            }

            .display-3 {
              font-size: 2rem;
            }

            .quick-stats {
              padding: 15px;
            }

            .stat-icon {
              font-size: 1.5rem;
            }

            .stat-value {
              font-size: 1.2rem;
            }
          }

          body[data-theme="dark"] .benefit-card {
            background: #23272b !important;
            color: #fff !important;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          }

          body[data-theme="dark"] .benefit-card .benefit-icon {
            color: #00ff87 !important; /* hoặc #fff nếu muốn trắng hoàn toàn */
            opacity: 1 !important;
          }

          body[data-theme="dark"] .benefit-card h5,
          body[data-theme="dark"] .benefit-card p {
            color: #fff !important;
            opacity: 1 !important;
            font-weight: 600;
          }

          .benefit-card .benefit-icon i {
            color: #fff !important;
          }
        `}</style>
      </div>
    </>
  );
}

export default Home;
