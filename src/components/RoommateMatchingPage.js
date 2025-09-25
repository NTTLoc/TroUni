import React, { useState } from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";

const MOCK_ROOMMATES = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 24,
    job: "Lập trình viên phần mềm",
    match: 89,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Lisa Nguyen",
    age: 25,
    job: "Giáo viên",
    match: 77,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 3,
    name: "Emma Wilson",
    age: 23,
    job: "Sinh viên đại học",
    match: 70,
    verified: true,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const MOCK_STATS = {
  total: 6,
  avg: 72,
  high: 1,
  saved: 0,
};

function RoommateMatchingPage() {
  const [filters, setFilters] = useState({
    location: "",
    minBudget: "",
    gender: "",
    age: "",
    roomType: "",
  });

  // Lọc dữ liệu mẫu (demo)
  const filteredRoommates = MOCK_ROOMMATES.filter((r) => {
    if (filters.gender && filters.gender !== "all") {
      // Giả lập: chỉ lọc theo nữ
      if (
        filters.gender === "female" &&
        !r.name.includes("Sarah") &&
        !r.name.includes("Lisa") &&
        !r.name.includes("Emma")
      )
        return false;
    }
    return true;
  });

  return (
    <div
      style={{ background: "#181f2a", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-md-3 mb-4">
            <Card className="shadow border-0 bg-dark text-light">
              <Card.Body>
                <h5 className="mb-4">Bộ lọc</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Khu vực</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Tất cả quận/huyện"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Khoảng giá (VNĐ)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Giá tối thiểu"
                      value={filters.minBudget}
                      onChange={(e) =>
                        setFilters({ ...filters, minBudget: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ưu tiên giới tính</Form.Label>
                    <Form.Select
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters({ ...filters, gender: e.target.value })
                      }
                    >
                      <option value="all">Tất cả</option>
                      <option value="female">Nữ</option>
                      <option value="male">Nam</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Độ tuổi</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: 20-25"
                      value={filters.age}
                      onChange={(e) =>
                        setFilters({ ...filters, age: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại phòng</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: Ở ghép, riêng tư"
                      value={filters.roomType}
                      onChange={(e) =>
                        setFilters({ ...filters, roomType: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Button variant="success" className="w-100 mt-2">
                    Áp dụng bộ lọc
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            {/* Match Statistics */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <Card className="shadow border-0 text-center">
                  <Card.Body>
                    <div style={{ fontSize: 24, fontWeight: 600 }}>
                      {MOCK_STATS.total}
                    </div>
                    <div style={{ color: "#888" }}>Tổng số ghép trọ</div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-3 mb-3">
                <Card className="shadow border-0 text-center">
                  <Card.Body>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#71cd14",
                      }}
                    >
                      {MOCK_STATS.avg}%
                    </div>
                    <div style={{ color: "#888" }}>
                      % tương thích trung bình
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-3 mb-3">
                <Card className="shadow border-0 text-center">
                  <Card.Body>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#384aeb",
                      }}
                    >
                      {MOCK_STATS.high}
                    </div>
                    <div style={{ color: "#888" }}>
                      Ghép trọ nổi bật (&gt;=80%)
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-3 mb-3">
                <Card className="shadow border-0 text-center">
                  <Card.Body>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#ff6c00",
                      }}
                    >
                      {MOCK_STATS.saved}
                    </div>
                    <div style={{ color: "#888" }}>Đã lưu</div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Roommate Cards */}
            <div className="row">
              {filteredRoommates.map((r) => (
                <div className="col-md-4 mb-4" key={r.id}>
                  <Card className="shadow border-0 h-100">
                    <Card.Body className="text-center">
                      <div className="d-flex justify-content-center mb-2">
                        {r.verified && (
                          <Badge bg="success" className="me-2">
                            Đã xác thực
                          </Badge>
                        )}
                        <Badge bg="info">{r.match}% Phù hợp</Badge>
                      </div>
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className="rounded-circle mb-3"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          border: "3px solid #71cd14",
                        }}
                      />
                      <h5 className="mb-1">{r.name}</h5>
                      <div className="text-muted mb-1">
                        <i className="bi bi-person"></i> {r.age} tuổi
                      </div>
                      <div className="mb-2" style={{ color: "#888" }}>
                        {r.job}
                      </div>
                      <Button variant="outline-primary" size="sm">
                        <i className="bi bi-heart"></i> Lưu lại
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoommateMatchingPage;
