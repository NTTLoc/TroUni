import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const AdminSidebar = ({ selectedKey, onMenuClick }) => {
  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "users", icon: <UserOutlined />, label: "Người dùng" },
    { key: "posts", icon: <FileTextOutlined />, label: "Bài đăng" },
    { key: "amenities", icon: <AppstoreOutlined />, label: "Quản lý tiện ích" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
  ];

  return (
    <Sider className="admin-sider" width={220}>
      <div className="logo">Admin Panel</div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey || "dashboard"]}
        items={menuItems}
        onClick={({ key }) => onMenuClick && onMenuClick(key)}
      />
    </Sider>
  );
};

export default AdminSidebar;
