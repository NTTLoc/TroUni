import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import ChatSidebar from "../../features/chat/chatSidebar/ChatSidebar";
import ChatWindow from "../../features/chat/chatWindow/ChatWindow";
import { useAuth } from "../../hooks/useAuth";
import "./Chat.scss";

const { Sider, Content } = Layout;

const Chat = () => {
  const { auth } = useAuth();
  const currentUser = auth.user;

  const location = useLocation();
  const chatTarget = location.state?.chatTarget; // user được gửi từ PostOwner

  const [selectedChat, setSelectedChat] = useState(chatTarget || null);
  const [conversationList, setConversationList] = useState([]);

  // Khi có chatTarget từ PostOwner
  useEffect(() => {
    if (chatTarget) {
      setSelectedChat(chatTarget);
      setConversationList((prev) => {
        const exists = prev.some((c) => c.id === chatTarget.id);
        if (!exists) return [chatTarget, ...prev];
        return prev;
      });
    }
  }, [chatTarget]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <Layout className="chat-page">
      <Sider width={300} className="chat-sidebar">
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          conversations={conversationList}
        />
      </Sider>

      <Content className="chat-content">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUser={currentUser} />
        ) : (
          <div className="chat-empty">Chọn một cuộc trò chuyện để bắt đầu</div>
        )}
      </Content>
    </Layout>
  );
};

export default Chat;
