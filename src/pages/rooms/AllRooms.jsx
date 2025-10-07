import React, { useState, useEffect } from "react";
import { getAllRoomsApi, incrementViewCountApi, searchRoomsApi } from "../../services/roomApi";
import { Spin, Card, Button, Space, Typography, Row, Col, Tag, Rate, Empty, Input, Select, message, Checkbox } from "antd";
import { Link } from "react-router-dom";
import "./AllRooms.scss";

const { Title, Text, Paragraph } = Typography;

// Filter options
const ROOM_TYPES = [
  { value: "all", label: "Tất cả" },
  { value: "PHONG_TRO", label: "Phòng trọ" },
  { value: "CHUNG_CU_MINI", label: "Chung cư mini" },
  { value: "O_GHEP", label: "Ở ghép" },
  { value: "KY_TUC_XA", label: "Ký túc xá" }
];

const PRICE_RANGES = [
  { value: [0, 2000000], label: "Dưới 2 triệu" },
  { value: [2000000, 5000000], label: "2-5 triệu" },
  { value: [5000000, 10000000], label: "5-10 triệu" },
  { value: [10000000, 20000000], label: "10-20 triệu" },
  { value: [20000000, 50000000], label: "Trên 20 triệu" }
];

const AREA_RANGES = [
  { value: [0, 20], label: "Dưới 20 m²" },
  { value: [20, 40], label: "20-40 m²" },
  { value: [40, 60], label: "40-60 m²" },
  { value: [60, 100], label: "60-100 m²" },
  { value: [100, 200], label: "Trên 100 m²" }
];

const CITIES = [
  { value: "HCM", label: "Hồ Chí Minh" },
  { value: "HN", label: "Hà Nội" },
  { value: "DN", label: "Đà Nẵng" },
  { value: "HP", label: "Hải Phòng" },
  { value: "CT", label: "Cần Thơ" }
];

