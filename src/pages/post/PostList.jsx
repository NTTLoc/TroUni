import React, { useEffect, useState } from "react";
import "./PostList.scss";
import PostCard from "../../components/postCard/PostCard";
import { assets } from "../../assets/assets.js";

// Mock data giả lập
const mockPosts = [
  {
    id: 1,
    image: assets.featuresImg,
    title: "Phòng trọ gần ĐH Bách Khoa",
    city: "Quận 10",
    area: "10",
    price: 2500000,
  },
  { id: 2, title: "Căn hộ mini Quận 3", area: "Quận 3", price: 3500000 },
  {
    id: 3,
    title: "Phòng giá rẻ gần ĐH Kinh Tế",
    city: "Quận 5",
    area: "50",
    price: 2000000,
  },
];

const PostList = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [filterArea, setFilterArea] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  const areas = [...new Set(mockPosts.map((p) => p.area))];

  const handleFilter = () => {
    let filtered = mockPosts;
    if (filterArea) filtered = filtered.filter((p) => p.area === filterArea);
    if (filterPrice === "low")
      filtered = filtered.filter((p) => p.price < 3000000);
    if (filterPrice === "high")
      filtered = filtered.filter((p) => p.price >= 3000000);
    setPosts(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [filterArea, filterPrice]);

  return (
    <main className="page-content postlist-page">
      <div className="postlist-container">
        <h1>Danh sách trọ</h1>
        <p className="post-count">Có {posts.length} tin đăng phù hợp</p>

        <div className="filters">
          <select
            onChange={(e) => setFilterArea(e.target.value)}
            value={filterArea}
          >
            <option value="">-- Chọn khu vực --</option>
            {areas.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setFilterPrice(e.target.value)}
            value={filterPrice}
          >
            <option value="">-- Chọn mức giá --</option>
            <option value="low">Dưới 3 triệu</option>
            <option value="high">Trên 3 triệu</option>
          </select>
        </div>

        <div className="postlist-cards">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PostList;
