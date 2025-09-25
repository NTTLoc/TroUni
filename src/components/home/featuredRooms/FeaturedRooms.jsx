import React from "react";
import { Link } from "react-router-dom";
import dummyPosts from "../../../utils/mockData";
import { path } from "../../../utils/constants";
import { StarFilled } from "@ant-design/icons";

const FeaturedRooms = () => {
  const featuredPosts = dummyPosts.filter((p) => p.isPriority).slice(0, 4);

  return (
    <section className="rooms">
      <div className="header">
        <h2>Phòng trọ nổi bật</h2>
        <Link to={path.POST} className="view-all">
          Xem tất cả →
        </Link>
      </div>

      <div className="room-grid">
        {featuredPosts.map((room) => (
          <div className="room-card" key={room.id}>
            {/* Ảnh phòng */}
            <div className="room-image-container">
              <img src={room.image} alt={room.title} className="room-image" />
              {room.isPriority && (
                <div className="badges">
                  <div className="verified">Đã xác minh</div>
                </div>
              )}
              <div className="price">{room.price}</div>
            </div>

            {/* Tiêu đề */}
            <h3 className="room-title">{room.title}</h3>

            {/* Thông tin mô tả */}
            <p className="room-desc">{room.description}...</p>

            {/* Meta info */}
            <div className="room-meta">
              <span className="size">{room.size} m²</span>
              <span className="location">{room.location}</span>
            </div>

            {/* Chủ trọ */}
            <div className="owner-info">
              <img
                src={room.owner.avatar}
                alt={room.owner.name}
                className="owner-avatar"
              />
              <div>
                <p className="owner-name">{room.owner.name}</p>
                <p className="owner-posts">{room.owner.posts} tin đăng</p>
              </div>
            </div>

            {/* Button */}
            <Link to={`/posts/${room.id}`} className="detail-btn">
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRooms;
