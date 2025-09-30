import React, { useState } from "react";
import { Tabs, Button, Input, Avatar, Empty } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  WalletOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { assets } from "../../assets/assets";
import "./ManagePost.scss";

const { TabPane } = Tabs;

const tabItems = [
  { key: "1", label: "ĐANG HIỂN THỊ (0)" },
  { key: "2", label: "HẾT HẠN (0)" },
  { key: "3", label: "BỊ TỪ CHỐI (0)" },
  { key: "4", label: "CẦN THANH TOÁN (0)" },
  { key: "5", label: "TIN NHÁP (0)" },
  { key: "6", label: "CHỜ DUYỆT (0)" },
  { key: "7", label: "ĐÃ ẨN (0)" },
];

const ManagePost = () => {
  const [activeTab, setActiveTab] = useState("1");
  const user = JSON.parse(localStorage.getItem("user"));
  const profile = JSON.parse(localStorage.getItem("profile"));

  return (
    <div className="manage-container">
      {/* Header */}
      <div className="manage-header">
        <div className="user-info">
          <Avatar size={48} src={profile?.avatarUrl || assets.avatar} />
          <div className="user-detail">
            <h3>{user?.username || "Không có tên hiển thị"}</h3>
          </div>
        </div>

        <div className="search-balance">
          <Input
            placeholder="Tìm tin đăng của bạn..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Button icon={<WalletOutlined />}>Số dư: 0</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="manage-tabs"
      >
        {tabItems.map((tab) => (
          <TabPane tab={tab.label} key={tab.key}>
            <div className="manage-content">
              <Empty
                description={
                  <span>
                    Không tìm thấy tin đăng <br />
                    Bạn hiện tại không có tin đăng nào cho trạng thái này
                  </span>
                }
              />
              <Button type="primary" className="post-btn">
                Đăng tin
              </Button>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ManagePost;
