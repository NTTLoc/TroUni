import React, { useState, useEffect, useRef } from "react";
import { Input, Button, List, Avatar, Typography, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
} from "../../../services/chatApi";

const { Text } = Typography;

const ChatWindow = ({ chat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // 1️⃣ Load lịch sử tin nhắn từ DB khi mở chat
  useEffect(() => {
    if (!chat?.id) return;
    setLoading(true);

    axios
      .get(`/chat/${chat.id}/history`)
      .then((res) => {
        const history = res.data.data.map((msg) => ({
          ...msg,
          self: msg.senderId === currentUser.id,
        }));
        setMessages(history);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chat, currentUser]);

  // 2️⃣ Kết nối WebSocket
  useEffect(() => {
    if (!currentUser?.id) return;

    connectWebSocket(currentUser.id, (msg) => {
      setMessages((prev) => [
        ...prev,
        { ...msg, self: msg.senderId === currentUser.id },
      ]);
    });

    return () => disconnectWebSocket();
  }, [currentUser]);

  // 3️⃣ Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4️⃣ Gửi tin nhắn
  const handleSend = () => {
    if (!messageInput.trim()) return;

    sendMessage(chat.id, messageInput); // Gửi qua WebSocket

    // Thêm tạm vào state để hiển thị ngay
    setMessages((prev) => [
      ...prev,
      { senderId: currentUser.id, content: messageInput, self: true },
    ]);
    setMessageInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <Avatar
          src={currentUser?.profile?.avatarUrl}
          size="small"
          style={{ marginRight: 8 }}
        />
        {currentUser?.username}
      </div>

      <div className="chat-messages" style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <Spin tip="Loading chat..." style={{ marginTop: 20 }} />
        ) : (
          <List
            dataSource={messages}
            renderItem={(msg, index) => (
              <List.Item
                key={index}
                className={`message-item ${
                  msg.self ? "message-self" : "message-other"
                }`}
              >
                {!msg.self && <Avatar src={chat.avatar} />}
                <div
                  className={`message-bubble ${msg.self ? "self" : "other"}`}
                >
                  {!msg.self && <Text strong>{chat.name}</Text>}
                  <div>{msg.content}</div>
                </div>
              </List.Item>
            )}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="chat-input"
        style={{ display: "flex", gap: 8, padding: 8 }}
      >
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Nhập tin nhắn..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!messageInput.trim()}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
