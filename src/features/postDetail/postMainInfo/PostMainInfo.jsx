import React from "react";
import "./PostMainInfo.scss";

const PostMainInfo = ({ post }) => {
  return (
    <div className="post-main">
      <h1>{post.title}</h1>
      <p className="post-main__desc">{post.description}</p>
      <span className="post-main__middle">
        <p className="post-main__price">{post.price}</p>
        <p className="post-main__size">{post.size} m²</p>
      </span>
      <p className="post-main__location">📍 {post.location}</p>
      <p className="post-main__time">Cập nhật {post.updatedAt}</p>
    </div>
  );
};

export default PostMainInfo;
