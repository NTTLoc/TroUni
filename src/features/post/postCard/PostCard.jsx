import React from "react";
import "./PostCard.scss";
import { HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link to={`/posts/${post.id}`}>
      <div className="post-card">
        {/* Hình ảnh */}
        <div className="post-thumb">
          <img src={post.thumbnailUrl} alt={post.title} />
          {post.roomType && <span className="badge">{post.roomType}</span>}
        </div>

        {/* Nội dung */}
        <div className="post-info">
          <h3 className="title">{post.title}</h3>

          <div className="price-size">
            <span className="price">
              {Math.floor(post.price / 1000000)} Triệu/tháng
            </span>
            <span className="size">{post.area} m²</span>
          </div>

          <p className="location">{post.address}</p>
        </div>

        {/* Nút yêu thích */}
        <div className="post-action">
          <HeartOutlined />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
