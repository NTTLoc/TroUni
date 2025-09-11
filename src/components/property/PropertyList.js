import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";

const MOCK_PROPERTIES = [
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
    type: "phong-tro",
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

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: "all",
    type: "all",
    city: "all",
  });

  useEffect(() => {
    setProperties(MOCK_PROPERTIES);
    setLoading(false);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (property.price < min || property.price > max) return false;
    }
    if (filters.type !== "all" && property.type !== filters.type) return false;
    if (filters.city !== "all" && property.city !== filters.city) return false;
    return true;
  });
  console.log("Filtered Properties:", filters);
  const getPriceBadgeColor = (price) => {
    if (price < 2000000) return "success";
    if (price < 4000000) return "info";
    if (price < 6000000) return "warning";
    return "danger";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Danh Sách Phòng Trọ</h2>
      <Row className="g-4">
        {MOCK_PROPERTIES.map((property) => (
          <Col key={property.id} xs={12} md={6} lg={4}>
            <Card className="h-100 property-card">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={property.images[0]}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Badge
                  bg={getPriceBadgeColor(property.price)}
                  className="position-absolute top-0 end-0 m-2"
                >
                  {formatPrice(property.price)}
                </Badge>
              </div>
              <Card.Body>
                <Card.Title className="text-truncate">
                  {property.title}
                </Card.Title>
                <Card.Text className="text-muted mb-2">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {property.address}
                </Card.Text>
                <div className="d-flex gap-2 mb-3">
                  <Badge bg="light" text="dark">
                    <i className="bi bi-rulers me-1"></i>
                    {property.area}m²
                  </Badge>
                  <Badge bg="light" text="dark">
                    <i className="bi bi-people-fill me-1"></i>
                    {property.maxOccupants} người
                  </Badge>
                </div>
                <div className="amenities mb-3">
                  {property.amenities?.map((amenity, index) => (
                    <Badge key={index} bg="info" className="me-1 mb-1">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button
                  as={Link}
                  to={`/properties/${property.id}`}
                  variant="primary"
                  className="w-100"
                >
                  Xem Chi Tiết
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <style>{`
        .property-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }
        .property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        .amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .badge {
          font-weight: 500;
          padding: 0.5em 0.8em;
        }
      `}</style>
    </Container>
  );
}

export default PropertyList;

export { MOCK_PROPERTIES };
