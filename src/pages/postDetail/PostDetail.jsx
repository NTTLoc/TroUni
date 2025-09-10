import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import "./PostDetail.scss";

// Dữ liệu mẫu giống PostList
const posts = [
  {
    id: "1",
    title: "Phòng trọ gần ĐH Bách Khoa",
    location: "Quận 10, TP.HCM",
    price: "2.000.000",
    description: "Phòng mới xây, gần trường, có máy lạnh và wifi miễn phí.",
    image: "https://via.placeholder.com/600x400",
  },
  {
    id: "2",
    title: "Chung cư mini tiện nghi",
    location: "Thủ Đức, TP.HCM",
    price: "3.500.000",
    description: "Phòng đầy đủ nội thất, có chỗ giữ xe, bảo vệ 24/7.",
    image: "https://via.placeholder.com/600x400",
  },
];

const PostDetail = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) return <div>Không tìm thấy bài đăng.</div>;

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content post-detail">
        <div className="post-detail__container">
          <h2>{post.title}</h2>
          <img src={post.image} alt={post.title} />
          <p>
            <strong>Vị trí:</strong> {post.location}
          </p>
          <p>
            <strong>Giá:</strong> {post.price} VNĐ / tháng
          </p>
          <p>{post.description}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
