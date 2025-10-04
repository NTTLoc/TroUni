import React, { useState, useEffect } from "react";
import { getAllRoomsApi } from "../../services/roomApi";
import { Spin, Card, Button, Space, Typography, Row, Col, Tag, Rate, Empty, Input, Select } from "antd";
import { Link } from "react-router-dom";
import "./AllRooms.scss";

const { Title, Text, Paragraph } = Typography;

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🏠 AllRooms: Fetching all rooms...");
      const response = await getAllRoomsApi({ page: 0, size: 50 }); // Get up to 50 rooms
      console.log("🏠 AllRooms: API Response:", response);
      
      // Try multiple possibilities for data extraction
      console.log("🏠 AllRooms: Response full:", response);
      console.log("🏠 AllRooms: Response.data:", response.data);
      
      // Try direct extraction based on logs
      let roomsData = [];
      if (response && response.content) {
        roomsData = response.content;
        console.log("🏠 AllRooms: Using direct response.content");
      } else if (response?.data?.content) {
        roomsData = response.data.content;
        console.log("🏠 AllRooms: Using response.data.content");
      } else if (Array.isArray(response)) {
        roomsData = response;
        console.log("🏠 AllRooms: Using response as array");
      } else if (Array.isArray(response.data)) {
        roomsData = response.data;
        console.log("🏠 AllRooms: Using response.data as array");
      } else {
        console.log("🏠 AllRooms: No rooms data found, response structure:", Object.keys(response || {}));
      }
      
      console.log("🏠 AllRooms: Rooms data:", roomsData);
      console.log("🏠 AllRooms: Rooms count:", roomsData.length);
      
      setRooms(roomsData);
    } catch (err) {
      console.error("❌ AllRooms: Error loading rooms:", err);
      setError(err?.message || "Không thể tải danh sách phòng trọ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "Không có";
    return `${Number(price).toLocaleString()} VNĐ/tháng`;
  };

  const formatArea = (area) => {
    if (!area) return "Không có";
    return `${area} m²`;
  };

  const getRoomTypeLabel = (roomType) => {
    const typeMap = {
      "PHONG_TRO": "Phòng trọ",
      "APARTMENT": "Căn hộ",
      "HOUSE": "Nhà ở",
      "STUDIO": "Studio",
      "SHARED_ROOM": "Phòng chung",
      "DORMITORY": "Ký túc xá"
    };
    return typeMap[roomType] || roomType || "Không xác định";
  };

  const getStatusColor = (status) => {
    const statusMap = {
      "available": "green",
      "rented": "red", 
      "maintenance": "orange",
      "unavailable": "gray"
    };
    return statusMap[status] || "blue";
  };

  const getStatusText = (status) => {
    const statusMap = {
      "available": "Còn trống",
      "rented": "Đã thuê",
      "maintenance": "Bảo trì",
      "unavailable": "Không khả dụng"
    };
    return statusMap[status] || status || "Không xác định";
  };

  const getPrimaryImage = (room) => {
    if (room?.images && room.images.length > 0) {
      const primaryImage = room.images.find(img => img.isPrimary);
      return primaryImage?.imageUrl || room.images[0]?.imageUrl;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="all-rooms-loading">
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>
          <Text>Đang tải danh sách phòng trọ...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-rooms-error">
        <Empty 
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button onClick={fetchRooms} type="primary">
            Thử lại
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="all-rooms-page">
      {/* Left Side - Main Content */}
      <div className="room-left">
        <div className="top">
          {/* Header & Search */}
          <div className="rooms-header">
            <Title level={2}>🏠 Tất cả phòng trọ</Title>
            <Text type="secondary">
              Tìm thấy {rooms.length} phòng trọ từ database
            </Text>
          </div>
          
          {/* Search Bar */}
          <div className="search-section">
            <Input 
              placeholder="Tìm kiếm theo tên phòng..." 
              allowClear
              size="large"
              style={{ marginBottom: "15px" }}
            />
          </div>
        </div>
        
        <div className="bottom">
          {/* Filter Tabs */}
          <div className="filter-tabs">
            <div className="tab-item active">Tất cả</div>
            <div className="tab-item">Phòng trọ</div>
            <div className="tab-item">Căn hộ</div>
            <div className="tab-item">Nhà ở</div>
          </div>
          
          {/* Rooms List */}
          <div className="rooms-list-section">
            {rooms.length === 0 ? (
              <Card>
                <Empty 
                  description="Không có phòng trọ nào được tìm thấy"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button onClick={fetchRooms} type="primary">
                    Thử lại
                  </Button>
                </Empty>
              </Card>
            ) : (
              <div className="rooms-list">
                {rooms.map((room) => (
                  <Link key={room.id} to={`/rooms/${room.id}`} className="room-item-link">
                    <div className="room-item">
                    {/* Image Section */}
                    <div className="room-image-section">
                      {room.images && room.images.length > 0 ? (
                        <img 
                          alt={room.title}
                          src={room.images[0].imageUrl}
                          className="room-image"
                        />
                      ) : (
                        <div className="room-placeholder">
                          🏠
                        </div>
                      )}
                      {room.status && (
                        <div className="status-badge">
                          <Tag color={room.status === 'available' ? 'green' : 'red'} size="small">
                            {getStatusText(room.status)}
                          </Tag>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="room-content">
                      {/* Title & Description */}
                      <div className="room-header">
                        <h3 className="room-title">
                          {room.title || "Không có tiêu đề"}
                        </h3>
                        {room.description && (
                          <p className="room-description">
                            {room.description.length > 80 
                              ? `${room.description.substring(0, 80)}...` 
                              : room.description}
                          </p>
                        )}
                      </div>

                      {/* Price & Area */}
                      <div className="room-info">
                        <div className="price">
                          <Text style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '16px' }}>
                            {formatPrice(room.pricePerMonth)}
                          </Text>
                        </div>
                        <div className="area">
                          <Text style={{ color: '#059669', fontSize: '14px' }}>
                            {formatArea(room.areaSqm)}
                          </Text>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="room-location">
                        <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                          📍 {room.streetAddress}, {room.ward}, {room.district}, {room.city}
                        </Text>
                      </div>

                      {/* Owner Info */}
                      <div className="room-owner">
                        <div className="owner-info">
                          👤 {room.owner?.username || "Chủ nhà"} • {room.viewCount || 0} lượt xem
                        </div>
                        <div className="room-date">
                          Đăng: {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>

                      {/* Room Type */}
                      <div className="room-meta">
                        <Tag size="small">{getRoomTypeLabel(room.roomType)}</Tag>
                      </div>
                    </div>

                    {/* Action Heart */}
                    <div className="room-actions">
                      <button 
                        className="heart-btn" 
                        aria-label="Thích"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle favorite
                          console.log('Favorite clicked for room:', room.id);
                        }}
                      >
                        ❤️
                      </button>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Filters */}
      <div className="rooms-right">
        {/* Price Filter */}
        <Card title="💰 Giá thuê" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Select placeholder="Chọn khoảng giá" style={{ width: "100%" }}>
              <Select.Option value="0-2">Dưới 2 triệu/tháng</Select.Option>
              <Select.Option value="2-5">2-5 triệu/tháng</Select.Option>
              <Select.Option value="5-10">5-10 triệu/tháng</Select.Option>
              <Select.Option value="10+">Trên 10 triệu/tháng</Select.Option>
            </Select>
          </Space>
        </Card>

        {/* Location Filter */}
        <Card title="📍 Vị trí" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Select placeholder="Chọn thành phố" style={{ width: "100%" }}>
              <Select.Option value="hcm">TP. Hồ Chí Minh</Select.Option>
              <Select.Option value="hn">Hà Nội</Select.Option>
              <Select.Option value="dn">Đà Nẵng</Select.Option>
            </Select>
            <Select placeholder="Chọn quận/huyện" style={{ width: "100%" }}>
              <Select.Option value="q1">Quận 1</Select.Option>
              <Select.Option value="q2">Quận 2</Select.Option>
              <Select.Option value="q3">Quận 3</Select.Option>
              <Select.Option value="bt">Bình Thạnh</Select.Option>
              <Select.Option value="go">Gò Vấp</Select.Option>
            </Select>
          </Space>
        </Card>

        {/* Room Type Filter */}
        <Card title="🏠 Loại phòng" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div className="checkbox-group">
              <label><input type="checkbox" /> Phòng trọ</label>
              <label><input type="checkbox" /> Căn hộ</label>
              <label><input type="checkbox" /> Nhà ở</label>
              <label><input type="checkbox" /> Studio</label>
            </div>
          </Space>
        </Card>

        {/* Action Buttons */}
        <Card title="⚡ Hành động" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button onClick={fetchRooms} block>
              🔄 Làm mới
            </Button>
            <Button type="primary" block>
              ✨ Áp dụng bộ lọc
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default AllRooms;
