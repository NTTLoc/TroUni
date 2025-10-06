import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoomByIdApi, getRoomImagesApi } from "../../services/roomApi";
import { Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./RoomDetail.scss";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchRoomData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🏠 RoomDetail: Fetching room ID:", id);
      const response = await getRoomByIdApi(id);
      console.log("🏠 RoomDetail: API Response:", response);
      console.log("🏠 RoomDetail: Response.data:", response.data);
      console.log("🏠 RoomDetail: Response structure:", Object.keys(response || {}));
      
      // Try multiple extraction methods
      let roomData = null;
      if (response?.data) {
        roomData = response.data;
        console.log("🏠 RoomDetail: Using response.data");
      } else if (response && !response.data) {
        roomData = response;
        console.log("🏠 RoomDetail: Using direct response");
      } else {
        console.log("🏠 RoomDetail: No room data found in response");
      }
      
      console.log("🏠 RoomDetail: Final room data:", roomData);
      setRoom(roomData);
      
      // Fetch images separately if room doesn't have images
      if (!roomData?.images || roomData.images.length === 0) {
        fetchRoomImages();
      } else {
        setImages(roomData.images);
      }
      
    } catch (err) {
      console.error("❌ RoomDetail: Error loading room:", err);
      setError(err?.response?.data?.message || err?.message || "Không thể tải thông tin phòng trọ");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomImages = async () => {
    setImagesLoading(true);
    
    try {
      console.log("🖼️ RoomDetail: Fetching images for room:", id);
      const response = await getRoomImagesApi(id);
      console.log("🖼️ RoomDetail: Images Response:", response);
      console.log("🖼️ RoomDetail: Images Response.data:", response.data);
      
      const imagesData = response.data || [];
      console.log("🖼️ RoomDetail: Images data:", imagesData);
      setImages(imagesData);
    } catch (err) {
      console.error("❌ RoomDetail: Error loading images:", err);
      // Don't set error, images are optional
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoomData();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="room-loading">
        <Spin size="large" />
        <div>Đang tải thông tin phòng trọ...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-empty">
        <div className="empty-icon">❌</div>
        <div>Phòng trọ không tồn tại</div>
        <Button onClick={() => navigate("/rooms/all")} type="primary">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="room-detail">
      {/* Main Content */}
      <div className="main-content">
        {/* Main Image Gallery */}
        <div className="image-gallery">
        <div className="main-image">
          {images.length > 0 ? (
            <>
              <img 
                src={images[currentImageIndex]?.imageUrl} 
                alt={room.title}
                className="main-img"
              />
              {images.length > 1 && (
                <>
                  <button 
                    className="nav-btn prev" 
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  >
                    ←
                  </button>
                  <button 
                    className="nav-btn next"
                    onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  >
                    →
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="no-image">Chưa có ảnh</div>
          )}
        </div>
        
        {/* Image Thumbnails */}
        {images.length >= 2 && (
          <div className="thumbnails">
            {images.slice(0, Math.min(images.length, 4)).map((image, index) => (
              <img 
                key={index}
                src={image.imageUrl} 
                alt={`Thumbnail ${index + 1}`}
                className={`thumb ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Info Section */}
      <div className="room-info-section">
        <div className="room-title-banner">
          <h1>{room.title}</h1>
          
          <div className="price-tag">{formatPrice(room.pricePerMonth)}</div>
        </div>
        
        <div className="room-meta">
          <div className="meta-item">
            <span className="label">Chi tiết:</span>
            <span className="area">{formatArea(room.areaSqm)}</span>
          </div>
          <div className="meta-item">
            <span className="label">Vị trí:</span>
            <span className="location">
              📍 {room.streetAddress}, {room.ward}, {room.district}, {room.city}
            </span>
          </div>
          <div className="meta-item">
            <span className="label">Trạng thái:</span>
            <span className={`status ${room.status}`}>{getStatusText(room.status)}</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="room-description-section">
        <h3>Description:</h3>
        
        

        {/* Description Text */}
        <div className={`description-content ${expanded ? 'expanded' : ''}`}>
          {room.description || "Chưa có mô tả chi tiết về phòng trọ."}
        </div>

        {/* Contact Phone */}
        <div className="phone-box">
          <strong>SDT Liên hệ:</strong> {room.owner?.phone || "Chưa cập nhật"}
          <button className="show-btn">Hiện SDT</button>
        </div>

        {/* Expand Button */}
        <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
        </div>
      </div>

      {/* Similar Rooms Section */}
      <div className="similar-rooms-section">
        <h3>Tin đăng tương tự</h3>
        <div className="similar-rooms-grid">
          {/* Mock similar rooms */}
          <div className="similar-room-card">
            <div className="room-image">
              <span className="partner-tag">Đối Tác</span>
            </div>
            <div className="room-info">
              <h4>Gác ban công full nội thất</h4>
              <p>Nội thất đầy đủ</p>
              <div className="room-price">3,6 triệu/tháng</div>
              <div className="room-area">40 m²</div>
              <div className="room-location">Quận 12</div>
            </div>
          </div>
          
          <div className="similar-room-card">
            <div className="room-image">
              <span className="partner-tag">Đối Tác</span>
            </div>
            <div className="room-info">
              <h4>Gác ban công full nội thất</h4>
              <p>Nội thất đầy đủ</p>
              <div className="room-price">3,6 triệu/tháng</div>
              <div className="room-area">40 m²</div>
              <div className="room-location">Quận 12</div>
            </div>
          </div>
          
          <div className="similar-room-card">
            <div className="room-image"></div>
            <div className="room-info">
              <h4>Gác ban công full nội thất</h4>
              <p>Nội thất đầy đủ</p>
              <div className="room-price">3,6 triệu/tháng</div>
              <div className="room-area">40 m²</div>
              <div className="room-location">Quận 12</div>
            </div>
          </div>
          
          <div className="similar-room-card">
            <div className="room-image"></div>
            <div className="room-info">
              <h4>Gác ban công full nội thất</h4>
              <p>Nội thất đầy đủ</p>
              <div className="room-price">3,6 triệu/tháng</div>
              <div className="room-area">40 m²</div>
              <div className="room-location">Quận 12</div>
            </div>
          </div>
        </div>
        
        <button className="view-more-btn">Xem thêm</button>
      </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Owner Info */}
        <div className="owner-card">
          <div className="owner-header">
            <div className="owner-name">{room.owner?.username || "Chủ nhà"}</div>
            <span className="owner-type">{getRoomTypeLabel(room.roomType)}</span>
          </div>
          
          <div className="owner-avatar">
            <img src="/api/placeholder/40/40" alt="Avatar" />
          </div>
          
          <div className="owner-stats">
            <div>Hoạt động {Math.floor(Math.random() * 30)} ngày trước</div>
            <div>Phản hồi: {Math.floor(Math.random() * 50 + 50)}%</div>
            <div>{Math.floor(Math.random() * 20)} tin đăng</div>
            <div>{Math.floor(Math.random() * 5 + 1)} năm trên Trọ Uni</div>
          </div>
          
          <div className="owner-actions">
            <button className="action-btn chat">Chat</button>
            <button className="action-btn call">Gọi ngay</button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-card">
          <h3>Bình luận</h3>
          <div className="no-comments">
            <div className="comment-icon">💬</div>
            <p>Chưa có bình luận nào. Hãy để lại bình luận cho người bán.</p>
          </div>
          
          <div className="comment-input">
            <input type="text" placeholder="Bình luận..." />
            <button className="send-btn">✈️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
