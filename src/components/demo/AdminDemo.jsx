import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { AdminOutlined, AppstoreOutlined } from "@ant-design/icons";
import Dashboard from "../pages/admin/Dashboard";

const { Title, Text } = Typography;

/**
 * AdminDemo Component
 * Demo component để test Admin Dashboard
 */
const AdminDemo = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <AdminOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
          <Title level={2}>Admin Dashboard Demo</Title>
          <Text type="secondary">
            Demo chức năng quản lý amenities trong Admin Dashboard
          </Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={4}>🎯 Tính năng đã implement:</Title>
            <ul>
              <li>✅ <strong>Admin Sidebar</strong> - Menu navigation với các trang quản lý</li>
              <li>✅ <strong>Amenity Management</strong> - CRUD operations cho amenities</li>
              <li>✅ <strong>Table View</strong> - Hiển thị danh sách amenities với search/filter</li>
              <li>✅ <strong>Create/Edit Modal</strong> - Form tạo và chỉnh sửa amenities</li>
              <li>✅ <strong>Delete Confirmation</strong> - Xác nhận trước khi xóa</li>
              <li>✅ <strong>Responsive Design</strong> - Tối ưu cho mobile</li>
            </ul>
          </div>

          <div>
            <Title level={4}>🔧 API Integration:</Title>
            <ul>
              <li>✅ <strong>GET /master-amenities</strong> - Lấy danh sách amenities</li>
              <li>✅ <strong>POST /master-amenities</strong> - Tạo amenity mới</li>
              <li>✅ <strong>DELETE /master-amenities/{id}</strong> - Xóa amenity</li>
              <li>⏳ <strong>PUT /master-amenities/{id}</strong> - Cập nhật amenity (chưa có backend)</li>
            </ul>
          </div>

          <div>
            <Title level={4}>🎨 UI/UX Features:</Title>
            <ul>
              <li>✅ <strong>Modern Design</strong> - Cards, gradients, shadows</li>
              <li>✅ <strong>Dark Mode Support</strong> - Hỗ trợ dark theme</li>
              <li>✅ <strong>Loading States</strong> - Spinner và skeleton</li>
              <li>✅ <strong>Error Handling</strong> - Error messages và fallbacks</li>
              <li>✅ <strong>Success Feedback</strong> - Toast notifications</li>
            </ul>
          </div>
        </Space>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<AppstoreOutlined />}
            onClick={() => window.open('/admin', '_blank')}
          >
            Mở Admin Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDemo;
