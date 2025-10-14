import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "../utils/axios.customize";

const SOCKET_URL = "http://localhost:8080/ws";
let stompClient = null;
let isConnected = false;
let roomCallbacks = new Map(); // roomId => callback

const connectWebSocket = (userId, onUserMessageReceived) => {
  if (!userId) return;

  if (stompClient && isConnected) return stompClient;

  const token = localStorage.getItem("access_token");
  if (!token) return;

  const socket = new SockJS(SOCKET_URL);

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    debug: (str) => console.log("[STOMP]", str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    isConnected = true;
    console.log("✅ WebSocket connected");

    // Subscribe private messages
    stompClient.subscribe(`/user/${userId}/queue/messages`, (msg) => {
      if (msg.body) {
        try {
          const data = JSON.parse(msg.body);
          onUserMessageReceived?.(data);
        } catch {}
      }
    });

    // Subscribe all rooms
    roomCallbacks.forEach((cb, roomId) => {
      subscribeRoom(roomId, cb, true);
    });
  };

  stompClient.onDisconnect = () => {
    isConnected = false;
    console.log("⚠️ WebSocket disconnected");
  };

  stompClient.activate();
  return stompClient;
};

const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    roomCallbacks.clear();
  }
};

const sendMessage = (roomId, content) => {
  if (!roomId || !content || !stompClient || !isConnected) return;

  stompClient.publish({
    destination: "/app/chat.sendMessage",
    body: JSON.stringify({ chatRoomId: roomId, content, type: "chat-message" }),
  });
};

const subscribeRoom = (roomId, callback, force = false) => {
  if (!stompClient || !isConnected) {
    roomCallbacks.set(roomId, callback);
    return;
  }

  if (!force && stompClient.subscriptions?.[roomId]) return;

  const sub = stompClient.subscribe(`/topic/chatRoom/${roomId}`, (msg) => {
    if (msg.body) {
      try {
        const data = JSON.parse(msg.body);
        callback?.(data);
      } catch {}
    }
  });

  if (!stompClient.subscriptions) stompClient.subscriptions = {};
  stompClient.subscriptions[roomId] = sub;
  roomCallbacks.set(roomId, callback);
};

/** ================================
 * REST API
 * ================================ */

// Tạo phòng mới hoặc lấy phòng đã có
const createChatRoomApi = (recipientId) => {
  const URL_API = "/chat/room";
  return axios.post(URL_API, { recipientId });
};

// Lấy lịch sử chat theo roomId
const getChatHistoryApi = (roomId) => {
  const URL_API = `/chat/${roomId}/history`;
  return axios.get(URL_API);
};

// Lấy tất cả chat rooms của user
const getChatRoomsByUserApi = (userId) => {
  const URL_API = `/chat/user/${userId}/rooms`;
  return axios.get(URL_API);
};

export {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  subscribeRoom,
  createChatRoomApi,
  getChatHistoryApi,
  getChatRoomsByUserApi,
};
