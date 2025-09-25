import React, { useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Table,
  Badge,
  Modal,
  ProgressBar,
  Alert,
  ListGroup,
} from "react-bootstrap";
import {
  FaCalculator,
  FaCompareArrows,
  FaStar,
  FaHeart,
  FaShare,
  FaDownload,
  FaPrint,
  FaBookmark,
  FaBell,
  FaGift,
  FaTrophy,
  FaMedal,
  FaShieldAlt,
  FaHandshake,
} from "react-icons/fa";

const StudentFeatures = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [budget, setBudget] = useState(3000000);
  const [duration, setDuration] = useState(12);

  // Mock data for comparison
  const comparisonProperties = [
    {
      id: 1,
      title: "Phòng trọ cao cấp Q1",
      price: 2500000,
      deposit: 5000000,
      utilities: 300000,
      location: "Quận 1, TP.HCM",
      rating: 4.8,
      distance: "0.5km",
      amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Máy giặt"],
      pros: ["Gần trường", "An ninh tốt", "Tiện nghi đầy đủ"],
      cons: ["Giá cao", "Đông đúc"],
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Ký túc xá sinh viên",
      price: 1800000,
      deposit: 2000000,
      utilities: 150000,
      location: "Quận Thủ Đức, TP.HCM",
      rating: 4.6,
      distance: "0.2km",
      amenities: ["Wifi", "An ninh 24/7", "Căng tin"],
      pros: ["Giá rẻ", "Gần trường", "Cộng đồng sinh viên"],
      cons: ["Không gian nhỏ", "Ít riêng tư"],
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Căn hộ mini Q7",
      price: 3200000,
      deposit: 6000000,
      utilities: 400000,
      location: "Quận 7, TP.HCM",
      rating: 4.9,
      distance: "1.2km",
      amenities: ["Wifi", "Điều hòa", "Bếp", "Ban công"],
      pros: ["Không gian rộng", "Tiện nghi cao cấp", "Yên tĩnh"],
      cons: ["Xa trường", "Giá cao"],
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const calculateTotalCost = (property) => {
    const monthlyCost = property.price + property.utilities;
    const totalCost = monthlyCost * duration + property.deposit;
    return {
      monthly: monthlyCost,
      total: totalCost,
      deposit: property.deposit,
      utilities: property.utilities,
    };
  };

  const getBudgetStatus = (totalCost) => {
    if (totalCost <= budget) return "success";
    if (totalCost <= budget * 1.2) return "warning";
    return "danger";
  };

  const studentBenefits = [
    {
      icon: <FaGift className="text-warning" />,
      title: "Ưu đãi sinh viên",
      description: "Giảm 10% phí dịch vụ cho sinh viên có thẻ sinh viên hợp lệ",
    },
    {
      icon: <FaTrophy className="text-success" />,
      title: "Chương trình khuyến mãi",
      description: "Miễn phí 1 tháng đầu tiên cho sinh viên mới",
    },
    {
      icon: <FaMedal className="text-primary" />,
      title: "Đánh giá uy tín",
      description: "Hệ thống đánh giá và xác minh chủ trọ uy tín",
    },
    {
      icon: <FaShieldAlt className="text-info" />,
      title: "Bảo hiểm phòng trọ",
      description: "Bảo hiểm tài sản và trách nhiệm dân sự",
    },
  ];

  const studentTools = [
    {
      icon: <FaCalculator />,
      title: "Tính toán chi phí",
      description: "Tính toán tổng chi phí thuê phòng trọ",
      action: () => setShowCalculator(true),
    },
    {
      icon: <FaCompareArrows />,
      title: "So sánh phòng trọ",
      description: "So sánh các phòng trọ để chọn lựa tốt nhất",
      action: () => setShowCompare(true),
    },
    {
      icon: <FaDownload />,
      title: "Tải hợp đồng mẫu",
      description: "Tải về mẫu hợp đồng thuê phòng trọ chuẩn",
    },
    {
      icon: <FaPrint />,
      title: "In danh sách kiểm tra",
      description: "Danh sách kiểm tra khi xem phòng trọ",
    },
  ];

  return (
    <div className="student-features-section">
      <div className="container py-5">
        {/* Student Benefits */}
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            🎓 Tính năng đặc biệt cho sinh viên
          </h2>
          <p className="lead text-muted">
            Trọ UNI được thiết kế đặc biệt để phục vụ nhu cầu của sinh viên
          </p>
        </div>

        <Row className="mb-5">
          {studentBenefits.map((benefit, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="benefit-card h-100 text-center">
                <Card.Body>
                  <div className="benefit-icon mb-3">{benefit.icon}</div>
                  <Card.Title className="fw-bold">{benefit.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {benefit.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Student Tools */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4 text-center">
            🛠️ Công cụ hữu ích cho sinh viên
          </h3>
          <Row>
            {studentTools.map((tool, index) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <Card
                  className="tool-card h-100 text-center"
                  onClick={tool.action}
                  style={{ cursor: tool.action ? "pointer" : "default" }}
                >
                  <Card.Body>
                    <div className="tool-icon mb-3">{tool.icon}</div>
                    <Card.Title className="fw-bold">{tool.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {tool.description}
                    </Card.Text>
                    {tool.action && (
                      <Button variant="outline-primary" size="sm">
                        Sử dụng ngay
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Quick Comparison */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">⚖️ So sánh nhanh phòng trọ</h3>
            <Button
              variant="outline-primary"
              onClick={() => setShowCompare(true)}
            >
              So sánh chi tiết
            </Button>
          </div>
          <Row>
            {comparisonProperties.slice(0, 3).map((property, index) => (
              <Col key={property.id} md={4} className="mb-4">
                <Card className="comparison-card h-100">
                  <Card.Img
                    variant="top"
                    src={property.image}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">
                      {property.title}
                    </Card.Title>
                    <div className="price-info mb-2">
                      <span className="price-amount">
                        {property.price.toLocaleString()}đ/tháng
                      </span>
                    </div>
                    <div className="rating-info mb-2">
                      <FaStar className="text-warning me-1" />
                      <span className="fw-bold">{property.rating}</span>
                      <span className="text-muted ms-1">
                        ({property.distance})
                      </span>
                    </div>
                    <div className="amenities-preview mb-3">
                      {property.amenities.slice(0, 2).map((amenity, idx) => (
                        <Badge
                          key={idx}
                          bg="light"
                          text="dark"
                          className="me-1"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100 mb-2"
                      >
                        <FaHeart /> Yêu thích
                      </Button>
                      <Button variant="primary" size="sm" className="w-100">
                        <FaShare /> Chia sẻ
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Student Community */}
        <div className="student-community">
          <Card className="community-card">
            <Card.Body className="text-center">
              <div className="community-icon mb-3">
                <FaHandshake />
              </div>
              <h3 className="fw-bold mb-3">👥 Cộng đồng sinh viên Trọ UNI</h3>
              <p className="lead mb-4">
                Kết nối với hàng ngàn sinh viên khác, chia sẻ kinh nghiệm và tìm
                bạn cùng phòng
              </p>
              <div className="community-stats mb-4">
                <Row>
                  <Col md={3} className="mb-3">
                    <div className="stat-item">
                      <div className="stat-number">50,000+</div>
                      <div className="stat-label">Sinh viên tham gia</div>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="stat-item">
                      <div className="stat-number">15,000+</div>
                      <div className="stat-label">Phòng trọ đã thuê</div>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="stat-item">
                      <div className="stat-number">25,000+</div>
                      <div className="stat-label">Đánh giá</div>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="stat-item">
                      <div className="stat-number">4.8/5</div>
                      <div className="stat-label">Điểm đánh giá</div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="community-actions">
                <Button variant="primary" size="lg" className="me-3 mb-2">
                  <FaBell /> Tham gia cộng đồng
                </Button>
                <Button variant="outline-primary" size="lg" className="mb-2">
                  <FaBookmark /> Lưu phòng yêu thích
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Cost Calculator Modal */}
        <Modal
          show={showCalculator}
          onHide={() => setShowCalculator(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalculator className="me-2" />
              Tính toán chi phí thuê phòng trọ
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngân sách tối đa (VNĐ/tháng)</Form.Label>
                    <Form.Control
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thời gian thuê (tháng)</Form.Label>
                    <Form.Control
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            <div className="cost-analysis mt-4">
              <h5 className="fw-bold mb-3">Phân tích chi phí</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Phòng trọ</th>
                    <th>Chi phí/tháng</th>
                    <th>Tổng chi phí</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonProperties.map((property) => {
                    const costs = calculateTotalCost(property);
                    const status = getBudgetStatus(costs.total);
                    return (
                      <tr key={property.id}>
                        <td>{property.title}</td>
                        <td>{costs.monthly.toLocaleString()}đ</td>
                        <td>{costs.total.toLocaleString()}đ</td>
                        <td>
                          <Badge bg={status}>
                            {status === "success"
                              ? "Phù hợp"
                              : status === "warning"
                              ? "Cần cân nhắc"
                              : "Vượt ngân sách"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
        </Modal>

        {/* Comparison Modal */}
        <Modal
          show={showCompare}
          onHide={() => setShowCompare(false)}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCompareArrows className="me-2" />
              So sánh chi tiết phòng trọ
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="comparison-table">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Tiêu chí</th>
                    {comparisonProperties.map((property) => (
                      <th key={property.id} className="text-center">
                        <img
                          src={property.image}
                          alt={property.title}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          className="mb-2"
                        />
                        <div className="fw-bold">{property.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Giá thuê/tháng</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="text-center">
                        <span className="price-amount">
                          {property.price.toLocaleString()}đ
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Tiền cọc</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="text-center">
                        {property.deposit.toLocaleString()}đ
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Tiện ích/tháng</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="text-center">
                        {property.utilities.toLocaleString()}đ
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Đánh giá</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="text-center">
                        <FaStar className="text-warning me-1" />
                        {property.rating}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Khoảng cách</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="text-center">
                        {property.distance}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Tiện nghi</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="text-center">
                        {property.amenities.map((amenity, idx) => (
                          <Badge
                            key={idx}
                            bg="light"
                            text="dark"
                            className="me-1 mb-1"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Ưu điểm</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id}>
                        <ListGroup variant="flush">
                          {property.pros.map((pro, idx) => (
                            <ListGroup.Item key={idx} className="border-0 p-1">
                              ✅ {pro}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Nhược điểm</strong>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id}>
                        <ListGroup variant="flush">
                          {property.cons.map((con, idx) => (
                            <ListGroup.Item key={idx} className="border-0 p-1">
                              ❌ {con}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <style jsx>{`
        .student-features-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .benefit-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }

        .benefit-icon {
          font-size: 2.5rem;
        }

        .tool-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: none;
        }

        .tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .tool-icon {
          font-size: 2rem;
          color: #667eea;
        }

        .comparison-card {
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .comparison-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .price-amount {
          font-size: 1.1rem;
          font-weight: bold;
          color: #00ff87;
        }

        .community-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .community-icon {
          font-size: 3rem;
          color: #00ff87;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00ff87;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .cost-analysis {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
        }

        .comparison-table {
          max-height: 500px;
          overflow-y: auto;
        }

        .comparison-table th {
          background: #f8f9fa;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .community-actions {
            flex-direction: column;
          }

          .community-actions .btn {
            margin: 5px 0;
          }

          .comparison-table {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentFeatures;
