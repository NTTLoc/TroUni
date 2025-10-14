import { useEffect, useRef, useState, useCallback } from "react";
import {
  connectWebSocket,
  subscribeRoom,
  sendMessage as sendMessageApi,
} from "../services/chatApi";

export const useChatRoom = (chatId, currentUserId, forceReconnect = 0) => {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  // 🔹 Nhận tin nhắn từ server
  const handleServerMessage = useCallback(
    (msg) => {
      if (!chatId || String(msg.chatRoomId) !== String(chatId)) return;

      const serverMsg = {
        messageId: msg.messageId || msg.timestamp || Date.now(),
        text: msg.content,
        sender: msg.senderId === currentUserId ? "mine" : "theirs",
        isCallRequest: msg.isCallRequest || false,
      };

      setMessages((prev) => {
        // ❌ Check messageId trùng để tránh double
        if (prev.some((m) => m.messageId === serverMsg.messageId)) return prev;

        // ❌ Cập nhật tin nhắn tạm nếu trùng
        const index = prev.findIndex(
          (m) => m.isTemp && m.text === serverMsg.text && m.sender === "mine"
        );
        if (index !== -1) {
          const copy = [...prev];
          copy[index] = serverMsg;
          return copy;
        }

        return [...prev, serverMsg];
      });
    },
    [chatId, currentUserId]
  );

  // 🔹 Setup WebSocket
  const setupWebSocket = useCallback(() => {
    if (!chatId || !currentUserId) return;

    // Cleanup socket cũ
    if (wsRef.current) {
      if (typeof wsRef.current.close === "function") wsRef.current.close();
      else if (typeof wsRef.current.disconnect === "function")
        wsRef.current.disconnect();
      wsRef.current = null;
    }

    const wsInstance = connectWebSocket(currentUserId);
    wsRef.current = wsInstance;

    // Subscribe room với callback
    subscribeRoom(chatId, handleServerMessage, wsInstance);

    // Auto-reconnect nếu server đóng
    const originalOnClose = wsInstance.onclose;
    wsInstance.onclose = (ev) => {
      console.log("WebSocket closed, reconnecting...");
      originalOnClose?.(ev);
      setTimeout(() => setupWebSocket(), 1000);
    };
  }, [chatId, currentUserId, handleServerMessage]);

  // 🔹 Effect chính
  useEffect(() => {
    setupWebSocket();

    return () => {
      if (wsRef.current) {
        if (typeof wsRef.current.close === "function") wsRef.current.close();
        else if (typeof wsRef.current.disconnect === "function")
          wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, [setupWebSocket, forceReconnect]); // forceReconnect giúp remount khi quay lại chat

  // 🔹 Gửi tin nhắn
  const sendChatMessage = useCallback(
    (text) => {
      if (!text?.trim() || !chatId) return;

      const tempMessage = {
        text,
        sender: "mine",
        messageId: `temp-${Date.now()}`,
        isTemp: true,
      };
      setMessages((prev) => [...prev, tempMessage]);

      sendMessageApi(chatId, text);
    },
    [chatId]
  );

  // 🔹 Thêm tin nhắn lịch sử
  const addHistoryMessage = useCallback(
    (msg) => {
      if (!msg) return;

      const historyMsg = {
        messageId: msg.messageId || msg.timestamp || Date.now(),
        text: msg.content,
        sender: msg.senderId === currentUserId ? "mine" : "theirs",
        isCallRequest: msg.isCallRequest || false,
      };

      setMessages((prev) => {
        if (prev.some((m) => m.messageId === historyMsg.messageId)) return prev;
        return [...prev, historyMsg];
      });
    },
    [currentUserId]
  );

  const resetMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    sendChatMessage,
    addHistoryMessage,
    resetMessages,
  };
};
