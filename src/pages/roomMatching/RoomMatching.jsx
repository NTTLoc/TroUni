import React, { useState } from "react";
import { Row, Col, Card, Tabs } from "antd";
import FilterPanel from "../../features/roomMatching/filterPanel/FilterPanel";
import RoommateCard from "../../features/roomMatching/roommateCard/RoommateCard";
import SwipeRoommates from "../../features/roomMatching/swipeRoommates/SwipeRoommates";
import "./RoomMatching.scss";

const { TabPane } = Tabs;

const dummyData = [
  { id: 1, name: "Nguyễn A", gender: "Nam", budget: 1500000, match: 85 },
  { id: 2, name: "Trần B", gender: "Nữ", budget: 2000000, match: 72 },
  { id: 3, name: "Lê C", gender: "Nam", budget: 1800000, match: 90 },
];

const RoomMatching = () => {
  const [roommates, setRoommates] = useState(dummyData);

  return (
    <div className="roommate-finder">
      <Row gutter={16}>
        {/* Bộ lọc */}
        <Col span={6}>
          <Card title="Bộ lọc" className="filter-card">
            <FilterPanel onFilter={(filtered) => setRoommates(filtered)} />
          </Card>
        </Col>

        {/* Tabs chính */}
        <Col span={18}>
          <Tabs defaultActiveKey="1" className="finder-tabs">
            <TabPane tab="Danh sách gợi ý" key="1">
              <Row gutter={[16, 16]}>
                {roommates.map((r) => (
                  <Col span={12} key={r.id}>
                    <RoommateCard data={r} />
                  </Col>
                ))}
              </Row>
            </TabPane>

            <TabPane tab="Ghép nhanh" key="2">
              <SwipeRoommates data={roommates} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default RoomMatching;
