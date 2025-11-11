import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // thêm
import { Row, Col, Card, Menu } from "antd";
import { UserOutlined, HistoryOutlined } from "@ant-design/icons";
import AccountInfo from "../../components/account/accountInfo/AccountInfo";
import AccountHistory from "../../components/account/accountHistory/AccountHistory";
import "./Account.scss";

const Account = () => {
  const location = useLocation(); // đọc URL
  const params = new URLSearchParams(location.search);
  const tabFromQuery = params.get("tab"); // "info" hoặc "history"

  const [activeTab, setActiveTab] = useState(tabFromQuery || "info");

  // cập nhật nếu URL thay đổi
  useEffect(() => {
    if (tabFromQuery) setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

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
                  key: "history",
                  icon: <HistoryOutlined />,
                  label: "Lịch sử giao dịch",
                },
              ]}
            />
          </Card>
        </Col>

        {/* Content */}
        <Col span={18}>
          <Card className="profile-content">
            {activeTab === "info" && <AccountInfo />}
            {activeTab === "history" && <AccountHistory />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Account;
