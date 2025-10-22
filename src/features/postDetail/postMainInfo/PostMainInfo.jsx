import React, { useState } from "react";
import { timeAgoFormat } from "../../../utils/timeAgoFormat";
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import GoongMapModal from "../../../components/map/GoongMapModal";
import "./PostMainInfo.scss";

const PostMainInfo = ({ post }) => {
  const [mapModalVisible, setMapModalVisible] = useState(false);

  // Handle click vào địa chỉ
  const handleAddressClick = () => {
    if (post.latitude && post.longitude) {
      setMapModalVisible(true);
    }
  };

  // Tạo địa chỉ đầy đủ
  const fullAddress = `${post.streetAddress}, Quận ${post.district}, ${post.ward}`;

  return (
    <div className="post-main">
      <h1>{post.title}</h1>

      <span className="post-main__middle">
        <p className="post-main__price">
          {Math.floor(post.pricePerMonth).toLocaleString("vi-VN")}/Tháng
        </p>
        <p className="post-main__size">{post.areaSqm} m²</p>
      </span>

      <p
        className={`post-main__location ${
          post.latitude && post.longitude ? "clickable-address" : ""
        }`}
        onClick={handleAddressClick}
        title={
          post.latitude && post.longitude ? "Click để xem trên bản đồ" : ""
        }
      >
        <EnvironmentOutlined />
        {fullAddress}
      </p>

      <p className="post-main__time">
        <ClockCircleOutlined />
        Cập nhật lần cuối: {timeAgoFormat(post.createdAt)}
      </p>

      {/* Map Modal */}
      {post.latitude && post.longitude && (
        <GoongMapModal
          visible={mapModalVisible}
          onClose={() => setMapModalVisible(false)}
          latitude={parseFloat(post.latitude)}
          longitude={parseFloat(post.longitude)}
          address={fullAddress}
          title={post.title}
        />
      )}
    </div>
  );
};

export default PostMainInfo;
