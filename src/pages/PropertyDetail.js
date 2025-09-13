import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import Reviews from "../components/reviews/Reviews";
import { MOCK_PROPERTIES } from "../components/property/PropertyList";
import { BookAppointmentButton } from "../components/appointment";

function PropertyDetail() {
  const { id } = useParams();
  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return (
      <Container className="py-5">
        <h2>Không tìm thấy phòng trọ!</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">{property.title}</h1>

      {/* Image Gallery */}
      <Row className="mb-4">
        <Col>
          <img
            src={property.images[0]}
            alt={property.title}
            className="img-fluid rounded"
          />
        </Col>
      </Row>
      <Row className="mb-4">
        {property.images.slice(1).map((image, index) => (
          <Col key={index} md={4}>
            <img
              src={image}
              alt={`${property.title} ${index + 2}`}
              className="img-fluid rounded mb-3"
            />
          </Col>
        ))}
      </Row>

      <Row>
        {/* Main Content */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h2 className="text-primary mb-3">
                {property.price.toLocaleString("vi-VN")}đ/tháng
              </h2>
              <p className="lead">{property.description}</p>

              <h4 className="mt-4">Thông tin chi tiết</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>Diện tích: {property.area}</ListGroup.Item>
                <ListGroup.Item>Địa chỉ: {property.address}</ListGroup.Item>
                <ListGroup.Item>Loại phòng: {property.type}</ListGroup.Item>
              </ListGroup>

              <h4 className="mt-4">Tiện nghi</h4>
              <Row>
                {property.amenities.map((amenity, index) => (
                  <Col key={index} md={4}>
                    <p>✓ {amenity}</p>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
          <Reviews propertyId={property.id?.toString() || id} />
        </Col>

        {/* Contact Sidebar */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4>Liên hệ chủ trọ</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Tên:</strong> {property.owner.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Điện thoại:</strong> {property.owner.phone}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {property.owner.email}
                </ListGroup.Item>
              </ListGroup>
              <BookAppointmentButton
                propertyId={property.id}
                propertyOwnerId={property.owner?.id || "owner-" + property.id}
                propertyTitle={property.title}
              />
              <Button variant="primary" className="w-100 mt-2">
                <i className="bi bi-telephone me-2"></i>
                Gọi ngay
              </Button>
              <Button variant="outline-primary" className="w-100 mt-2">
                <i className="bi bi-chat-dots me-2"></i>
                Nhắn tin
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PropertyDetail;
