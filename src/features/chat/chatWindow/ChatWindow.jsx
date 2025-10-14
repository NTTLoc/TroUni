import React, { useEffect, useState, useRef, useCallback } from "react";
import { Input, Button, Spin } from "antd";
import { SendOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import MessageBubble from "../messageBubble/MessageBubble";
import { getChatHistoryApi } from "../../../services/chatApi";
import { useChatRoom } from "../../../hooks/useChatRoom";

const ChatWindow = ({ chat, currentUser }) => {
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [reconnectKey, setReconnectKey] = useState(0);

  const { messages, sendChatMessage, addHistoryMessage, resetMessages } =
    useChatRoom(chat?.id, currentUser?.id, reconnectKey);

  // Load chat history khi chat thay đổi hoặc khi remount
  const loadHistory = useCallback(async () => {
    if (!chat?.id) return;

    resetMessages();
    setLoading(true);

    try {
      const res = await getChatHistoryApi(chat.id);
      const history = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data || [];

      history.forEach((msg) => addHistoryMessage(msg));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [chat?.id, addHistoryMessage, resetMessages]);

  // Khi quay lại từ VideoCall, force reconnect WebSocket
  useEffect(() => {
    if (location.state?.fromCall) {
      setReconnectKey(Date.now());
      loadHistory();
    }
  }, [location.state?.fromCall, loadHistory]);

  // Auto scroll khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = () => {
    if (!messageInput.trim()) return;
    sendChatMessage(messageInput.trim());
    setMessageInput("");
  };

  // Gọi video
  const handleVideoCall = () => {
    if (!chat?.id) return;
    const callerName = currentUser?.username || "Người dùng";

    // Gửi thông báo video call
    sendChatMessage(`${callerName} đang yêu cầu video call.`);

    // Điều hướng sang video call và đánh dấu fromChat để có thể remount khi quay lại
    navigate(`/call?roomId=${chat.id}&name=${encodeURIComponent(callerName)}`, {
      state: { fromChat: true },
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        {chat?.name}
        <Button
          type="default"
          icon={<VideoCameraOutlined />}
          onClick={handleVideoCall}
          style={{ float: "right" }}
        />
      </div>

      <div className="chat-messages">
        {loading ? (
          <Spin tip="Đang tải tin nhắn..." style={{ marginTop: 20 }} />
        ) : messages.length === 0 ? (
          <div className="chat-empty">Chưa có tin nhắn nào</div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.messageId}
              message={msg}
              currentUser={currentUser}
              chat={chat}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
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
