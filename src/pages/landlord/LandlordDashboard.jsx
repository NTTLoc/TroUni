import React, { useState } from "react";
import { Row, Col, Card, Statistic, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import AccountInfo from "../../components/account/accountInfo/AccountInfo";
import ManagePost from "../../pages/managePost/ManagePost";
import "./LandlordDashboard.scss";

const LandlordDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("rooms");

  const menuItems = [
    {
      key: "rooms",
      icon: <FileTextOutlined />,
      label: "Quản Lý Phòng Trọ",
    },

    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
  ];

  const renderRooms = () => <ManagePost />;

  const renderProfile = () => <AccountInfo />;

  const renderContent = () => {
    switch (activeMenu) {
      case "rooms":
        return renderRooms();
      case "profile":
        return renderProfile();
      default:
        return null;
    }
  };

  return (
    <div className="landlord-container">
      <Row gutter={24}>
        {/* Sidebar */}
        <Col span={6}>
          <Card className="landlord-sidebar">
            <Menu
              mode="inline"
              selectedKeys={[activeMenu]}
              onClick={(e) => setActiveMenu(e.key)}
              items={menuItems}
            />
          </Card>
        </Col>

        {/* Main Content */}
        <Col span={18}>
          <Card className="landlord-content">{renderContent()}</Card>
        </Col>
      </Row>
    </div>
  );
};

export default LandlordDashboard;
