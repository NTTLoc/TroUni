import React, { useState, useEffect } from "react";
import "./PostList.scss";
import PostCard from "../postCard/PostCard";
import RoomCard from "../roomCard/RoomCard";
import dummyPosts from "../../../utils/mockData";
import { getAllRoomsApi } from "../../../services/roomApi";
import { Spin, Empty } from "antd";

const PostList = ({ activeTab = "all" }) => {
  const [posts, setPosts] = useState(dummyPosts);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rooms trực tiếp từ API
  useEffect(() => {
    const loadRooms = async () => {
      if (activeTab === "all" || activeTab === "rooms") {
        try {
          setLoading(true);
          setError(null);
          console.log("🔄 PostList: Loading rooms for tab:", activeTab);
          
          // Gọi API trực tiếp
          const response = await getAllRoomsApi({ page: 0, size: 10 });
          
          console.log("📡 PostList: API response:", response);
          const roomsData = response?.data?.content || [];
          console.log("📦 PostList: Rooms data:", roomsData);
          
          setRooms(roomsData);
        } catch (err) {
          console.error("❌ PostList: Error loading rooms:", err);
          setError("Không thể tải danh sách phòng trọ");
        } finally {
          setLoading(false);
        }
      }
    };

    loadRooms();
  }, [activeTab]);

  // Filter data based on active tab
  const getDisplayData = () => {
    switch (activeTab) {
      case "all":
        return {
          posts: posts,
          rooms: rooms
        };
      case "personal":
        return {
          posts: posts.filter(post => post.owner?.name === "Cá nhân"),
          rooms: rooms.filter(room => room.status === "available")
        };
      case "agent":
        return {
          posts: posts.filter(post => post.owner?.name !== "Cá nhân"),
          rooms: rooms.filter(room => room.status === "rented")
        };
      case "rooms":
        return {
          posts: [],
          rooms: rooms
        };
      default:
        return {
          posts: posts,
          rooms: rooms
        };
    }
  };

  const { posts: filteredPosts, rooms: filteredRooms } = getDisplayData();

  // Debug: Log current state
  console.log("🔍 PostList: Current rooms state:", rooms);
  console.log("🔍 PostList: Rooms length:", rooms?.length);
  console.log("🔍 PostList: Filtered rooms:", filteredRooms);
  console.log("🔍 PostList: Filtered rooms length:", filteredRooms?.length);
  console.log("🔍 PostList: Active tab:", activeTab);

  if (loading) {
    return (
      <div className="post-list-loading">
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list-error">
        <Empty description={error} />
      </div>
    );
  }

  const hasData = filteredPosts.length > 0 || filteredRooms.length > 0;

  if (!hasData) {
    return (
      <div className="post-list-empty">
        <Empty description="Không có dữ liệu để hiển thị" />
      </div>
    );
  }

  return (
    <div className="post-list">
      {/* Debug info */}
      <div style={{ padding: "10px", background: "#f0f0f0", marginBottom: "10px" }}>
        <strong>Debug Info:</strong><br/>
        Posts: {filteredPosts.length} | Rooms: {filteredRooms.length} | Tab: {activeTab}
      </div>
      
      {/* Hiển thị posts */}
      {filteredPosts.map((post) => (
        <PostCard key={`post-${post.id}`} post={post} />
      ))}
      
      {/* Hiển thị rooms */}
      {filteredRooms.map((room) => {
        console.log("🎨 Rendering RoomCard for room:", room);
        return <RoomCard key={`room-${room.id}`} room={room} />;
      })}
    </div>
  );
};

export default PostList;
