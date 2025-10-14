const SIGNALING_SERVER =
  "wss://video3-dot-trouni-473709.de.r.appspot.com/socket";
let callSocket = null;
let onOpenQueue = [];

/**
 * 🔌 Kết nối WebSocket gọi video
 * @param {function} onMessage - callback khi nhận tín hiệu
 */
export const connectCallSocket = (onMessage) => {
  if (callSocket && callSocket.readyState === WebSocket.OPEN) {
    console.log("⚡ Call WebSocket already connected");
    return;
  }

  callSocket = new WebSocket(SIGNALING_SERVER);

  callSocket.onopen = () => {
    console.log("✅ Connected to signaling server");
    // gửi tất cả tín hiệu đang chờ
    onOpenQueue.forEach((fn) => fn());
    onOpenQueue = [];
  };

  callSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📩 Received call signal:", data);
      onMessage?.(data);
    } catch (error) {
      console.error("⚠️ Failed to parse signaling message:", error);
    }
  };

  callSocket.onerror = (error) =>
    console.error("❌ Signaling socket error:", error);
  callSocket.onclose = () =>
    console.log("🔌 Disconnected from signaling server");
};

/**
 * 📞 Gửi tín hiệu gọi, tự động queue nếu socket chưa kết nối
 */
export const sendCallSignal = (callData) => {
  const sendFn = () => {
    console.log("📡 Sending call signal:", callData);
    callSocket.send(JSON.stringify(callData));
  };

  if (!callSocket || callSocket.readyState !== WebSocket.OPEN) {
    console.warn("⚠️ Socket chưa sẵn sàng, sẽ gửi sau khi kết nối");
    onOpenQueue.push(sendFn);
    return;
  }

  sendFn();
};

/**
 * 🛑 Kết thúc cuộc gọi
 */
export const endCallSignal = (roomId, from, to) => {
  const sendFn = () => {
    const data = { type: "call-ended", from, to, roomId };
    console.log("📴 Sending end call signal:", data);
    callSocket.send(JSON.stringify(data));
  };

  if (!callSocket || callSocket.readyState !== WebSocket.OPEN) {
    console.warn("⚠️ Socket chưa sẵn sàng, sẽ gửi endCall sau khi kết nối");
    onOpenQueue.push(sendFn);
    return;
  }

  sendFn();
};

/**
 * ❎ Ngắt kết nối WebSocket
 */
export const disconnectCallSocket = () => {
  if (callSocket) {
    callSocket.close();
    callSocket = null;
    onOpenQueue = [];
    console.log("🔌 Call WebSocket manually disconnected");
  }
};
