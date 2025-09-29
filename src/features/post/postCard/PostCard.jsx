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
          <img src={post.image} alt={post.title} />
          {post.isPriority && <span className="badge">Tin ưu tiên</span>}
          {post.images && post.images.length > 0 && (
            <span className="img-count">{post.images.length} ảnh</span>
          )}
        </div>

        {/* Nội dung */}
        <div className="post-info">
          <h3 className="title">{post.title}</h3>
          <p className="desc">{post.description}</p>

          <div className="price-size">
            <span className="price">{post.price}</span>
            <span className="size">{post.size} m²</span>
          </div>

          <p className="location">{post.location}</p>

          <div className="owner">
            <img src={post.owner.avatar} alt={post.owner.name} />
            <span>{post.owner.name}</span>
            <span className="count">{post.owner.posts} tin đăng</span>
          </div>
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
