import React from "react";
import "./RoomCard.scss";
import { HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { formatPrice, formatArea } from "../../../utils/roomConstants";

const RoomCard = ({ room }) => {
  // Debug: Log room data
  console.log("🎨 RoomCard: Rendering room:", room);
  console.log("🎨 RoomCard: Room images:", room.images);
  console.log("🎨 RoomCard: Room image:", room.image);

  // Format dữ liệu để hiển thị
  const formatLocation = () => {
    const parts = [];
    if (room.ward) parts.push(room.ward);
    if (room.district) parts.push(room.district);
    if (room.city) parts.push(room.city);
    const location = parts.join(", ");
    console.log("📍 RoomCard: Formatted location:", location);
    return location;
  };

  const getPrimaryImage = () => {
    // Thử nhiều cách để lấy image
    if (room.image) {
      console.log("🖼️ RoomCard: Using room.image:", room.image);
      return room.image;
    }

    if (room.images && room.images.length > 0) {
      const primaryImage = room.images.find((img) => img.isPrimary);
      const imageUrl = primaryImage
        ? primaryImage.imageUrl
        : room.images[0].imageUrl;
      console.log("🖼️ RoomCard: Using room.images:", imageUrl);
      return imageUrl;
    }

    // Fallback image
    console.log("🖼️ RoomCard: Using fallback image");
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  const getRoomTypeLabel = () => {
    const typeMap = {
      PHONG_TRO: "Phòng trọ",
      APARTMENT: "Căn hộ",
      HOUSE: "Nhà ở",
    };
    const label = typeMap[room.roomType] || room.roomType || "Không xác định";
    console.log("🏠 RoomCard: Room type label:", label);
    return label;
  };

  const getStatusLabel = () => {
    const statusMap = {
      available: "Còn trống",
      rented: "Đã thuê",
      maintenance: "Bảo trì",
    };
    const label = statusMap[room.status] || room.status || "Không xác định";
    console.log("📊 RoomCard: Status label:", label);
    return label;
  };

  // Debug: Check if room has required fields
  if (!room) {
    console.error("❌ RoomCard: No room data provided");
    return <div>No room data</div>;
  }

  if (!room.id) {
    console.error("❌ RoomCard: Room missing ID:", room);
    return <div>Room missing ID</div>;
  }

  console.log("✅ RoomCard: Rendering room with ID:", room.id);

  return (
    <Link to={`/rooms/${room.id}`}>
      <div className="room-card">
        {/* Hình ảnh */}
        <div className="room-thumb">
          <img
            src={getPrimaryImage()}
            alt={room.title || "Room image"}
            onError={(e) => {
              console.error("❌ RoomCard: Image load error:", e.target.src);
              e.target.src =
                "https://via.placeholder.com/300x200?text=Image+Error";
            }}
            onLoad={() => console.log("✅ RoomCard: Image loaded successfully")}
          />
          {room.status === "available" && (
            <span className="badge available">Còn trống</span>
          )}
          {room.status === "rented" && (
            <span className="badge rented">Đã thuê</span>
          )}
          {room.status === "maintenance" && (
            <span className="badge maintenance">Bảo trì</span>
          )}
          {!room.status && <span className="badge available">Còn trống</span>}
          {room.images && room.images.length > 0 && (
            <span className="img-count">{room.images.length} ảnh</span>
          )}
        </div>

        {/* Nội dung */}
        <div className="room-info">
          <h3 className="title">{room.title || "Không có tiêu đề"}</h3>
          <p className="desc">{room.description || "Không có mô tả"}</p>

          <div className="room-type">
            <span className="type">{getRoomTypeLabel()}</span>
            <span className="status">{getStatusLabel()}</span>
          </div>

          <div className="price-size">
            <span className="price">
              {formatPrice(room.pricePerMonth || 0)}
            </span>
            {room.areaSqm && (
              <span className="size">{formatArea(room.areaSqm)}</span>
            )}
          </div>

          <p className="location">{formatLocation() || "Không có địa chỉ"}</p>

          <div className="owner">
            <div className="owner-info">
              <span className="owner-name">Chủ trọ</span>
              <span className="post-date">
                {room.createdAt
                  ? new Date(room.createdAt).toLocaleDateString("vi-VN")
                  : "Không có ngày"}
              </span>
            </div>
          </div>
        </div>

        {/* Nút yêu thích */}
        <div className="room-action">
          <HeartOutlined />
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
