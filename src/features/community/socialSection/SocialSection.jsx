import React from "react";
import { Card, List, Avatar, Button } from "antd";
import { UserOutlined, LikeOutlined, CommentOutlined } from "@ant-design/icons";

const dummyPosts = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    content: "Mình tìm bạn ở chung",
    likes: 3,
    comments: 2,
  },
  {
    id: 2,
    user: "Trần Thị B",
    content: "Cần thêm 1 bạn nữ ở nhóm 4 người",
    likes: 5,
    comments: 1,
  },
];

const SocialSection = () => (
  <List
    dataSource={dummyPosts}
    renderItem={(item) => (
      <Card style={{ marginBottom: 16 }}>
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={item.user}
            description={item.content}
          />
        </List.Item>
        <div style={{ display: "flex", gap: 10 }}>
          <Button icon={<LikeOutlined />}>{item.likes}</Button>
          <Button icon={<CommentOutlined />}>{item.comments}</Button>
        </div>
      </Card>
    )}
  />
);

export default SocialSection;
