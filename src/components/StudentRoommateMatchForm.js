import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";

function StudentRoommateMatchForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    university: "",
    major: "",
    budget: "",
    location: "",
    habits: [],
    about: "",
    special: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const habits = prev.habits.includes(value)
          ? prev.habits.filter((h) => h !== value)
          : [...prev.habits, value];
        return { ...prev, habits };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !formData.name ||
      !formData.gender ||
      !formData.age ||
      !formData.budget ||
      !formData.location
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Thông tin đã được gửi! (Demo)");
    // TODO: Gửi dữ liệu lên backend để xử lý matching
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>
              <h2 className="text-center mb-4">Tìm bạn cùng trọ phù hợp</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Năm sinh</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Trường học</Form.Label>
                  <Form.Control
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ngành học</Form.Label>
                  <Form.Control
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ngân sách mong muốn (VNĐ/tháng)</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Khu vực mong muốn</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Thói quen sinh hoạt</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    <Form.Check
                      type="checkbox"
                      label="Thức khuya"
                      name="habits"
                      value="night"
                      checked={formData.habits.includes("night")}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Hút thuốc"
                      name="habits"
                      value="smoke"
                      checked={formData.habits.includes("smoke")}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Nuôi thú cưng"
                      name="habits"
                      value="pet"
                      checked={formData.habits.includes("pet")}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Gọn gàng/sạch sẽ"
                      name="habits"
                      value="clean"
                      checked={formData.habits.includes("clean")}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sở thích cá nhân</Form.Label>
                  <Form.Control
                    type="text"
                    name="special"
                    value={formData.special}
                    onChange={handleChange}
                    placeholder="Ví dụ: nghe nhạc, thể thao, đọc sách..."
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả bản thân</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>
                <Button
                  className="w-100"
                  type="submit"
                  variant="success"
                  size="lg"
                >
                  Tìm bạn cùng trọ phù hợp
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentRoommateMatchForm;
