import React from "react";
import { Alert, Card, List } from "antd";

const dummyAlerts = [
  { id: 1, type: "warning", msg: "Thói quen ngủ khác biệt nhiều." },
  { id: 2, type: "info", msg: "Bạn và bạn cùng phòng học cùng trường." },
];

const AlertSection = () => (
  <List
    dataSource={dummyAlerts}
    renderItem={(item) => (
      <Card style={{ marginBottom: 16 }}>
        <Alert message={item.msg} type={item.type} showIcon />
      </Card>
    )}
  />
);

export default AlertSection;
