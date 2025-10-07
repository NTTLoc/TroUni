import React, { useState, useEffect } from "react";
import { 
  Card, 
  Checkbox, 
  Button, 
  Input, 
  Space, 
  Divider, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Spin, 
  Alert,
  Empty,
  Tooltip
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { useAmenities } from "../../hooks/useAmenities";
import { 
  AMENITY_CATEGORIES, 
  AMENITY_CATEGORY_LABELS, 
  AMENITY_VALIDATION,
  COMMON_AMENITIES 
} from "../../utils/amenityConstants";
import "./AmenitySelector.scss";

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * AmenitySelector Component
 * Component để chọn amenities cho phòng trọ
 */
const AmenitySelector = ({ 
  selectedAmenities = [], 
  onSelectionChange, 
  roomId = null,
  showCreateForm = false,
  onAmenityCreated,
  className = "",
  maxSelection = AMENITY_VALIDATION.MAX_SELECTED
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityIcon, setNewAmenityIcon] = useState("");

  const {
    amenities,
    loading,
    error,
    fetchAllAmenities,
    createAmenity,
    deleteAmenity,
    toggleAmenity,
    isAmenitySelected,
    selectAllAmenities,
    unselectAllAmenities,
    selectedCount,
    totalCount,
    hasSelection
  } = useAmenities({ roomId, autoFetch: true });

  // Sync với selectedAmenities từ props
  useEffect(() => {
    if (selectedAmenities.length > 0) {
      // TODO: Sync selected amenities với internal state
    }
  }, [selectedAmenities]);

  // Filter amenities based on search and category
  const filteredAmenities = amenities.filter(amenity => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || amenity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle amenity selection
  const handleAmenityToggle = (amenity) => {
    if (selectedCount >= maxSelection && !isAmenitySelected(amenity.id)) {
      // Show warning if trying to select more than max
      return;
    }
    
    toggleAmenity(amenity);
    
    // Notify parent component
    if (onSelectionChange) {
      const newSelection = isAmenitySelected(amenity.id) 
        ? selectedAmenities.filter(a => a.id !== amenity.id)
        : [...selectedAmenities, amenity];
      onSelectionChange(newSelection);
    }
  };

  // Handle create new amenity
  const handleCreateAmenity = async () => {
    if (!newAmenityName.trim()) return;

    try {
      const amenityData = {
        name: newAmenityName.trim(),
        icon: newAmenityIcon || "🏠"
      };

      const newAmenity = await createAmenity(amenityData);
      
      // Reset form
      setNewAmenityName("");
      setNewAmenityIcon("");
      setShowCreateModal(false);
      
      // Notify parent
      if (onAmenityCreated) {
        onAmenityCreated(newAmenity);
      }
    } catch (error) {
      console.error("Error creating amenity:", error);
    }
  };

  // Handle delete amenity
  const handleDeleteAmenity = async (amenityId) => {
    try {
      await deleteAmenity(amenityId);
    } catch (error) {
      console.error("Error deleting amenity:", error);
    }
  };

  // Render amenity item
  const renderAmenityItem = (amenity) => {
    const isSelected = isAmenitySelected(amenity.id);
    const canSelect = selectedCount < maxSelection || isSelected;

    return (
      <Col xs={12} sm={8} md={6} lg={4} key={amenity.id}>
        <Card
          className={`amenity-card ${isSelected ? 'selected' : ''} ${!canSelect ? 'disabled' : ''}`}
          size="small"
          hoverable={canSelect}
          onClick={() => canSelect && handleAmenityToggle(amenity)}
        >
          <div className="amenity-content">
            <div className="amenity-icon">
              {amenity.iconUrl ? (
                <img src={amenity.iconUrl} alt={amenity.name} />
              ) : (
                <span className="emoji-icon">🏠</span>
              )}
            </div>
            <div className="amenity-name">
              <Text ellipsis title={amenity.name}>
                {amenity.name}
              </Text>
            </div>
            <div className="amenity-actions">
              {isSelected ? (
                <CheckCircleOutlined className="selected-icon" />
              ) : (
                <CloseCircleOutlined className="unselected-icon" />
              )}
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  // Render category filter
  const renderCategoryFilter = () => {
    const categories = Object.values(AMENITY_CATEGORIES);
    
    return (
      <div className="category-filter">
        <Space wrap>
          <Button
            type={selectedCategory === null ? "primary" : "default"}
            size="small"
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả ({totalCount})
          </Button>
          {categories.map(category => {
            const count = amenities.filter(a => a.category === category).length;
            return (
              <Button
                key={category}
                type={selectedCategory === category ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedCategory(category)}
              >
                {AMENITY_CATEGORY_LABELS[category]} ({count})
              </Button>
            );
          })}
        </Space>
      </div>
    );
  };

  // Render selection summary
  const renderSelectionSummary = () => {
    if (!hasSelection) return null;

    return (
      <div className="selection-summary">
        <Space>
          <Text strong>
            Đã chọn: {selectedCount}/{maxSelection} tiện ích
          </Text>
          <Button 
            size="small" 
            onClick={unselectAllAmenities}
            icon={<CloseCircleOutlined />}
          >
            Bỏ chọn tất cả
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <div className={`amenity-selector ${className}`}>
      {/* Header */}
      <div className="selector-header">
        <Title level={4}>Chọn tiện ích</Title>
        <Text type="secondary">
          Chọn các tiện ích có sẵn trong phòng trọ (tối đa {maxSelection})
        </Text>
      </div>

      {/* Search and Filters */}
      <div className="selector-filters">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm tiện ích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            {renderCategoryFilter()}
          </Col>
        </Row>
      </div>

      {/* Selection Summary */}
      {renderSelectionSummary()}

      <Divider />

      {/* Error Display */}
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <Spin size="large" />
          <Text>Đang tải danh sách tiện ích...</Text>
        </div>
      )}

      {/* Amenities Grid */}
      {!loading && (
        <div className="amenities-grid">
          {filteredAmenities.length === 0 ? (
            <Empty
              description="Không tìm thấy tiện ích nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Row gutter={[8, 8]}>
              {filteredAmenities.map(renderAmenityItem)}
            </Row>
          )}
        </div>
      )}

      {/* Create New Amenity (Admin only) */}
      {showCreateForm && (
        <div className="create-amenity-section">
          <Divider>Thêm tiện ích mới</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Input
                placeholder="Tên tiện ích..."
                value={newAmenityName}
                onChange={(e) => setNewAmenityName(e.target.value)}
              />
            </Col>
            <Col xs={24} md={8}>
              <Input
                placeholder="Icon (emoji hoặc URL)"
                value={newAmenityIcon}
                onChange={(e) => setNewAmenityIcon(e.target.value)}
              />
            </Col>
            <Col xs={24} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateAmenity}
                disabled={!newAmenityName.trim()}
                block
              >
                Thêm
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default AmenitySelector;
