import React, { useState } from "react";
import { Card, Button } from "antd";

const SwipeRoommates = ({ data }) => {
  const [index, setIndex] = useState(0);

  const handleSwipe = (direction) => {
    console.log(`Bạn đã ${direction} ${data[index].name}`);
    setIndex((prev) => (prev + 1) % data.length);
  };

  if (!data.length) return <p>Không có gợi ý nào.</p>;

  const roommate = data[index];

  return (
    <div className="swipe-container">
      <Card
        hoverable
        cover={
          <img
            alt={roommate.name}
            src={`https://i.pravatar.cc/300?img=${roommate.id}`}
          />
        }
      >
        <Card.Meta
          title={roommate.name}
          description={`Ngân sách: ${roommate.budget.toLocaleString()}đ - ${
            roommate.university
          }`}
        />
      </Card>
      <div className="swipe-buttons">
        <Button danger onClick={() => handleSwipe("Bỏ qua")}>
          ❌
        </Button>
        <Button type="primary" onClick={() => handleSwipe("Quan tâm")}>
          💚
        </Button>
      </div>
    </div>
  );
};

export default SwipeRoommates;
