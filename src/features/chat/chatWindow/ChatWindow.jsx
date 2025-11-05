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
import dayjs from "dayjs";

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

  // 🟢 Load lịch sử chat
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

  // 🔁 Reconnect khi quay lại từ video call
  useEffect(() => {
    if (location.state?.fromCall) {
      setReconnectKey(Date.now());
      loadHistory();
    }
  }, [location.state?.fromCall, loadHistory]);

  // 🔽 Auto scroll khi có tin nhắn mới
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

  // ✅ Auto scroll khi load xong lịch sử (khi reload)
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [loading, messages]);

  // 🖱️ Theo dõi cuộn
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

  // ✉️ Gửi tin nhắn
  const handleSend = () => {
    if (!messageInput.trim()) return;
    sendChatMessage(messageInput.trim());
    setMessageInput("");

    // 🔽 Auto scroll ngay khi gửi tin
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 📹 Gọi video
  const handleVideoCall = () => {
    if (!chat?.id) return;
    const callerName = currentUser?.username || "Người dùng";
    sendChatMessage(`${callerName} đang yêu cầu video call.`);
    navigate(`/call?roomId=${chat.id}&name=${encodeURIComponent(callerName)}`, {
      state: { fromChat: true },
    });
  };

  // 🕒 Render nhóm tin nhắn kiểu Messenger
  const renderMessagesWithTimestamps = () => {
    return messages.map((msg, index) => {
      const msgTime = dayjs(msg.timestamp);
      const isToday = msgTime.isSame(dayjs(), "day");

      // Tin nhắn trước đó (nếu có)
      const prevMsg = index > 0 ? messages[index - 1] : null;
      const prevTime = prevMsg ? dayjs(prevMsg.timestamp) : null;

      let showTimestamp = false;

      if (!prevMsg) {
        // Tin đầu tiên => hiển thị
        showTimestamp = true;
      } else {
        const diffMinutes = msgTime.diff(prevTime, "minute");

        // khác ngày => hiển thị ngày
        if (!msgTime.isSame(prevTime, "day")) showTimestamp = true;
        // cùng ngày, cách nhau >= 5 phút => hiển thị giờ mới
        else if (diffMinutes >= 5) showTimestamp = true;
      }

      let timestampLabel = "";
      if (showTimestamp) {
        timestampLabel = isToday
          ? msgTime.format("HH:mm")
          : msgTime.format("DD/MM/YYYY");
      }

      return (
        <React.Fragment key={msg.messageId}>
          {showTimestamp && (
            <div
              className="timestamp-label"
              style={{
                textAlign: "center",
                color: "#999",
                fontSize: "12px",
                margin: "10px 0",
              }}
            >
              {timestampLabel}
            </div>
          )}
          <MessageBubble message={msg} currentUser={currentUser} chat={chat} />
        </React.Fragment>
      );
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
          renderMessagesWithTimestamps()
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
