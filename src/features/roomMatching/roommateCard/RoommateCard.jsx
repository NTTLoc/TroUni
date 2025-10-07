import React from "react";
import { Card, Avatar, Tag, Progress } from "antd";
import { UserOutlined } from "@ant-design/icons";

const RoommateCard = ({ data }) => {
  return (
    <Card hoverable className="roommate-card">
      <Card.Meta
        avatar={
          <Avatar
            size={48}
            src={`https://i.pravatar.cc/150?img=${data.id}`}
            icon={<UserOutlined />}
          />
        }
        title={data.name}
        description={`${data.university} - ${data.budget.toLocaleString()}đ`}
      />
      <div style={{ marginTop: 12 }}>
        <Tag color={data.gender === "Nam" ? "blue" : "magenta"}>
          {data.gender}
        </Tag>
        <Progress percent={data.match} size="small" strokeColor="#00a896" />
      </div>
    </Card>
  );
};

export default RoommateCard;
