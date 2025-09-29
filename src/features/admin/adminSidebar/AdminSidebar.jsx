import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const AdminSidebar = () => {
  return (
    <Sider className="admin-sider" width={220}>
      <div className="logo">Admin Panel</div>
      <Menu
        theme=""
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={[
          { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
          { key: "users", icon: <UserOutlined />, label: "Người dùng" },
          { key: "posts", icon: <FileTextOutlined />, label: "Bài đăng" },
          { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
        ]}
      />
    </Sider>
  );
};

export default AdminSidebar;
