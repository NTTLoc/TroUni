import React from "react";
import { Table, Space, Button, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
// import "./AmenityManagement.scss";

const AmenityManagement = () => {
  const amenities = [
    { key: 1, name: "Wifi miễn phí" },
    { key: 2, name: "Máy giặt chung" },
  ];

  const columns = [
    { title: "Tên tiện ích", dataIndex: "name" },
    {
      title: "Hành động",
      render: () => (
        <Space>
          <Button type="link">Sửa</Button>
          <Button type="link" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="amenity-management">
      <div className="table-header">
        <Input
          placeholder="Tìm kiếm tiện ích..."
          prefix={<SearchOutlined />}
          className="search-input"
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm tiện ích
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={amenities}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AmenityManagement;
