import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// URL của endpoint STOMP trên backend
const SOCKET_URL = "http://localhost:8080/ws";

let stompClient = null;

/**
 * Kết nối WebSocket cho user hiện tại
 * @param {string} userId - id của user đang đăng nhập
 * @param {function} onMessageReceived - callback khi nhận tin nhắn mới
 */
export const connectWebSocket = (userId, onMessageReceived) => {
  if (!userId)
    return console.error("❌ User ID is required to connect WebSocket");

  // Tạo SockJS
  const socket = new SockJS(SOCKET_URL);

  // Tạo STOMP client
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log("[STOMP]", str),
    reconnectDelay: 5000, // tự reconnect nếu bị ngắt
  });

  // Khi client kết nối
  stompClient.onConnect = () => {
    console.log("✅ WebSocket connected");

    // Subscribe kênh riêng cho user hiện tại
    stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
      if (message.body) {
        const msg = JSON.parse(message.body);
        onMessageReceived(msg);
      }
    });
  };

  // Khi kết nối lỗi
  stompClient.onStompError = (frame) => {
    console.error("❌ STOMP error:", frame.headers, frame.body);
  };

  stompClient.activate(); // Kích hoạt STOMP client
};

/**
 * Ngắt kết nối WebSocket
 */
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("🔌 Disconnected from WebSocket");
  }
};

/**
 * Gửi tin nhắn đến người nhận
 * @param {string} recipientId - id người nhận
 * @param {string} content - nội dung tin nhắn
 */
export const sendMessage = (recipientId, content) => {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({ recipientId, content }),
    });
  } else {
    console.error("⚠️ WebSocket chưa kết nối, không thể gửi tin nhắn.");
  }
};
