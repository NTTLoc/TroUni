import React from "react";
import "./PostMainInfo.scss";

const PostMainInfo = ({ post }) => {
  return (
    <div className="post-main">
      <h1>{post.title}</h1>

      <span className="post-main__middle">
        <p className="post-main__price">
          {Math.floor(post.pricePerMonth / 1000000)} Triệu/tháng
        </p>
        <p className="post-main__size">{post.areaSqm} m²</p>
      </span>
      <p className="post-main__location">
        📍 {post.streetAddress}, Quận {post.district}, {post.ward}
      </p>
      <p className="post-main__time">Cập nhật {post.updatedAt}</p>
    </div>
  );
};

export default PostMainInfo;
