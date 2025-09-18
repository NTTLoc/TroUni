import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Badge,
  Container,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUsers,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const MOCK_ROOMMATES = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 24,
    job: "Lập trình viên phần mềm",
    university: "ĐH Bách Khoa TP.HCM",
    budget: "2.5 - 3.5 triệu",
    location: "Quận 1, TP.HCM",
    match: 89,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    habits: ["Sạch sẽ", "Không hút thuốc", "Thích yên tĩnh"],
    interests: ["Đọc sách", "Yoga", "Nấu ăn"],
    description:
      "Tôi là một lập trình viên thích sự gọn gàng và yên tĩnh. Tìm bạn cùng phòng có chung sở thích và lối sống tích cực.",
    gender: "female",
    roomType: "Ở ghép 2 người",
  },
  {
    id: 2,
    name: "Lisa Nguyen",
    age: 25,
    job: "Giáo viên",
    university: "ĐH Sư phạm TP.HCM",
    budget: "2 - 3 triệu",
    location: "Quận 3, TP.HCM",
    match: 77,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    habits: ["Sạch sẽ", "Không thức khuya", "Thân thiện"],
    interests: ["Âm nhạc", "Du lịch", "Phim ảnh"],
    description:
      "Giáo viên trẻ, thân thiện và dễ gần. Mong muốn tìm được bạn cùng phòng để chia sẻ cuộc sống và tiết kiệm chi phí.",
    gender: "female",
    roomType: "Ở ghép 2-3 người",
  },
  {
    id: 3,
    name: "Emma Wilson",
    age: 23,
    job: "Sinh viên đại học",
    university: "ĐH Kinh tế TP.HCM",
    budget: "1.5 - 2.5 triệu",
    location: "Quận Thủ Đức, TP.HCM",
    match: 70,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    habits: ["Học tập chăm chỉ", "Thích giao lưu", "Năng động"],
    interests: ["Thể thao", "Học ngoại ngữ", "Café"],
    description:
      "Sinh viên năm cuối ngành Kinh tế, năng động và thích giao lưu. Tìm bạn cùng phòng để cùng nhau phát triển.",
    gender: "female",
    roomType: "Ký túc xá",
  },
  {
    id: 4,
    name: "David Kim",
    age: 26,
    job: "Kỹ sư phần mềm",
    university: "ĐH Bách Khoa TP.HCM",
    budget: "3 - 4 triệu",
    location: "Quận 7, TP.HCM",
    match: 85,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    habits: ["Sạch sẽ", "Thích công nghệ", "Tập gym"],
    interests: ["Gaming", "Công nghệ", "Thể thao"],
    description:
      "Kỹ sư phần mềm, thích công nghệ và thể thao. Tìm bạn cùng phòng có chung sở thích và lối sống tích cực.",
    gender: "male",
    roomType: "Căn hộ mini",
  },
  {
    id: 5,
    name: "Michael Tran",
    age: 24,
    job: "Nhân viên marketing",
    university: "ĐH Ngoại thương",
    budget: "2.5 - 3.5 triệu",
    location: "Quận 1, TP.HCM",
    match: 82,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    habits: ["Thân thiện", "Thích du lịch", "Sáng tạo"],
    interests: ["Photography", "Du lịch", "Ẩm thực"],
    description:
      "Nhân viên marketing năng động, thích khám phá và sáng tạo. Mong muốn tìm bạn cùng phòng để chia sẻ những trải nghiệm thú vị.",
    gender: "male",
    roomType: "Phòng trọ cao cấp",
  },
  {
    id: 6,
    name: "Alex Johnson",
    age: 22,
    job: "Sinh viên",
    university: "ĐH FPT",
    budget: "1.8 - 2.8 triệu",
    location: "Quận 9, TP.HCM",
    match: 75,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    habits: ["Học tập", "Thích game", "Thân thiện"],
    interests: ["Gaming", "Anime", "Công nghệ"],
    description:
      "Sinh viên IT năm 3, thích công nghệ và gaming. Tìm bạn cùng phòng có chung sở thích để cùng học tập và giải trí.",
    gender: "male",
    roomType: "Ký túc xá",
  },
];

