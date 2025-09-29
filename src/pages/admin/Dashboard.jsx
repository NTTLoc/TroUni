import { Layout } from "antd";
import AdminHeader from "../../features/admin/adminHeader/AdminHeader";
import AdminSidebar from "../../features/admin/adminSidebar/AdminSidebar";
import "./Dashboard.scss";

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar />

      <Layout className="admin-main">
        {/* Header */}
        {/* <AdminHeader /> */}

        {/* Nội dung dashboard */}
        <Content className="admin-content">
          <h2>Dashboard</h2>
          <div className="stats-grid">
            <div className="card">👤 Người dùng: 120</div>
            <div className="card">📦 Bài đăng: 56</div>
            <div className="card">💰 Doanh thu: 12.5M</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
