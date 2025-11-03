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

    const fetchChats = async () => {
      try {
        const res = await getChatRoomsByUserApi(currentUser.id);
        const chatRoomsRaw = Array.isArray(res.data) ? res.data : [];

        const chatRooms = chatRoomsRaw.map((room) => {
          const other =
            room.participants?.find((p) => p.id !== currentUser.id) || {};
          return {
            id: room.id,
            name: other.username || "Người dùng",
            avatar: other.profile?.avatarUrl || assets.avatar,
            userId: other.id,
            lastMessage: room.lastMessage || "Chưa có tin nhắn",
            participants: room.participants,
          };
        });

        setConversationList(chatRooms);

        // 🚫 Nếu landlord → không xử lý PostOwner chat
        if (currentUser?.role === "LANDLORD" && chatTargetFromState) {
          message.warning("Chủ trọ không thể nhắn tin từ bài đăng của mình!");
          return;
        }

        // ✅ Nếu đi từ PostOwner → tạo hoặc lấy room tương ứng
        if (chatTargetFromState?.userId && currentUser?.role !== "LANDLORD") {
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
        } else if (!selectedChat && chatRooms.length > 0) {
          setSelectedChat(chatRooms[0]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch chat rooms:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 5000); // 🔁 Reload mỗi 5s

    return () => clearInterval(interval);
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
