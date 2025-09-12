import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Modal, ListGroup } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaWhatsapp,
  FaDirections,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const InteractiveMap = () => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapView, setMapView] = useState("list"); // 'list' or 'map'

  // Mock data for properties near universities
  const propertiesNearUniversities = [
    {
      id: 1,
      title: "Phòng trọ cao cấp gần ĐH Bách Khoa",
      price: "2.500.000đ/tháng",
      location: "Quận 1, TP.HCM",
      coordinates: { lat: 10.7769, lng: 106.7009 },
      university: "ĐH Bách Khoa TP.HCM",
      distance: "0.5km",
      rating: 4.8,
      reviews: 127,
      amenities: ["Wifi", "Điều hòa", "Tủ lạnh"],
      verified: true,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      description:
        "Phòng trọ cao cấp, đầy đủ tiện nghi, gần trung tâm và trường đại học",
    },
    {
      id: 2,
      title: "Ký túc xá sinh viên ĐH Quốc Gia",
      price: "1.800.000đ/tháng",
      location: "Quận Thủ Đức, TP.HCM",
      coordinates: { lat: 10.7629, lng: 106.6602 },
      university: "ĐH Quốc Gia TP.HCM",
      distance: "0.2km",
      rating: 4.6,
      reviews: 89,
      amenities: ["Wifi", "An ninh 24/7", "Căng tin"],
      verified: true,
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      description:
        "Ký túc xá sinh viên, an ninh 24/7, wifi miễn phí, gần trường",
    },
    {
      id: 3,
      title: "Căn hộ gần ĐH FPT",
      price: "3.200.000đ/tháng",
      location: "Quận 7, TP.HCM",
      coordinates: { lat: 10.7329, lng: 106.7292 },
      university: "ĐH FPT",
      distance: "0.8km",
      rating: 4.9,
      reviews: 203,
      amenities: ["Wifi", "Điều hòa", "Bếp", "Ban công"],
      verified: true,
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      description: "Căn hộ hiện đại, đầy đủ tiện nghi, view đẹp",
    },
    {
      id: 4,
      title: "Phòng trọ gần ĐH Kinh tế",
      price: "2.100.000đ/tháng",
      location: "Quận 3, TP.HCM",
      coordinates: { lat: 10.7829, lng: 106.6892 },
      university: "ĐH Kinh tế TP.HCM",
      distance: "0.3km",
      rating: 4.7,
      reviews: 156,
      amenities: ["Wifi", "Điều hòa", "Máy giặt"],
      verified: false,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
      description: "Phòng trọ sạch sẽ, giá rẻ, phù hợp sinh viên",
    },
  ];

  const universities = [
    {
      name: "ĐH Bách Khoa TP.HCM",
      coordinates: { lat: 10.7769, lng: 106.7009 },
      students: "45,000+",
      color: "#00ff87",
    },
    {
      name: "ĐH Quốc Gia TP.HCM",
      coordinates: { lat: 10.7629, lng: 106.6602 },
      students: "60,000+",
      color: "#60efff",
    },
    {
      name: "ĐH FPT",
      coordinates: { lat: 10.7329, lng: 106.7292 },
      students: "15,000+",
      color: "#ff6b6b",
    },
    {
      name: "ĐH Kinh tế TP.HCM",
      coordinates: { lat: 10.7829, lng: 106.6892 },
      students: "35,000+",
      color: "#4ecdc4",
    },
  ];

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowMapModal(true);
  };

  const getDistanceColor = (distance) => {
    const dist = parseFloat(distance);
    if (dist <= 0.5) return "success";
    if (dist <= 1.0) return "warning";
    return "secondary";
  };

  return (
    <div className="interactive-map-section">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            🗺️ Tìm phòng trọ gần trường đại học
          </h2>
          <p className="lead text-muted">
            Khám phá các phòng trọ, ký túc xá gần trường đại học của bạn
          </p>
        </div>

        {/* View Toggle */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <Button
              variant={mapView === "list" ? "primary" : "outline-primary"}
              onClick={() => setMapView("list")}
              className="px-4"
            >
              📋 Danh sách
            </Button>
            <Button
              variant={mapView === "map" ? "primary" : "outline-primary"}
              onClick={() => setMapView("map")}
              className="px-4"
            >
              🗺️ Bản đồ
            </Button>
          </div>
        </div>

        {mapView === "list" ? (
          <div className="row">
            {propertiesNearUniversities.map((property, index) => (
              <div key={property.id} className="col-lg-6 col-xl-3 mb-4">
                <Card
                  className="property-map-card h-100 shadow-sm"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="property-image-container">
                    <Card.Img
                      variant="top"
                      src={property.image}
                      className="property-image"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                    <div className="property-overlay">
                      {property.verified && (
                        <Badge bg="success" className="verified-badge">
                          <MdVerified /> Đã xác minh
                        </Badge>
                      )}
                      <Badge
                        bg={getDistanceColor(property.distance)}
                        className="distance-badge"
                      >
                        📍 {property.distance}
                      </Badge>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <h6 className="fw-bold mb-1">{property.title}</h6>
                      <small className="text-primary fw-bold">
                        🎓 {property.university}
                      </small>
                    </div>

                    <div className="price-section mb-2">
                      <span className="price-amount">{property.price}</span>
                    </div>

                    <div className="rating-section mb-2">
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <span className="fw-bold me-1">{property.rating}</span>
                        <span className="text-muted small">
                          ({property.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="amenities-section mb-3">
                      {property.amenities.slice(0, 2).map((amenity, idx) => (
                        <Badge
                          key={idx}
                          bg="light"
                          text="dark"
                          className="me-1 small"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 2 && (
                        <Badge bg="light" text="dark" className="small">
                          +{property.amenities.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100 mb-2"
                      >
                        <FaMapMarkerAlt /> Xem chi tiết
                      </Button>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="flex-fill"
                        >
                          <FaPhone />
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="flex-fill"
                        >
                          <FaWhatsapp />
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="flex-fill"
                        >
                          <FaDirections />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-content">
                <div className="universities-overview mb-4">
                  <h5 className="fw-bold mb-3">🎓 Các trường đại học chính</h5>
                  <div className="row">
                    {universities.map((uni, index) => (
                      <div key={index} className="col-md-3 col-6 mb-3">
                        <div
                          className="university-marker"
                          style={{ borderColor: uni.color }}
                        >
                          <div
                            className="marker-dot"
                            style={{ backgroundColor: uni.color }}
                          ></div>
                          <div className="university-info">
                            <h6 className="fw-bold mb-1">{uni.name}</h6>
                            <small className="text-muted">
                              {uni.students} sinh viên
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="map-visualization">
                  <div className="map-area">
                    <div className="map-grid">
                      {propertiesNearUniversities.map((property, index) => (
                        <div
                          key={property.id}
                          className="property-marker"
                          style={{
                            left: `${20 + (index % 4) * 20}%`,
                            top: `${30 + Math.floor(index / 4) * 20}%`,
                          }}
                          onClick={() => handlePropertyClick(property)}
                        >
                          <div className="marker-pulse"></div>
                          <div className="marker-content">
                            <div className="marker-price">{property.price}</div>
                            <div className="marker-distance">
                              {property.distance}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="map-legend mt-4">
                  <div className="legend-item">
                    <div className="legend-dot legend-university"></div>
                    <span>Trường đại học</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot legend-property"></div>
                    <span>Phòng trọ</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot legend-verified"></div>
                    <span>Đã xác minh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Property Detail Modal */}
        <Modal
          show={showMapModal}
          onHide={() => setShowMapModal(false)}
          size="lg"
          centered
        >
          {selectedProperty && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>
                  <FaMapMarkerAlt className="text-primary me-2" />
                  {selectedProperty.title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src={selectedProperty.image}
                      alt={selectedProperty.title}
                      className="img-fluid rounded"
                      style={{ width: "100%", height: 250, objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-bold mb-2">{selectedProperty.title}</h5>
                    <p className="text-muted mb-3">
                      {selectedProperty.description}
                    </p>

                    <div className="property-details">
                      <div className="detail-item mb-2">
                        <strong>🎓 Trường gần nhất:</strong>{" "}
                        {selectedProperty.university}
                      </div>
                      <div className="detail-item mb-2">
                        <strong>📍 Khoảng cách:</strong>
                        <Badge
                          bg={getDistanceColor(selectedProperty.distance)}
                          className="ms-2"
                        >
                          {selectedProperty.distance}
                        </Badge>
                      </div>
                      <div className="detail-item mb-2">
                        <strong>💰 Giá:</strong> {selectedProperty.price}
                      </div>
                      <div className="detail-item mb-3">
                        <strong>⭐ Đánh giá:</strong> {selectedProperty.rating}
                        /5 ({selectedProperty.reviews} đánh giá)
                      </div>
                    </div>

                    <div className="amenities-list mb-3">
                      <strong>🏠 Tiện nghi:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {selectedProperty.amenities.map((amenity, idx) => (
                          <Badge key={idx} bg="light" text="dark">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowMapModal(false)}
                >
                  Đóng
                </Button>
                <Button variant="outline-primary">
                  <FaDirections /> Chỉ đường
                </Button>
                <Button variant="outline-success">
                  <FaPhone /> Gọi ngay
                </Button>
                <Button variant="primary">
                  <FaWhatsapp /> Chat với chủ trọ
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </div>

      <style jsx>{`
        .interactive-map-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .property-map-card {
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }

        .property-map-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .property-image-container {
          position: relative;
          overflow: hidden;
        }

        .property-image {
          transition: transform 0.3s ease;
        }

        .property-map-card:hover .property-image {
          transform: scale(1.05);
        }

        .property-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .verified-badge {
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .distance-badge {
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .price-amount {
          font-size: 1.1rem;
          font-weight: bold;
          color: #00ff87;
        }

        .map-container {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .map-placeholder {
          min-height: 500px;
          background: linear-gradient(45deg, #e3f2fd, #f3e5f5);
          border-radius: 15px;
          padding: 20px;
          position: relative;
        }

        .universities-overview {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .university-marker {
          display: flex;
          align-items: center;
          padding: 10px;
          border: 2px solid;
          border-radius: 10px;
          background: white;
          transition: all 0.3s ease;
        }

        .university-marker:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .marker-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .university-info h6 {
          font-size: 0.9rem;
          margin: 0;
        }

        .map-visualization {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .map-area {
          height: 300px;
          background: linear-gradient(45deg, #e8f5e8, #f0f8ff);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }

        .map-grid {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .property-marker {
          position: absolute;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .property-marker:hover {
          transform: scale(1.2);
        }

        .marker-pulse {
          width: 20px;
          height: 20px;
          background: #ff6b6b;
          border-radius: 50%;
          position: relative;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
          }
        }

        .marker-content {
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 5px 8px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          font-size: 0.8rem;
        }

        .marker-price {
          font-weight: bold;
          color: #00ff87;
        }

        .marker-distance {
          color: #666;
          font-size: 0.7rem;
        }

        .map-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-university {
          background: #00ff87;
        }

        .legend-property {
          background: #ff6b6b;
        }

        .legend-verified {
          background: #28a745;
        }

        .property-details .detail-item {
          font-size: 0.9rem;
        }

        .amenities-list {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .map-container {
            padding: 15px;
          }

          .universities-overview {
            padding: 15px;
          }

          .university-info h6 {
            font-size: 0.8rem;
          }

          .map-legend {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
