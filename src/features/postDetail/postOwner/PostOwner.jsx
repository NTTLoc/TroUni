import React from "react";
import "./PostOwner.scss";
import { Link, useNavigate } from "react-router-dom"; // ✅ sửa import đúng package
import { path } from "../../../utils/constants";
import { assets } from "../../../assets/assets.js";

const PostOwner = ({ owner }) => {
  const navigate = useNavigate();

  const handleChat = () => {
    if (!owner?.id) return;
    // ✅ Chuyển sang trang chat, truyền id và name qua state
    navigate(path.CHAT, {
      state: {
        chatTarget: {
          id: owner.id,
          name: owner.username,
          avatar: owner?.profile?.avatarUrl || assets.avatar,
        },
      },
    });
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
        <button className="btn__call">Gọi ngay</button>
      </div>
    </div>
  );
};

export default PostOwner;
