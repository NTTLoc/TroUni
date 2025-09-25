import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="container py-4">
      <h2 className="mb-4">
        Xin chào, {currentUser?.displayName || currentUser?.name || "User"}!
      </h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Quản lý phòng</Card.Title>
              <Card.Text>Xem, chỉnh sửa, đăng tin phòng trọ của bạn.</Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/account/my-properties")}
              >
                Quản lý phòng
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Quản lý thẻ tín dụng</Card.Title>
              <Card.Text>
                Thêm, xóa, cập nhật thẻ tín dụng để thanh toán tiện lợi.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/account/credit-cards")}
              >
                Quản lý thẻ
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Thông tin tài khoản</Card.Title>
              <Card.Text>
                Xem và cập nhật thông tin cá nhân, đổi mật khẩu, số điện
                thoại...
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/account/profile")}
              >
                Thông tin tài khoản
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
