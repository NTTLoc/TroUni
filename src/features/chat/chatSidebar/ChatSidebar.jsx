import React, { useEffect, useState } from "react";
import { List, Avatar, Typography } from "antd";

const { Text } = Typography;

const ChatSidebar = ({ selectedChat, onSelectChat, conversations = [] }) => {
  const [data, setData] = useState(conversations);

  useEffect(() => setData(conversations), [conversations]);

  useEffect(() => {
    if (selectedChat) {
      setData((prev) => {
        const exists = prev.some((c) => c.id === selectedChat.id);
        if (!exists) return [selectedChat, ...prev];
        return prev.map((c) =>
          c.id === selectedChat.id ? { ...c, ...selectedChat } : c
        );
      });
    }
  }, [selectedChat]);

  return (
    <div className="chat-sidebar-container">
      <div className="sidebar-header">Tin nhắn</div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        locale={{ emptyText: "Chưa có cuộc trò chuyện nào" }}
        renderItem={(item) => (
          <List.Item
            className={`chat-item ${
              selectedChat?.id === item.id ? "active" : ""
            }`}
            onClick={() => onSelectChat(item)}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar || "/default-avatar.png"} />}
              title={<Text strong>{item.name}</Text>}
              description={
                <Text type="secondary">{item.lastMessage || "..."}</Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatSidebar;
