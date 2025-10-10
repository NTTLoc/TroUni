import React from "react";
import "./PostList.scss";
import PostCard from "../postCard/PostCard";
import { Spin, Empty } from "antd";

const PostList = ({ rooms = [], loading, activeTab }) => {
  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  // ✅ Lọc theo tab nếu cần (ví dụ: all, expired, approved, ...)
  const filteredRooms =
    activeTab === "all"
      ? rooms
      : rooms.filter((room) => room.status === activeTab);

  return (
    <div className="post-list">
      {filteredRooms.length > 0 ? (
        filteredRooms.map((room) => (
          <PostCard key={`room-${room.id}`} post={room} />
        ))
      ) : (
        <Empty description="Không có bài đăng nào" />
      )}
    </div>
  );
};

export default PostList;
