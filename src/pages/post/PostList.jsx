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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
    setCurrentPage(1);
  }, [filterArea, filterPrice]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

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

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={3}>3 / trang</option>
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
          </select>
        </div>

        <div className="postlist-cards">
          {paginatedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPageSafe === 1}>
            ← Trước
          </button>
          <span className="page-info">
            Trang {currentPageSafe}/{totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPageSafe === totalPages}
          >
            Sau →
          </button>
        </div>
      </div>
    </main>
  );
};

export default PostList;
