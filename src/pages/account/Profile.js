import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Modal } from "react-bootstrap";
export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.displayName || currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: "",
    bio: "",
    email: currentUser?.email || "",
    cccd: "",
    tax: "",
    favorite: "",
    gender: "",
    dob: "",
    province: currentUser?.province || "",
    district: currentUser?.district || "",
    ward: currentUser?.ward || "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showPwdModal, setShowPwdModal] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: currentUser?.displayName || currentUser?.name || "",
      phone: currentUser?.phone || "",
      email: currentUser?.email || "",
      province: currentUser?.province || "",
      district: currentUser?.district || "",
      ward: currentUser?.ward || "",
    }));
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    setAlert({ type: "success", message: "Lưu thay đổi thành công (demo)!" });
  };

  return (
    <div>
      {alert.message && (
        <Alert variant={alert.type} onClose={() => setAlert({})} dismissible>
          {alert.message}
        </Alert>
      )}
      <h4 className="mb-4">Hồ sơ cá nhân</h4>
      <Form onSubmit={handleSave}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Thêm số điện thoại</Form.Label>
              <Form.Control
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                name="address"
                value={
                  form.address ||
                  [form.ward, form.district, form.province]
                    .filter(Boolean)
                    .join(", ")
                }
                onChange={handleChange}
                placeholder="Nhập địa chỉ chi tiết (số nhà, đường, ...), các trường tỉnh/thành, quận/huyện, phường/xã sẽ tự động điền nếu đã đăng ký."
              />
              {!form.address &&
                (form.province || form.district || form.ward) && (
                  <div className="text-muted mt-1" style={{ fontSize: 14 }}>
                    {["Phường/xã", "Quận/huyện", "Tỉnh/thành"]
                      .map((label, idx) => {
                        const val = [form.ward, form.district, form.province][
                          idx
                        ];
                        return val ? `${label}: ${val}` : null;
                      })
                      .filter(Boolean)
                      .join(" | ")}
                  </div>
                )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Giới thiệu</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="bio"
                value={form.bio}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <h5 className="mt-4 mb-3">Thông tin bảo mật</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={form.email} disabled readOnly />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>CCCD / CMND / Hộ chiếu</Form.Label>
              <Form.Control
                name="cccd"
                value={form.cccd}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Mã số thuế</Form.Label>
              <Form.Control
                name="tax"
                value={form.tax}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Danh mục yêu thích</Form.Label>
              <Form.Control
                name="favorite"
                value={form.favorite}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ngày, tháng, năm sinh</Form.Label>
              <Form.Control
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex gap-2 mt-4">
          <Button type="submit" variant="primary">
            Lưu thay đổi
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setShowPwdModal(true)}
          >
            Đổi mật khẩu
          </Button>
          {/* Modal đổi mật khẩu */}
          <Modal
            show={showPwdModal}
            onHide={() => setShowPwdModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Đổi mật khẩu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu cũ</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  Đổi mật khẩu
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </Form>
    </div>
  );
}
