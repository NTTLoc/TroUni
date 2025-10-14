import React, { useMemo } from "react";
import { List, Avatar, Typography } from "antd";
import { assets } from "../../../assets/assets";

const { Text } = Typography;

const ChatSidebar = ({ selectedChat, onSelectChat, conversations = [] }) => {
  // 🧠 Memo hóa danh sách, đảm bảo selectedChat luôn hiển thị
  const displayedConversations = useMemo(() => {
    if (!selectedChat) return conversations;

    const exists = conversations.some((c) => c.id === selectedChat.id);
    if (exists) {
      return conversations.map((c) =>
        c.id === selectedChat.id
          ? { ...c, lastMessage: selectedChat.lastMessage || c.lastMessage }
          : c
      );
    } else {
      return [
        {
          ...selectedChat,
          lastMessage: selectedChat.lastMessage || "",
          avatar: selectedChat.avatar || "/default-avatar.png",
        },
        ...conversations,
      ];
    }
  }, [conversations, selectedChat]);

  return (
    <div className="chat-sidebar-container">
      <div className="sidebar-header">Tin nhắn</div>

      <List
        itemLayout="horizontal"
        dataSource={displayedConversations}
        locale={{ emptyText: "Chưa có cuộc trò chuyện nào" }}
        renderItem={(item) => (
          console.log(item),
          (
            <List.Item
              className={`chat-item ${
                selectedChat?.id === item.id ? "active" : ""
              }`}
              onClick={() => onSelectChat(item)}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar || assets.avatar} />}
                title={<Text strong>{item.name}</Text>}
              />
            </List.Item>
          )
        )}
      />
    </div>
  );
};

export default ChatSidebar;
