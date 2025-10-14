import React from "react";
import "./PostOwner.scss";
import { useNavigate } from "react-router-dom";
import { path } from "../../../utils/constants";
import { assets } from "../../../assets/assets.js";
import { createChatRoomApi } from "../../../services/chatApi";
import { message } from "antd";

const PostOwner = ({ owner }) => {
  const navigate = useNavigate();

  const handleChat = async () => {
    if (!owner?.id) return;

    try {
      // Gọi API tạo hoặc lấy chat room
      const res = await createChatRoomApi(owner.id);
      const chatRoom = res?.data?.id;
      console.log(chatRoom);

      // Chuẩn hóa dữ liệu chatTarget cho FE
      const chatTarget = {
        id: chatRoom,
        name: owner.username,
        avatar: owner?.profile?.avatarUrl || assets.avatar,
        userId: owner.id, // giữ để ChatWindow có thể gọi video call
      };

      // Chuyển sang trang Chat, **không dùng spread**
      navigate(path.CHAT, { state: { chatTarget } });
    } catch (err) {
      console.error("Không thể tạo hoặc lấy chat room:", err);
      message.error("Không thể tạo cuộc trò chuyện. Vui lòng thử lại!");
    }
  };

  return (
    <div className="post-owner">
      <div className="info">
        <img
          src={owner?.profile?.avatarUrl || assets.avatar}
          alt={owner?.username || "Chủ trọ"}
          className="avatar"
        />
        <div className="info__details">
          <h4>{owner?.username}</h4>
        </div>
      </div>

      <div className="btn">
        <button className="btn__chat" onClick={handleChat}>
          Chat
        </button>
      </div>
    </div>
  );
};

export default PostOwner;
