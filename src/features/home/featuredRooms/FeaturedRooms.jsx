import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin, Empty, Card, Typography } from "antd";
import {
  BorderOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import { path } from "../../../utils/constants";
import { getAllRoomsSimpleApi } from "../../../services/postApi";
import { assets } from "../../../assets/assets";
import "./FeaturedRooms.scss";

const { Title, Paragraph, Text } = Typography;

const FeaturedRooms = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRoomsSimpleApi()
      .then((res) => setPosts(res?.data?.slice(0, 4) || []))
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );

  if (!posts.length)
    return <Empty description="Không có phòng trọ nổi bật nào" />;

  return (
    <section className="rooms">
      <div className="header">
        <h2>Phòng trọ nổi bật</h2>
        <Link to={path.POST} className="view-all">
          Xem tất cả →
        </Link>
      </div>

      <div className="room-grid">
        {posts.map((room) => (
          <Card
            key={room.id}
            className="room-card"
            hoverable
            cover={
              <div className="room-image-container">
                <img
                  src={
                    room.thumbnailUrl || room.image || assets.roomPlaceholder
                  }
                  alt={room.title}
                  className="room-image"
                  onError={(e) =>
                    (e.currentTarget.src = assets.roomPlaceholder)
                  }
                />
                {room.isPriority && (
                  <div className="badges">
                    <div className="verified">
                      <StarFilled
                        style={{ color: "#fadb14", marginRight: 4 }}
                      />
                      Đã xác minh
                    </div>
                  </div>
                )}
                <div className="price">
                  {room.price
                    ? `${room.price.toLocaleString("vi-VN")} đ/tháng`
                    : "Liên hệ"}
                </div>
              </div>
            }
          >
            <Title level={5} className="room-title">
              {room.title || "Phòng trọ chưa có tiêu đề"}
            </Title>

            {/* <Paragraph ellipsis={{ rows: 2 }}>
              {room.description || "Chưa có mô tả"}
            </Paragraph> */}

            <div className="room-meta">
              <Text className="meta-row">
                <BorderOutlined className="meta-icon" />
                <span className="meta-text">{room.area || 0} m²</span>
              </Text>

              <Text className="meta-row">
                <EnvironmentOutlined className="meta-icon" />
                <span className="meta-text">{room.address}</span>
              </Text>
            </div>

            <div className="owner-info">
              <img
                src={room.owner?.avatar || assets.avatar}
                alt={room.owner?.name || "Chủ trọ"}
                className="owner-avatar"
                onError={(e) => (e.currentTarget.src = assets.avatar)}
              />
              <div>
                <p className="owner-name">{room.owner?.name || "Chủ trọ"}</p>
                <p className="owner-posts">{room.owner?.posts || 0} tin đăng</p>
              </div>
            </div>

            <Link to={`/posts/${room.id}`} className="detail-btn">
              Xem chi tiết
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRooms;
