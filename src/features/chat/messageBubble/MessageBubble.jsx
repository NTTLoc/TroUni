import React from "react";

const MessageBubble = ({ message }) => {
  return (
    <div
      className={`chat-bubble ${message.sender === "me" ? "mine" : "theirs"}`}
    >
      {message.text}
    </div>
  );
};

export default MessageBubble;
