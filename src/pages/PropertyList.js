import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function PropertyList() {
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: "all",
    location: "",
  });

  const properties = [
    {
      id: "1",
      title: "Phòng trọ cao cấp",
      price: 2500000,
      address: "Quận 1, TP.HCM",
      area: 25,
      maxOccupants: 2,
      type: "phong-tro",
      city: "hcm",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Wifi", "Máy lạnh", "Gác lửng", "WC riêng"],
      description: "Phòng trọ cao cấp, đầy đủ tiện nghi, gần trung tâm",
      owner: {
        name: "Nguyễn Văn A",
        phone: "0123456789",
        email: "nguyenvana@example.com",
      },
    },
    {
      id: "2",
      title: "Ký túc xá sinh viên",
      price: 1800000,
      address: "Quận Thủ Đức, TP.HCM",
      area: 18,
      maxOccupants: 4,
      type: "ky-tuc-xa",
      city: "hcm",
      images: [
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Wifi miễn phí", "An ninh 24/7", "Giường tầng"],
      description: "Ký túc xá sinh viên, an ninh 24/7, wifi miễn phí",
      owner: {
        name: "Trần Thị B",
        phone: "0987654321",
        email: "tranthib@example.com",
      },
    },
    {
      id: "3",
      title: "Nhà nguyên căn",
      price: 8000000,
      address: "Quận 7, TP.HCM",
      area: 60,
      maxOccupants: 6,
      type: "nha-nguyen-can",
      city: "hcm",
      images: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["2 phòng ngủ", "Nội thất đầy đủ", "Bếp riêng"],
      description: "Nhà nguyên căn 2 phòng ngủ, đầy đủ nội thất",
      owner: {
        name: "Lê Văn C",
        phone: "0911222333",
        email: "levanc@example.com",
      },
    },
    {
      id: "4",
      title: "Căn hộ mini view đẹp",
      price: 4500000,
      address: "Quận Bình Thạnh, TP.HCM",
      area: 30,
      maxOccupants: 2,
      type: "can-ho",
      city: "hcm",
      images: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Ban công", "Thang máy", "Máy giặt"],
      description: "Căn hộ mini, view đẹp, có ban công, thang máy",
      owner: {
        name: "Phạm Thị D",
        phone: "0933444555",
        email: "phamthid@example.com",
      },
    },
    {
      id: "5",
      title: "Phòng trọ giá rẻ",
      price: 1200000,
      address: "Quận 12, TP.HCM",
      area: 15,
      maxOccupants: 1,
      type: "phong-tro",
      city: "hcm",
      images: [
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Wifi", "WC chung"],
      description: "Phòng trọ giá rẻ, phù hợp sinh viên",
      owner: {
        name: "Ngô Văn E",
        phone: "0977666888",
        email: "ngovane@example.com",
      },
    },
    {
      id: "6",
      title: "Căn hộ studio Hà Nội",
      price: 6000000,
      address: "Quận Cầu Giấy, Hà Nội",
      area: 35,
      maxOccupants: 2,
      type: "can-ho",
      city: "hanoi",
      images: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Thang máy", "Bảo vệ 24/7", "Máy lạnh"],
      description: "Căn hộ studio, đầy đủ tiện nghi, trung tâm Hà Nội",
      owner: {
        name: "Đỗ Thị F",
        phone: "0966555444",
        email: "dothif@example.com",
      },
    },
    {
      id: "7",
      title: "Phòng trọ Đà Nẵng",
      price: 2000000,
      address: "Quận Hải Châu, Đà Nẵng",
      area: 20,
      maxOccupants: 2,
      type: "phong-tro",
      city: "danang",
      images: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Wifi", "Gần biển"],
      description: "Phòng trọ gần biển, thoáng mát, an ninh",
      owner: {
        name: "Trịnh Văn G",
        phone: "0955444333",
        email: "trinhvang@example.com",
      },
    },
    {
      id: "8",
      title: "Nhà nguyên căn Hà Nội",
      price: 12000000,
      address: "Quận Ba Đình, Hà Nội",
      area: 80,
      maxOccupants: 8,
      type: "nha-nguyen-can",
      city: "hanoi",
      images: [
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["3 phòng ngủ", "Sân vườn", "Chỗ để xe"],
      description: "Nhà nguyên căn rộng rãi, có sân vườn, trung tâm Hà Nội",
      owner: {
        name: "Bùi Thị H",
        phone: "0944333222",
        email: "buithih@example.com",
      },
    },
    {
      id: "9",
      title: "Căn hộ cao cấp Đà Nẵng",
      price: 9000000,
      address: "Quận Sơn Trà, Đà Nẵng",
      area: 50,
      maxOccupants: 4,
      type: "can-ho",
      city: "danang",
      images: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Hồ bơi", "Gym", "Bảo vệ 24/7"],
      description: "Căn hộ cao cấp, view biển, đầy đủ tiện nghi",
      owner: {
        name: "Phan Văn I",
        phone: "0933222111",
        email: "phanvani@example.com",
      },
    },
    {
      id: "10",
      title: "Phòng trọ tiện nghi Hà Nội",
      price: 3500000,
      address: "Quận Đống Đa, Hà Nội",
      area: 22,
      maxOccupants: 2,
      type: "phong-tro",
      city: "hanoi",
      images: [
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      ],
      amenities: ["Wifi", "Máy lạnh", "WC riêng"],
      description: "Phòng trọ tiện nghi, trung tâm Hà Nội",
      owner: {
        name: "Vũ Thị K",
        phone: "0922111000",
        email: "vuthik@example.com",
      },
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    if (filters.type !== "all" && property.type !== filters.type) return false;
    if (
      filters.location &&
      !property.address.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (property.price < min || property.price > max) return false;
    }
    return true;
  });

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
        <Container style={{ zIndex: 2 }}>
          <Row className="align-items-center">
            <Col md={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold mb-3">Danh sách phòng trọ</h1>
              <p className="lead mb-4">
                Khám phá hàng trăm phòng trọ, căn hộ, ký túc xá chất lượng, giá
                tốt trên toàn quốc.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filters */}
      <Container className="py-4">
        <Card className="shadow-sm border-0 mb-4 p-3">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Loại phòng</Form.Label>
                <Form.Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="phong-tro">Phòng trọ</option>
                  <option value="ky-tuc-xa">Ký túc xá</option>
                  <option value="nha-nguyen-can">Nhà nguyên căn</option>
                  <option value="can-ho">Căn hộ</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Khoảng giá</Form.Label>
                <Form.Select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="0-2000000">Dưới 2 triệu</option>
                  <option value="2000000-5000000">2 - 5 triệu</option>
                  <option value="5000000-10000000">5 - 10 triệu</option>
                  <option value="10000000-99999999">Trên 10 triệu</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Khu vực</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Nhập quận, thành phố..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Card>

        {/* Danh sách phòng */}
        <Row>
          {filteredProperties.length === 0 ? (
            <Col>
              <div className="text-center py-5">
                <h4>Không tìm thấy phòng phù hợp.</h4>
              </div>
            </Col>
          ) : (
            filteredProperties.map((property) => (
              <Col key={property.id} md={4} className="mb-4">
                <Card className="shadow-lg h-100 border-0 property-card-hover">
                  <Card.Img
                    variant="top"
                    src={property.images[0]}
                    style={{ height: 220, objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{property.title}</Card.Title>
                    <Card.Text>
                      <strong>
                        {property.price.toLocaleString("vi-VN")}đ/tháng
                      </strong>
                      <br />
                      {property.address}
                      <br />
                      {property.description}
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/property/${property.id}`}
                      variant="primary"
                    >
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}

export default PropertyList;
