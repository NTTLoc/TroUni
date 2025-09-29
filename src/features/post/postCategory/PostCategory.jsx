import React from "react";
import "./PostCategory.scss";

const categories = [
  "Căn hộ/Chung cư",
  "Nhà ở",
  "Đất",
  "Văn phòng",
  "Phòng trọ",
];

const PostCategory = () => {
  return (
    <div className="post-category">
      {categories.map((c, i) => (
        <button key={i}>{c}</button>
      ))}
    </div>
  );
};

export default PostCategory;
