import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Input,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  DollarOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./Overview.scss";

const Overview = () => {
  const dataSource = [
    {
      key: "1",
      title: "Phòng trọ Cầu Giấy",
      author: "Nguyễn Văn A",
      status: "Đang hiển thị",
      price: "2.000.000 đ",
    },
    {
      key: "2",
      title: "Phòng mini Quận 1",
      author: "Trần Thị B",
      status: "Chờ duyệt",
      price: "3.500.000 đ",
    },
  ];

  const columns = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Người đăng", dataIndex: "author" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Đang hiển thị" ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
    { title: "Giá thuê", dataIndex: "price" },
  ];

  return (
    <div className="overview-page">
      <h2 className="page-title">Tổng quan hệ thống</h2>

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

      <div className="table-section">
        <div className="table-header">
          <Input
            placeholder="Tìm kiếm bài đăng..."
            prefix={<SearchOutlined />}
            className="search-input"
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default Overview;