const DISTRICTS = {
  HCM: [
    { value: "Quan 1", label: "Quận 1" },
    { value: "Quan 2", label: "Quận 2" },
    { value: "Quan 3", label: "Quận 3" },
    { value: "Quan 4", label: "Quận 4" },
    { value: "Quan 5", label: "Quận 5" }
  ],
  HN: [
    { value: "Hoan Kiem", label: "Hoàn Kiếm" },
    { value: "Ba Dinh", label: "Ba Đình" },
    { value: "Dong Da", label: "Đống Đa" },
    { value: "Hai Ba Trung", label: "Hai Bà Trưng" },
    { value: "Cau Giay", label: "Cầu Giấy" }
  ]
};

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false); // Subtle loading for auto-search
  const [error, setError] = useState(null);
  const [incrementingViews, setIncrementingViews] = useState(new Set()); // Track which rooms are incrementing views
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [priceRange, setPriceRange] = useState(null);
  const [areaRange, setAreaRange] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🏠 AllRooms: Fetching all rooms...");
      const response = await getAllRoomsApi(); // ✅ Không cần pagination params
      console.log("🏠 AllRooms: API Response:", response);
      console.log("🏠 AllRooms: Response.data:", response.data);
      console.log("🏠 AllRooms: Response.data.data:", response.data?.data);
      
      // ✅ Fix: Xử lý response structure đúng cách
      let roomsData = [];
      if (response?.data?.content) {
        // Trường hợp 1: response.data.content (Spring Boot pagination)
        roomsData = response.data.content;
        console.log("🏠 AllRooms: Using response.data.content");
      } else if (response && response.content) {
        // Trường hợp 2: response.content (direct response)
        roomsData = response.content;
        console.log("🏠 AllRooms: Using direct response.content");
      } else if (Array.isArray(response.data)) {
        // Trường hợp 3: response.data là array
        roomsData = response.data;
        console.log("🏠 AllRooms: Using response.data as array");
      } else if (Array.isArray(response)) {
        // Trường hợp 4: response là array
        roomsData = response;
        console.log("🏠 AllRooms: Using response as array");
      } else {
        console.log("🏠 AllRooms: No rooms data found, response structure:", Object.keys(response || {}));
        console.log("🏠 AllRooms: Response.data structure:", Object.keys(response?.data || {}));
      }
      
      console.log("🏠 AllRooms: Rooms data:", roomsData);
      console.log("🏠 AllRooms: Rooms count:", roomsData.length);
      console.log("🏠 AllRooms: First room structure:", roomsData[0]);
      console.log("🏠 AllRooms: First room thumbnailUrl:", roomsData[0]?.thumbnailUrl);
      console.log("🏠 AllRooms: First room price:", roomsData[0]?.price);
      console.log("🏠 AllRooms: First room area:", roomsData[0]?.area);
      console.log("🏠 AllRooms: First room address:", roomsData[0]?.address);
      console.log("🏠 AllRooms: First room images:", roomsData[0]?.images);
      
      setRooms(roomsData);
    } catch (err) {
      console.error("❌ AllRooms: Error loading rooms:", err);
      setError(err?.message || "Không thể tải danh sách phòng trọ");
    } finally {
      setLoading(false);
    }
  };

  // Search rooms with filters
  const searchRooms = async (showFullLoading = true) => {
    if (showFullLoading) {
      setLoading(true);
    } else {
      setSearching(true); // Subtle loading for auto-search
    }
    setError(null);
    
    try {
      console.log("🔍 AllRooms: Searching rooms with filters...");
      
      // Build search parameters - only include fields supported by backend
      const searchParams = {};
      
      // ✅ Backend supports: city, district, ward, minPrice, maxPrice, minArea, maxArea, roomType
      if (selectedRoomType !== "all") {
        searchParams.roomType = selectedRoomType;
      }
      
      if (priceRange) {
        searchParams.minPrice = priceRange[0];
        searchParams.maxPrice = priceRange[1];
      }
      
      if (areaRange) {
        searchParams.minArea = areaRange[0];
        searchParams.maxArea = areaRange[1];
      }
      
      if (selectedCity) {
        searchParams.city = selectedCity;
      }
      
      if (selectedDistrict) {
        searchParams.district = selectedDistrict;
      }
      
      // Note: Backend searchRooms() only supports:
      // - city, district, ward (location)
      // - minPrice, maxPrice (price range) 
      // - minArea, maxArea (area range)
      // - roomType (single room type: PHONG_TRO, CHUNG_CU_MINI, O_GHEP, KY_TUC_XA)
      // 
      // Frontend will handle:
      // - title search (filtering on frontend)
      // - multiple roomTypes (filtering on frontend)
      
      console.log("🔍 AllRooms: Search params:", searchParams);
      
      const response = await searchRoomsApi(searchParams);
      console.log("🔍 AllRooms: Search response:", response);
      
      // Extract rooms data (same logic as fetchRooms)
      let roomsData = [];
      if (response?.data?.data) {
        roomsData = response.data.data;
      } else if (response?.data) {
        roomsData = response.data;
      } else if (Array.isArray(response)) {
        roomsData = response;
      }
      
      // ✅ Frontend filtering for title search (since backend doesn't support it)
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        roomsData = roomsData.filter(room => 
          room.title?.toLowerCase().includes(searchLower) ||
          room.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // ✅ Frontend filtering for multiple room types (since backend only supports single roomType)
      if (selectedRoomTypes.length > 0) {
        roomsData = roomsData.filter(room => 
          selectedRoomTypes.includes(room.roomType)
        );
      }
      
      console.log("🔍 AllRooms: Search results:", roomsData);
      setRooms(roomsData);
      
    } catch (err) {
      console.error("❌ AllRooms: Error searching rooms:", err);
      setError(err?.message || "Không thể tìm kiếm phòng trọ");
    } finally {
      if (showFullLoading) {
        setLoading(false);
      } else {
        setSearching(false);
      }
    }
  };

  // Handle filter changes
  const handleSearch = () => {
    searchRooms(true); // Show full loading for manual search
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRoomType("all");
    setPriceRange(null);
    setAreaRange(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedRoomTypes([]);
    fetchRooms(); // Reset to show all rooms
  };

  const handleRoomTypeChange = (roomType) => {
    setSelectedRoomType(roomType);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(null); // Reset district when city changes
  };

  // Auto search when filters change (subtle loading)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (priceRange || areaRange || selectedCity || selectedDistrict || selectedRoomTypes.length > 0 || selectedRoomType !== "") {
        searchRooms(false); // Don't show full loading for auto-search
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [priceRange, areaRange, selectedCity, selectedDistrict, selectedRoomTypes, selectedRoomType]);

  // Handle view count increment
  const handleViewIncrement = async (roomId, event) => {
    // Prevent default link behavior temporarily
    event.preventDefault();
    
    // Check if already incrementing for this room
    if (incrementingViews.has(roomId)) {
      return;
    }
    
    try {
      // Add to incrementing set
      setIncrementingViews(prev => new Set(prev).add(roomId));
      
      console.log("👁️ Incrementing view count for room:", roomId);
      await incrementViewCountApi(roomId);
      
      // Update local state
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, viewCount: (room.viewCount || 0) + 1 }
            : room
        )
      );
      
      console.log("✅ View count incremented successfully for room:", roomId);
      
      // Navigate to room detail after successful increment
      window.location.href = `/rooms/${roomId}`;
      
    } catch (error) {
      console.error("❌ Error incrementing view count:", error);
      message.error("Có lỗi xảy ra khi tăng lượt xem");
      
      // Still navigate even if increment fails
      window.location.href = `/rooms/${roomId}`;
    } finally {
      // Remove from incrementing set
      setIncrementingViews(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
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
      "CHUNG_CU_MINI": "Chung cư mini",
      "O_GHEP": "Ở ghép",
      "KY_TUC_XA": "Ký túc xá"
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
    // ✅ Sử dụng thumbnailUrl từ backend
    if (room?.thumbnailUrl) {
      let url = room.thumbnailUrl;
      
      // Debug URL
      console.log("🔍 Original thumbnailUrl:", url);
      
      // Check if URL is complete (has proper extension)
      if (url && !url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        console.warn("⚠️ URL might be incomplete:", url);
        
        // Try to fix common Cloudinary URLs
        if (url.includes('cloudinary.com') && !url.includes('.jpg') && !url.includes('.png')) {
          // Add default extension for Cloudinary
          url = url + '.jpg';
          console.log("🔧 Fixed Cloudinary URL:", url);
        }
      }
      
      return url;
    }
    
    // Fallback: tìm trong images array nếu có
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
                {searching && <span style={{ marginLeft: '8px', color: '#1890ff' }}>🔍 Đang tìm kiếm...</span>}
              </Text>
            </div>
          
          {/* Search Bar */}
          <div className="search-section">
            <Input.Search
              placeholder="Tìm kiếm theo tên phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
              enterButton="Tìm kiếm"
              allowClear
              size="large"
              style={{ marginBottom: "15px" }}
            />
          </div>
        </div>
        
        <div className="bottom">
          {/* Filter Tabs */}
          <div className="filter-tabs">
            {ROOM_TYPES.map((type) => (
              <div
                key={type.value}
                className={`tab-item ${selectedRoomType === type.value ? 'active' : ''}`}
                onClick={() => handleRoomTypeChange(type.value)}
                style={{ cursor: 'pointer' }}
              >
                {type.label}
              </div>
            ))}
          </div>
          
          {/* Rooms List */}
          <div className="rooms-list-section">
            {rooms.length === 0 && !searching ? (
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
                {/* Skeleton loading for auto-search */}
                {searching && rooms.length === 0 && (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="room-item-skeleton">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                          <div className="skeleton-title"></div>
                          <div className="skeleton-price"></div>
                          <div className="skeleton-location"></div>
                          <div className="skeleton-owner"></div>
                          <div className="skeleton-phone"></div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                
                {/* Actual room cards */}
                {rooms.map((room) => (
                  <div key={room.id} className="room-item-link">
                    <div 
                      className="room-item"
                      onClick={(e) => handleViewIncrement(room.id, e)}
                      style={{ 
                        cursor: incrementingViews.has(room.id) ? 'wait' : 'pointer',
                        opacity: incrementingViews.has(room.id) ? 0.7 : 1
                      }}
                    >
                    {/* Image Section */}
                    <div className="room-image-section">
                      {getPrimaryImage(room) ? (
                        <img 
                          alt={room.title}
                          src={getPrimaryImage(room)}
                          className="room-image"
                          onLoad={() => console.log("✅ Image loaded:", getPrimaryImage(room))}
                          onError={(e) => {
                            console.error("❌ Image failed to load:", getPrimaryImage(room));
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="room-placeholder" style={{ display: getPrimaryImage(room) ? 'none' : 'flex' }}>
                        🏠
                      </div>
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
                            {formatPrice(room.price || room.pricePerMonth)}
                          </Text>
                        </div>
                        <div className="area">
                          <Text style={{ color: '#059669', fontSize: '14px' }}>
                            {formatArea(room.area || room.areaSqm)}
                          </Text>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="room-location">
                        <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                          📍 {room.address || `${room.streetAddress || ''}, ${room.ward || ''}, ${room.district || ''}, ${room.city || ''}`}
                        </Text>
                      </div>

                      {/* Owner Info */}
                      <div className="room-owner">
                        <div className="owner-info">
                          👤 {room.owner?.username || "Chủ nhà"} • {room.viewCount || 0} lượt xem
                          {incrementingViews.has(room.id) && (
                            <span style={{ marginLeft: '8px', color: '#1890ff' }}>
                              📈 Đang tăng lượt xem...
                            </span>
                          )}
                        </div>
                        <div className="owner-contact">
                          📞 {room.owner?.phone || "Chưa cập nhật"}
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
                  </div>
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
            <Select 
              placeholder="Chọn khoảng giá" 
              style={{ width: "100%" }}
              value={priceRange ? `${priceRange[0]}-${priceRange[1]}` : null}
              onChange={(value) => {
                if (value) {
                  const [min, max] = value.split('-').map(Number);
                  setPriceRange([min, max]);
                } else {
                  setPriceRange(null);
                }
              }}
            >
              {PRICE_RANGES.map((range) => (
                <Select.Option key={`${range.value[0]}-${range.value[1]}`} value={`${range.value[0]}-${range.value[1]}`}>
                  {range.label}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* Area Filter */}
        <Card title="📐 Diện tích" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Select 
              placeholder="Chọn khoảng diện tích" 
              style={{ width: "100%" }}
              value={areaRange ? `${areaRange[0]}-${areaRange[1]}` : null}
              onChange={(value) => {
                if (value) {
                  const [min, max] = value.split('-').map(Number);
                  setAreaRange([min, max]);
                } else {
                  setAreaRange(null);
                }
              }}
            >
              {AREA_RANGES.map((range) => (
                <Select.Option key={`${range.value[0]}-${range.value[1]}`} value={`${range.value[0]}-${range.value[1]}`}>
                  {range.label}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* Location Filter */}
        <Card title="📍 Vị trí" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Select 
              placeholder="Chọn thành phố" 
              style={{ width: "100%" }}
              value={selectedCity}
              onChange={handleCityChange}
            >
              {CITIES.map((city) => (
                <Select.Option key={city.value} value={city.value}>
                  {city.label}
                </Select.Option>
              ))}
            </Select>
            <Select 
              placeholder="Chọn quận/huyện" 
              style={{ width: "100%" }}
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              disabled={!selectedCity}
            >
              {selectedCity && DISTRICTS[selectedCity]?.map((district) => (
                <Select.Option key={district.value} value={district.value}>
                  {district.label}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* Room Type Filter */}
        <Card title="🏠 Loại phòng" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div className="checkbox-group">
              {ROOM_TYPES.filter(type => type.value !== "all").map((type) => (
                <Checkbox
                  key={type.value}
                  checked={selectedRoomTypes.includes(type.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRoomTypes([...selectedRoomTypes, type.value]);
                    } else {
                      setSelectedRoomTypes(selectedRoomTypes.filter(t => t !== type.value));
                    }
                  }}
                >
                  {type.label}
                </Checkbox>
              ))}
            </div>
          </Space>
        </Card>

        {/* Action Buttons */}
        <Card title="⚡ Hành động" className="filter-card">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button onClick={handleResetFilters} block>
              🔄 Làm mới
            </Button>
            <Button type="primary" block onClick={handleSearch}>
              ✨ Áp dụng bộ lọc
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default AllRooms;
