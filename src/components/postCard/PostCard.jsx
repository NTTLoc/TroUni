import React from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.scss";
import { path } from "../../utils/constants";
import moment from "moment";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${path.DETAIL.replace(":id", post.id)}`);
  };

  return (
    <div className="post-card" onClick={handleClick}>
      <div className="post-card__image">
        <img src={post.image || "/default-room.jpg"} alt="post" />
      </div>

      <div className="post-card__info">
        <h3 className="post-card__title">{post.title}</h3>
        <div className="post-card__price">{post.price} đ/tháng</div>
        <p className="post-card__location">📍 {post.city || "Không rõ"}</p>
        <div className="post-card__meta">
          <span>📐 {post.area} m²</span>
          <span>🕒 {moment(post.createdAt).fromNow()}</span>
        </div>

        <div className="post-card__user">
          <img src="/default-avatar.png" alt="avatar" className="user-avatar" />
          <div className="user-info">
            <p className="user-name"></p>
            <p className="user-stats"> tin đăng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
