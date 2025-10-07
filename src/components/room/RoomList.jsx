import React, { useState, useEffect } from "react";
import { Card, Row, Col, Pagination, Spin, Alert, Input, Select, Button, Space } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useRooms } from "../../hooks/useRooms";
import { 
  ROOM_TYPE_LABELS, 
  ROOM_STATUS_LABELS, 
  formatPrice, 
  formatArea, 
  formatFullAddress,
  getRoomTypeLabel,
  getRoomStatusLabel,
  VIETNAM_CITIES,
  HCM_DISTRICTS,
  HN_DISTRICTS
} from "../../utils/roomConstants";
import { convertAddressForBackend } from "../../utils/addressMapping";
import "./RoomList.scss";

const { Search } = Input;
const { Option } = Select;

const RoomList = () => {
  const {
    rooms,
    loading,
    error,
    pagination,
    totalElements,
    totalPages,
    searchRooms,
    fetchRooms,
    setPagination
  } = useRooms();

  // Search và filter states
  const [searchFilters, setSearchFilters] = useState({
    city: "",
    district: "",
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    roomType: "",
    status: "available"
  });

  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (value) => {
    // Convert address format cho backend khi search
    const searchParams = { ...searchFilters, keyword: value };
    if (searchFilters.city || searchFilters.district) {
      const addressData = convertAddressForBackend({
        city: searchFilters.city,
        district: searchFilters.district,
        ward: searchFilters.ward
      });
      searchParams.city = addressData.city;
      searchParams.district = addressData.district;
    }
    
    searchRooms(searchParams);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...searchFilters, [key]: value };
    setSearchFilters(newFilters);
    
    // Convert address format cho backend khi search
    const searchParams = { ...newFilters };
    if (newFilters.city || newFilters.district) {
      const addressData = convertAddressForBackend({
        city: newFilters.city,
        district: newFilters.district,
        ward: newFilters.ward
      });
      searchParams.city = addressData.city;
      searchParams.district = addressData.district;
    }
    
    searchRooms(searchParams);
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      city: "",
      district: "",
      minPrice: null,
      maxPrice: null,
      minArea: null,
      maxArea: null,
      roomType: "",
      status: "available"
    };
    setSearchFilters(clearedFilters);
    fetchRooms({ page: 0 });
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setPagination({ page: page - 1, size: pageSize });
    searchRooms({ ...searchFilters, page: page - 1, size: pageSize });
  };

  // Get districts based on selected city
  const getDistricts = () => {
    if (searchFilters.city === "Hồ Chí Minh") return HCM_DISTRICTS;
    if (searchFilters.city === "Hà Nội") return HN_DISTRICTS;
    return [];
  };

  return (
    <div className="room-list-container">
      {/* Header */}
      <div className="room-list-header">
        <h2>Danh sách phòng trọ</h2>
        <div className="header-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => window.location.href = "/rooms/create"}
          >
            Đăng phòng mới
          </Button>
        </div>
      </div>

      {/* Search và Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <Search
            placeholder="Tìm kiếm phòng trọ..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Bộ lọc
          </Button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Chọn thành phố"
                  value={searchFilters.city}
                  onChange={(value) => handleFilterChange("city", value)}
                  style={{ width: "100%" }}
                  allowClear
                >
                  {VIETNAM_CITIES.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Chọn quận/huyện"
                  value={searchFilters.district}
                  onChange={(value) => handleFilterChange("district", value)}
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!searchFilters.city}
                >
                  {getDistricts().map(district => (
                    <Option key={district} value={district}>{district}</Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Loại phòng"
                  value={searchFilters.roomType}
                  onChange={(value) => handleFilterChange("roomType", value)}
                  style={{ width: "100%" }}
                  allowClear
                >
                  {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Trạng thái"
                  value={searchFilters.status}
                  onChange={(value) => handleFilterChange("status", value)}
                  style={{ width: "100%" }}
                >
                  {Object.entries(ROOM_STATUS_LABELS).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Giá tối thiểu (VNĐ)"
                  type="number"
                  value={searchFilters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : null)}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Giá tối đa (VNĐ)"
                  type="number"
                  value={searchFilters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : null)}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Diện tích tối thiểu (m²)"
                  type="number"
                  value={searchFilters.minArea}
                  onChange={(e) => handleFilterChange("minArea", e.target.value ? parseFloat(e.target.value) : null)}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Diện tích tối đa (m²)"
                  type="number"
                  value={searchFilters.maxArea}
                  onChange={(e) => handleFilterChange("maxArea", e.target.value ? parseFloat(e.target.value) : null)}
                />
              </Col>
            </Row>

            <div className="filter-actions">
              <Space>
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
                <Button type="primary" onClick={() => searchRooms(searchFilters)}>
                  Áp dụng bộ lọc
                </Button>
              </Space>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Room List */}
      {!loading && !error && (
        <>
          <div className="results-info">
            <p>Tìm thấy {totalElements} phòng trọ</p>
          </div>

          <Row gutter={[16, 16]}>
            {rooms.map((room) => (
              <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                <RoomCard room={room} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                current={pagination.page + 1}
                total={totalElements}
                pageSize={pagination.size}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} phòng`
                }
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && rooms.length === 0 && (
        <div className="empty-state">
          <p>Không tìm thấy phòng trọ nào</p>
          <Button type="primary" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
};

// Room Card Component
const RoomCard = ({ room }) => {
  const handleCardClick = () => {
    // Navigate to room detail
    window.location.href = `/posts/${room.id}`;
  };

  return (
    <Card
      hoverable
      className="room-card"
      onClick={handleCardClick}
      cover={
        room.images && room.images.length > 0 ? (
          <div className="room-image-container">
            <img
              alt={room.title}
              src={room.images[0].imageUrl}
              className="room-image"
            />
            {room.boostExpiresAt && new Date(room.boostExpiresAt) > new Date() && (
              <div className="boost-badge">Nổi bật</div>
            )}
          </div>
        ) : (
          <div className="room-image-placeholder">
            <p>Không có hình ảnh</p>
          </div>
        )
      }
    >
      <div className="room-info">
        <h3 className="room-title">{room.title}</h3>
        
        <div className="room-details">
          <div className="room-price">
            <span className="price">{formatPrice(room.pricePerMonth)}</span>
            <span className="period">/tháng</span>
          </div>
          
          <div className="room-meta">
            <span className="room-type">{getRoomTypeLabel(room.roomType)}</span>
            {room.areaSqm && (
              <span className="room-area">{formatArea(room.areaSqm)}</span>
            )}
          </div>
          
          <div className="room-location">
            <p>{formatFullAddress(room)}</p>
          </div>
          
          <div className="room-status">
            <span className={`status-badge ${room.status}`}>
              {getRoomStatusLabel(room.status)}
            </span>
          </div>
        </div>

        {room.averageRating > 0 && (
          <div className="room-rating">
            <span className="rating">⭐ {room.averageRating.toFixed(1)}</span>
            <span className="review-count">({room.totalReviews} đánh giá)</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RoomList;
