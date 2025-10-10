import React, { useEffect, useState } from "react";
import { timeAgoFormat } from "../../../utils/timeAgoFormat";
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
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
        <EnvironmentOutlined />
        {post.streetAddress}, Quận {post.district}, {post.ward}
      </p>

      <p className="post-main__time">
        <ClockCircleOutlined />
        Cập nhật lần cuối: {timeAgoFormat(post.createdAt)}
      </p>
    </div>
  );
};

export default PostMainInfo;
