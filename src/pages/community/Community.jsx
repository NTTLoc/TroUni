import React from "react";
import { Tabs } from "antd";
import RatingSection from "../../features/community/ratingSection/RatingSection";
import AlertSection from "../../features/community/alertSection/AlertSection";
import SocialSection from "../../features/community/socialSection/SocialSection";
import ExpenseSection from "../../features/community/expenseSection/ExpenseSection";
import "./Community.scss";

const Community = () => {
  return (
    <div className="community-page">
      <h2>Cộng đồng & Quản lý trọ</h2>
      <Tabs defaultActiveKey="rating">
        <Tabs.TabPane tab="Đánh giá" key="rating">
          <RatingSection />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Cảnh báo" key="alert">
          <AlertSection />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Cộng đồng" key="social">
          <SocialSection />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Chi phí" key="expense">
          <ExpenseSection />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Community;
