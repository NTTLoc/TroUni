import { useState } from "react";
import { Row, Col, Card, Menu } from "antd";
import { UserOutlined, LockOutlined, SettingOutlined } from "@ant-design/icons";
import AccountInfo from "../../components/account/accountInfo/AccountInfo";
import AccountSecurity from "../../components/account/accountSecurity/AccountSecurity";
import AccountSettings from "../../components/account/accountSettings/AccountSettings";
import "./Account.scss";

const Account = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="profile-container">
      <Row gutter={24}>
        {/* Sidebar */}
        <Col span={6}>
          <Card className="profile-sidebar">
            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              onClick={(e) => setActiveTab(e.key)}
              items={[
                {
                  key: "info",
                  icon: <UserOutlined />,
                  label: "Thông tin cá nhân",
                },
                {
                  key: "security",
                  icon: <LockOutlined />,
                  label: "Bảo mật",
                },
                {
                  key: "settings",
                  icon: <SettingOutlined />,
                  label: "Cài đặt",
                },
              ]}
            />
          </Card>
        </Col>

        {/* Content */}
        <Col span={18}>
          <Card className="profile-content">
            {activeTab === "info" && <AccountInfo />}
            {activeTab === "security" && <AccountSecurity />}
            {activeTab === "settings" && <AccountSettings />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Account;
