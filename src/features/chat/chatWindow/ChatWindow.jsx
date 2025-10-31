import React, { useEffect, useState, useRef, useCallback } from "react";
import { Input, Button, Spin } from "antd";
import {
  SendOutlined,
  VideoCameraOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import MessageBubble from "../messageBubble/MessageBubble";
import { getChatHistoryApi } from "../../../services/chatApi";
import { useChatRoom } from "../../../hooks/useChatRoom";

const ChatWindow = ({ chat, currentUser }) => {
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [reconnectKey, setReconnectKey] = useState(0);

  const { messages, sendChatMessage, addHistoryMessage, resetMessages } =
    useChatRoom(chat?.id, currentUser?.id, reconnectKey);

  // Load lịch sử chat
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

  useEffect(() => {
    loadHistory();
  }, [chat?.id, loadHistory]);

  // Reconnect khi quay lại từ video call
  useEffect(() => {
    if (location.state?.fromCall) {
      setReconnectKey(Date.now());
      loadHistory();
    }
  }, [location.state?.fromCall, loadHistory]);

  // Auto scroll khi có tin nhắn mới (nếu người dùng đang ở gần cuối)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowScrollButton(true);
    }
  }, [messages]);

  // Theo dõi hành vi cuộn để hiện / ẩn nút “cuộn xuống”
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;
    setShowScrollButton(!nearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

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
    sendChatMessage(`${callerName} đang yêu cầu video call.`);
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

      <div
        className="chat-messages"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          position: "relative",
          height: "70vh",
        }}
      >
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

      {showScrollButton && (
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowDownOutlined />}
          onClick={scrollToBottom}
          className="scroll-to-bottom-btn"
          style={{
            position: "absolute",
            bottom: 80,
            right: 20,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />
      )}

      <div className="chat-input" style={{ display: "flex", padding: "10px" }}>
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
          style={{ marginLeft: 8 }}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
