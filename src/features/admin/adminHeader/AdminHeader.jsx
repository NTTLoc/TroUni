import { Layout, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const menuItems = [
  { key: "profile", label: "Hồ sơ cá nhân" },
  { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined /> },
];

const AdminHeader = () => {
  return (
    <Header className="admin-header">
      <h1 className="title">Quản trị hệ thống</h1>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Avatar size="large" icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
