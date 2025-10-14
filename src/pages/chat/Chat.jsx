import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import ChatSidebar from "../../features/chat/chatSidebar/ChatSidebar";
import ChatWindow from "../../features/chat/chatWindow/ChatWindow";
import { useAuth } from "../../hooks/useAuth";
import {
  getChatRoomsByUserApi,
  createChatRoomApi,
} from "../../services/chatApi";
import { assets } from "../../assets/assets";
import "./Chat.scss";

const { Sider, Content } = Layout;

const Chat = () => {
  const { auth } = useAuth();
  const currentUser = auth.user;

  const location = useLocation();
  const chatTargetFromState = location.state?.chatTarget; // người được chọn từ PostOwner

  const [selectedChat, setSelectedChat] = useState(chatTargetFromState || null);
  const [conversationList, setConversationList] = useState([]);

  // 🟢 Lấy danh sách các phòng chat của user
  useEffect(() => {
    if (!currentUser?.id) return;

    getChatRoomsByUserApi(currentUser.id)
      .then(async (res) => {
        const chatRoomsRaw = Array.isArray(res.data) ? res.data : [];

        // Chuẩn hóa dữ liệu: lấy người còn lại để hiển thị avatar + name
        const chatRooms = chatRoomsRaw.map((room) => {
          const other =
            room.participants?.find((p) => p.id !== currentUser.id) || {};

          return {
            id: room.id,
            name: other.username || "Người dùng",
            avatar: other.profile.avatarUrl || assets.avatar,
            userId: other.id,
            lastMessage: room.lastMessage || "Chưa có tin nhắn",
            participants: room.participants,
          };
        });

        setConversationList(chatRooms);

        // ✅ Nếu đi từ PostOwner → tạo hoặc lấy room tương ứng
        if (chatTargetFromState?.userId) {
          try {
            const roomRes = await createChatRoomApi(chatTargetFromState.userId);
            const room = roomRes.data;

            const other =
              room.participants?.find((p) => p.id !== currentUser.id) || {};

            setSelectedChat({
              id: room.id,
              name: other.username || chatTargetFromState.name,
              avatar: other.avatar || chatTargetFromState.avatar,
              userId: other.id || chatTargetFromState.userId,
              participants: room.participants,
            });
          } catch (err) {
            console.error("❌ Failed to create/get chat room:", err);
          }
        } else if (!selectedChat && chatRooms.length > 0) {
          // ✅ Nếu user vào thẳng /chat → auto chọn phòng đầu tiên
          setSelectedChat(chatRooms[0]);
        }
      })
      .catch((err) => console.error("❌ Failed to fetch chat rooms:", err));
  }, [currentUser, chatTargetFromState]);

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