const MOCK_STATS = {
  total: 156,
  avg: 78,
  high: 12,
  saved: 3,
};

function RoommateMatchingPage() {
  const [filters, setFilters] = useState({
    location: "",
    minBudget: "",
    maxBudget: "",
    gender: "all",
    age: "",
    roomType: "",
    university: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [savedRoommates, setSavedRoommates] = useState([]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRoommates = MOCK_ROOMMATES.filter((r) => {
    if (filters.gender && filters.gender !== "all") {
      if (filters.gender !== r.gender) return false;
    }
    if (
      filters.location &&
      !r.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.university &&
      !r.university.toLowerCase().includes(filters.university.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSaveRoommate = (roommateId) => {
    setSavedRoommates((prev) =>
      prev.includes(roommateId)
        ? prev.filter((id) => id !== roommateId)
        : [...prev, roommateId]
    );
  };

  const openDetailModal = (roommate) => {
    setSelectedRoommate(roommate);
    setShowDetailModal(true);
  };

  const getMatchColor = (match) => {
    if (match >= 80) return "success";
    if (match >= 70) return "warning";
    return "secondary";
  };

  return (
    <div className="roommate-matching-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">
                  Tìm bạn cùng trọ{" "}
                  <span className="text-gradient">hoàn hảo</span>
                </h1>
                <p className="lead mb-4">
                  Kết nối với hàng nghìn sinh viên và người trẻ để tìm bạn cùng
                  phòng phù hợp. Chia sẻ chi phí, tạo kỷ niệm đẹp!
                </p>
                <div className="hero-stats">
                  <Row>
                    <Col xs={6} md={3}>
                      <div className="stat-item">
                        <div className="stat-number">{MOCK_STATS.total}</div>
                        <div className="stat-label">Thành viên</div>
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="stat-item">
                        <div className="stat-number">{MOCK_STATS.avg}%</div>
                        <div className="stat-label">Tương thích TB</div>
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="stat-item">
                        <div className="stat-number">{MOCK_STATS.high}</div>
                        <div className="stat-label">Ghép cặp thành công</div>
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="stat-item">
                        <div className="stat-number">{MOCK_STATS.saved}</div>
                        <div className="stat-label">Đã lưu</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                  alt="Roommate matching"
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-5">
        {/* Search and Filter Bar */}
        <Card className="search-filter-card mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={8}>
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Tìm theo tên, trường học, khu vực..."
                    className="search-input"
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                  />
                </div>
              </Col>
              <Col md={4} className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter-btn"
                >
                  <FaFilter className="me-2" />
                  Bộ lọc
                </Button>
              </Col>
            </Row>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="advanced-filters mt-4 pt-4 border-top">
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Giới tính</Form.Label>
                      <Form.Select
                        value={filters.gender}
                        onChange={(e) =>
                          handleFilterChange("gender", e.target.value)
                        }
                      >
                        <option value="all">Tất cả</option>
                        <option value="female">Nữ</option>
                        <option value="male">Nam</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngân sách (triệu VNĐ)</Form.Label>
                      <Row>
                        <Col>
                          <Form.Control
                            type="number"
                            placeholder="Từ"
                            value={filters.minBudget}
                            onChange={(e) =>
                              handleFilterChange("minBudget", e.target.value)
                            }
                          />
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            placeholder="Đến"
                            value={filters.maxBudget}
                            onChange={(e) =>
                              handleFilterChange("maxBudget", e.target.value)
                            }
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Trường học</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Tên trường"
                        value={filters.university}
                        onChange={(e) =>
                          handleFilterChange("university", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Loại phòng</Form.Label>
                      <Form.Select
                        value={filters.roomType}
                        onChange={(e) =>
                          handleFilterChange("roomType", e.target.value)
                        }
                      >
                        <option value="">Tất cả</option>
                        <option value="Ở ghép">Ở ghép</option>
                        <option value="Ký túc xá">Ký túc xá</option>
                        <option value="Căn hộ">Căn hộ</option>
                        <option value="Phòng trọ">Phòng trọ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Results */}
        <div className="results-header mb-4">
          <h3>Tìm thấy {filteredRoommates.length} bạn cùng trọ phù hợp</h3>
          <p className="text-muted">Được sắp xếp theo độ tương thích</p>
        </div>

        <Row>
          {filteredRoommates.map((roommate) => (
            <Col key={roommate.id} lg={4} md={6} className="mb-4">
              <Card className="roommate-card h-100">
                <Card.Body>
                  {/* Header */}
                  <div className="roommate-header">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-container me-3">
                        <img
                          src={roommate.avatar}
                          alt={roommate.name}
                          className="avatar"
                        />
                        {roommate.verified && (
                          <div className="verified-badge">
                            <i className="bi bi-patch-check-fill"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{roommate.name}</h5>
                        <div className="text-muted small">
                          <FaGraduationCap className="me-1" />
                          {roommate.age} tuổi • {roommate.job}
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="save-btn p-0"
                        onClick={() => handleSaveRoommate(roommate.id)}
                      >
                        <FaHeart
                          className={
                            savedRoommates.includes(roommate.id)
                              ? "text-danger"
                              : "text-muted"
                          }
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="match-score mb-3">
                    <Badge
                      bg={getMatchColor(roommate.match)}
                      className="match-badge"
                    >
                      {roommate.match}% Phù hợp
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="roommate-info mb-3">
                    <div className="info-item">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      <span>{roommate.location}</span>
                    </div>
                    <div className="info-item">
                      <FaGraduationCap className="text-primary me-2" />
                      <span>{roommate.university}</span>
                    </div>
                    <div className="info-item">
                      <FaUsers className="text-primary me-2" />
                      <span>{roommate.roomType}</span>
                    </div>
                    <div className="info-item">
                      <i className="bi bi-cash text-primary me-2"></i>
                      <span>{roommate.budget}</span>
                    </div>
                  </div>

                  {/* Habits */}
                  <div className="habits mb-3">
                    {roommate.habits.slice(0, 2).map((habit, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="me-1 mb-1"
                      >
                        {habit}
                      </Badge>
                    ))}
                    {roommate.habits.length > 2 && (
                      <Badge bg="light" text="dark" className="mb-1">
                        +{roommate.habits.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="description text-muted small">
                    {roommate.description.length > 100
                      ? `${roommate.description.substring(0, 100)}...`
                      : roommate.description}
                  </p>

                  {/* Actions */}
                  <div className="actions mt-auto">
                    <Button
                      variant="primary"
                      className="w-100 mb-2"
                      onClick={() => openDetailModal(roommate)}
                    >
                      Xem chi tiết
                    </Button>
                    <Row>
                      <Col>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="w-100"
                        >
                          <i className="bi bi-chat-dots me-1"></i>
                          Nhắn tin
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="w-100"
                        >
                          <i className="bi bi-person-plus me-1"></i>
                          Kết bạn
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredRoommates.length === 0 && (
          <div className="text-center py-5">
            <div className="empty-state">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h4>Không tìm thấy bạn cùng trọ phù hợp</h4>
              <p className="text-muted">
                Thử điều chỉnh bộ lọc để tìm thêm kết quả
              </p>
              <Button
                variant="primary"
                onClick={() =>
                  setFilters({
                    location: "",
                    minBudget: "",
                    maxBudget: "",
                    gender: "all",
                    age: "",
                    roomType: "",
                    university: "",
                  })
                }
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
      >
        {selectedRoommate && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="d-flex align-items-center">
                  <img
                    src={selectedRoommate.avatar}
                    alt={selectedRoommate.name}
                    className="rounded-circle me-3"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                  <div>
                    <h5 className="mb-0">{selectedRoommate.name}</h5>
                    <small className="text-muted">{selectedRoommate.job}</small>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <h6>Thông tin cơ bản</h6>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Tuổi:</strong> {selectedRoommate.age}
                    </li>
                    <li>
                      <strong>Nghề nghiệp:</strong> {selectedRoommate.job}
                    </li>
                    <li>
                      <strong>Trường học:</strong> {selectedRoommate.university}
                    </li>
                    <li>
                      <strong>Khu vực:</strong> {selectedRoommate.location}
                    </li>
                    <li>
                      <strong>Ngân sách:</strong> {selectedRoommate.budget}
                    </li>
                    <li>
                      <strong>Loại phòng:</strong> {selectedRoommate.roomType}
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Thói quen sinh hoạt</h6>
                  <div className="mb-3">
                    {selectedRoommate.habits.map((habit, index) => (
                      <Badge key={index} bg="primary" className="me-1 mb-1">
                        {habit}
                      </Badge>
                    ))}
                  </div>

                  <h6>Sở thích</h6>
                  <div className="mb-3">
                    {selectedRoommate.interests.map((interest, index) => (
                      <Badge key={index} bg="info" className="me-1 mb-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </Col>
              </Row>

              <div className="mt-3">
                <h6>Giới thiệu bản thân</h6>
                <p>{selectedRoommate.description}</p>
              </div>

              <Alert variant="success">
                <div className="d-flex align-items-center">
                  <i className="bi bi-heart-fill text-danger me-2"></i>
                  <strong>Độ tương thích: {selectedRoommate.match}%</strong>
                </div>
                <small>
                  Dựa trên sở thích, thói quen và yêu cầu về phòng ở
                </small>
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </Button>
              <Button variant="outline-primary">
                <i className="bi bi-person-plus me-1"></i>
                Kết bạn
              </Button>
              <Button variant="primary">
                <i className="bi bi-chat-dots me-1"></i>
                Nhắn tin
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <style jsx>{`
        .roommate-matching-page {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
        }

        .text-gradient {
          background: linear-gradient(45deg, #00ff87, #60efff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-stats {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          margin-top: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #00ff87;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .search-filter-card {
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
        }

        .search-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          z-index: 2;
        }

        .search-input {
          padding-left: 45px;
          border-radius: 25px;
          border: 2px solid #e5e7eb;
          font-size: 1rem;
          height: 50px;
        }

        .search-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .filter-btn {
          border-radius: 25px;
          padding: 12px 24px;
          font-weight: 600;
        }

        .advanced-filters {
          background: #f8fafc;
          border-radius: 15px;
          padding: 20px;
        }

        .results-header h3 {
          color: #1e293b;
          font-weight: 700;
        }

        .roommate-card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .roommate-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e5e7eb;
        }

        .verified-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #10b981;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        }

        .save-btn {
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .save-btn:hover {
          transform: scale(1.1);
        }

        .match-badge {
          font-size: 0.9rem;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .habits .badge {
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 15px;
        }

        .description {
          line-height: 1.5;
        }

        .actions {
          margin-top: 20px;
        }

        .empty-state {
          padding: 60px 20px;
        }

        .empty-state i {
          opacity: 0.3;
        }

        /* Dark mode support */
        body[data-theme="dark"] .roommate-matching-page {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }

        body[data-theme="dark"] .hero-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }

        body[data-theme="dark"] .search-filter-card {
          background: #23272b;
          color: #f1f1f1;
        }

        body[data-theme="dark"] .roommate-card {
          background: #23272b;
          color: #f1f1f1;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        body[data-theme="dark"] .advanced-filters {
          background: #1a1a1a;
        }

        body[data-theme="dark"] .search-input {
          background: #23272b;
          border-color: #444;
          color: #f1f1f1;
        }

        body[data-theme="dark"] .search-input:focus {
          border-color: #00ff87;
          box-shadow: 0 0 0 0.2rem rgba(0, 255, 135, 0.25);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 0;
          }

          .hero-stats {
            padding: 20px;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .search-input {
            height: 45px;
            font-size: 0.9rem;
          }

          .filter-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .roommate-card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default RoommateMatchingPage;
