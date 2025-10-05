import React, { useState } from "react";
import { Layout } from "antd";
import AdminHeader from "../../features/admin/adminHeader/AdminHeader";
import AdminSidebar from "../../features/admin/adminSidebar/AdminSidebar";
import AmenityManagement from "../../components/admin/AmenityManagement";
import "./Dashboard.scss";

const { Content } = Layout;

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  // Handle menu click
  const handleMenuClick = (key) => {
    setSelectedMenu(key);
  };

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <div>
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="card">👤 Người dùng: 120</div>
              <div className="card">📦 Bài đăng: 56</div>
              <div className="card">💰 Doanh thu: 12.5M</div>
              <div className="card">🏠 Tiện ích: 25</div>
            </div>
          </div>
        );
      case "amenities":
        return <AmenityManagement />;
      case "users":
        return (
          <div>
            <h2>Quản lý người dùng</h2>
            <p>Chức năng quản lý người dùng sẽ được thêm sau</p>
          </div>
        );
      case "posts":
        return (
          <div>
            <h2>Quản lý bài đăng</h2>
            <p>Chức năng quản lý bài đăng sẽ được thêm sau</p>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2>Cài đặt hệ thống</h2>
            <p>Chức năng cài đặt sẽ được thêm sau</p>
          </div>
        );
      default:
        return (
          <div>
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="card">👤 Người dùng: 120</div>
              <div className="card">📦 Bài đăng: 56</div>
              <div className="card">💰 Doanh thu: 12.5M</div>
              <div className="card">🏠 Tiện ích: 25</div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar selectedKey={selectedMenu} onMenuClick={handleMenuClick} />

      <Layout className="admin-main">
        {/* Header */}
        {/* <AdminHeader /> */}

        {/* Nội dung dashboard */}
        <Content className="admin-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
