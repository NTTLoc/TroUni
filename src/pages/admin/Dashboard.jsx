import React, { useState } from "react";
import { Layout, Menu, Card } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  ApartmentOutlined,
  DollarOutlined,
  StarOutlined, // ⭐ icon cho phần đánh giá
} from "@ant-design/icons";
import Overview from "../../features/admin/overview/Overview";
import UserManagement from "../../features/admin/userManagement/UserManagement";
import PostManagement from "../../features/admin/postManagement/PostManagement";
import AmenityManagement from "../../features/admin/amenityManagement/AmenityManagement";
import PaymentManagement from "../../features/admin/paymentManagement/PaymentManagement";
import ReviewManagement from "../../features/admin/reviewManagement/ReviewManagement";
import "./Dashboard.scss";

const { Sider, Content } = Layout;

const Dashboard = () => {
  // 🔹 Lấy menu đã lưu, nếu chưa có thì mặc định "overview"
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("adminMenu") || "overview"
  );

  // 🔹 Khi chọn menu khác → lưu lại vào localStorage
  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
    localStorage.setItem("adminMenu", e.key);
  };

  // 🔹 Menu hiển thị ở sidebar
  const menuItems = [
    { key: "overview", icon: <HomeOutlined />, label: "Tổng quan" },
    { key: "users", icon: <UserOutlined />, label: "Người dùng" },
    { key: "posts", icon: <FileTextOutlined />, label: "Bài đăng" },
    { key: "amenities", icon: <ApartmentOutlined />, label: "Tiện ích" },
    { key: "payments", icon: <DollarOutlined />, label: "Thanh toán" },
    { key: "reviews", icon: <StarOutlined />, label: "Đánh giá" }, // ⭐ thêm dòng này
  ];

  // 🔹 Render nội dung chính dựa theo menu được chọn
  const renderContent = () => {
    switch (selectedMenu) {
      case "overview":
        return <Overview />;
      case "users":
        return <UserManagement />;
      case "posts":
        return <PostManagement />;
      case "amenities":
        return <AmenityManagement />;
      case "payments":
        return <PaymentManagement />;
      case "reviews":
        return <ReviewManagement />;
      default:
        return (
          <Card>
            <h2>{menuItems.find((m) => m.key === selectedMenu)?.label}</h2>
            <p>Tính năng này sẽ được thêm sớm.</p>
          </Card>
        );
    }
  };

  return (
    <Layout className="admin-dashboard">
      <Sider className="sidebar" width={230} breakpoint="lg" collapsedWidth="0">
        <div className="sidebar-logo">Admin</div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>

      <Layout className="main">
        <Content className="content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
