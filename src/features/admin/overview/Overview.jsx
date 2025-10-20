import React, { useState } from "react";
import { Card, Row, Col, Statistic, DatePicker, Space, Button } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import "./Overview.scss";

const { RangePicker } = DatePicker;

const Overview = () => {
  const [dateRange, setDateRange] = useState([]);

  // Giả lập dữ liệu
  const revenueData = [
    { month: "01/2025", revenue: 8 },
    { month: "02/2025", revenue: 12 },
    { month: "03/2025", revenue: 15 },
    { month: "04/2025", revenue: 10 },
    { month: "05/2025", revenue: 18 },
    { month: "06/2025", revenue: 20 },
    { month: "07/2025", revenue: 22 },
    { month: "08/2025", revenue: 24 },
    { month: "09/2025", revenue: 19 },
    { month: "10/2025", revenue: 25 },
  ];

  const statusData = [
    { name: "Hiển thị", value: 40 },
    { name: "Chờ duyệt", value: 15 },
    { name: "Đã thuê", value: 10 },
    { name: "Ẩn", value: 5 },
  ];

  const userGrowthData = [
    { month: "01/2025", users: 20 },
    { month: "02/2025", users: 35 },
    { month: "03/2025", users: 50 },
    { month: "04/2025", users: 45 },
    { month: "05/2025", users: 60 },
    { month: "06/2025", users: 80 },
    { month: "07/2025", users: 95 },
    { month: "08/2025", users: 110 },
    { month: "09/2025", users: 120 },
    { month: "10/2025", users: 135 },
  ];

  const COLORS = ["#52c41a", "#faad14", "#1890ff", "#bfbfbf"];

  const handleFilter = (dates) => setDateRange(dates);

  return (
    <div className="overview-page">
      <h2 className="page-title">Tổng quan hệ thống</h2>

      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Người dùng"
              value={120}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Bài đăng"
              value={56}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Doanh thu"
              value={12.5}
              prefix={<DollarOutlined />}
              suffix="Triệu"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Tiện ích"
              value={25}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc thời gian */}
      <div className="filter-section">
        <Space>
          <RangePicker onChange={handleFilter} />
          <Button icon={<ReloadOutlined />} onClick={() => setDateRange([])}>
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Biểu đồ doanh thu full width */}
      <div className="chart-section full-width">
        <Card title="📈 Doanh thu theo tháng (Triệu VNĐ)">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1890ff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Biểu đồ người dùng mới */}
      <Row gutter={[16, 16]} className="chart-section">
        <Col xs={24} md={14}>
          <Card title="👤 Người dùng mới theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#00bfa6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="🏘 Trạng thái bài đăng">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
