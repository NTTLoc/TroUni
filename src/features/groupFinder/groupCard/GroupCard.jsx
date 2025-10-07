import React from "react";
import { Card, Progress, Button } from "antd";

const GroupCard = ({ data }) => {
  const percent = Math.round((data.members / data.capacity) * 100);

  return (
    <Card
      style={{ marginBottom: 12 }}
      actions={[<Button type="link">Tham gia</Button>]}
    >
      <Card.Meta
        title={data.name}
        description={`Thành viên: ${data.members}/${data.capacity}`}
      />
      <Progress percent={percent} size="small" />
    </Card>
  );
};

export default GroupCard;
