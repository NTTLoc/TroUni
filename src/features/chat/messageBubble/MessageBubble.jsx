import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./MessageBubble.scss";

const COUNTDOWN_SEC = 5;

const MessageBubble = ({ message, currentUser, chat }) => {
  const isMine = message.sender === "mine";
  const navigate = useNavigate();
  const name = currentUser?.username || "Người dùng";
  const roomId = chat?.id;

  const [countdown, setCountdown] = useState(0);

  // ✅ Kết hợp isCallRequest và text check
  const isCallInvite =
    message.isCallRequest ||
    (message.text &&
      (message.text.includes("yêu cầu video call") ||
        message.text.includes("đang yêu cầu video call")));

  const handleJoinCall = () => {
    if (countdown > 0) return;
    navigate(`/call?roomId=${roomId}&name=${encodeURIComponent(name)}`, {
      state: { fromChat: true },
    });
  };

  // ✅ Countdown cho call invite
  useEffect(() => {
    if (!isCallInvite) return;

    setCountdown(COUNTDOWN_SEC);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCallInvite, message.messageId]);

  return (
    <div className={`chat-bubble ${isMine ? "mine" : "theirs"}`}>
      <div className="bubble-text">
        {message.text}

        {isCallInvite && (
          <div style={{ marginTop: 8 }}>
            <Button
              type={isMine ? "default" : "primary"}
              size="small"
              onClick={handleJoinCall}
              disabled={countdown > 0}
            >
              {countdown > 0
                ? `Vui lòng chờ ${countdown}s`
                : isMine
                ? "Quay lại cuộc gọi"
                : "Tham gia cuộc gọi"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
