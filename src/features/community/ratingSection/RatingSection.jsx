import React from "react";
import { List, Card, Rate, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const dummyRatings = [
  { id: 1, user: "Nguyễn Văn A", rating: 4, comment: "Bạn rất thân thiện" },
  { id: 2, user: "Trần Thị B", rating: 5, comment: "Giữ vệ sinh tốt" },
];

const RatingSection = () => (
  <List
    dataSource={dummyRatings}
    renderItem={(item) => (
      <Card style={{ marginBottom: 16 }}>
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={item.user}
            description={<Rate disabled defaultValue={item.rating} />}
          />
          <p>{item.comment}</p>
        </List.Item>
      </Card>
    )}
  />
);

export default RatingSection;
