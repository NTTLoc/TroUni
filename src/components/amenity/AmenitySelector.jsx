// ✅ Bản đã chỉnh sửa
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Space,
  Divider,
  Typography,
  Spin,
  Alert,
  Empty,
  Tooltip,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import * as Icons from "@ant-design/icons";
import { useAmenities } from "../../hooks/useAmenities";
import {
  AMENITY_CATEGORIES,
  AMENITY_CATEGORY_LABELS,
  AMENITY_VALIDATION,
} from "../../utils/amenityConstants";
import "./AmenitySelector.scss";

const { Title, Text } = Typography;
const { Search } = Input;

const normalizeIconName = (iconName) => {
  if (!iconName) return "HomeOutlined";
  const formatted = iconName
    .trim()
    .replace(/[-_ ]+/g, "")
    .replace(/^\w/, (c) => c.toUpperCase());
  return formatted.endsWith("Outlined") ? formatted : formatted + "Outlined";
};

const AmenitySelector = ({
  selectedAmenities = [],
  onSelectionChange,
  showCreateForm = false,
  onAmenityCreated,
  className = "",
  maxSelection = AMENITY_VALIDATION.MAX_SELECTED,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityIcon, setNewAmenityIcon] = useState("");
  const [previewIcon, setPreviewIcon] = useState(null);

  const {
    amenities,
    loading,
    error,
    fetchAllAmenities,
    createAmenity,
    deleteAmenity,
  } = useAmenities({ autoFetch: true });

  const [selectedIds, setSelectedIds] = useState(
    selectedAmenities.map((a) => a.id)
  );

  useEffect(() => {
    if (selectedAmenities.length > 0)
      setSelectedIds(selectedAmenities.map((a) => a.id));
  }, [selectedAmenities]);

  const filteredAmenities = amenities.filter((amenity) => {
    const matchesSearch = amenity.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || amenity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAmenityToggle = (amenity) => {
    const isSelected = selectedIds.includes(amenity.id);
    let updated;
    if (isSelected) {
      updated = selectedIds.filter((id) => id !== amenity.id);
    } else {
      if (selectedIds.length >= maxSelection) {
        message.warning(`Chỉ được chọn tối đa ${maxSelection} tiện ích.`);
        return;
      }
      updated = [...selectedIds, amenity.id];
    }

    setSelectedIds(updated);
    if (onSelectionChange) {
      const selectedObjects = amenities.filter((a) => updated.includes(a.id));
      onSelectionChange(selectedObjects);
    }
  };

  const handleCreateAmenity = async () => {
    if (!newAmenityName.trim()) return;
    try {
      const normalizedIcon = normalizeIconName(newAmenityIcon);
      const amenityData = {
        name: newAmenityName.trim(),
        icon: normalizedIcon,
      };
      await createAmenity(amenityData);
      message.success("Đã thêm tiện ích mới!");
      setNewAmenityName("");
      setNewAmenityIcon("");
      setPreviewIcon(null);
      fetchAllAmenities();
      onAmenityCreated?.(amenityData);
    } catch (err) {
      console.error("❌ Lỗi tạo tiện ích:", err);
      message.error("Không thể thêm tiện ích!");
    }
  };

  const handleDeleteAmenity = async (id) => {
    try {
      await deleteAmenity(id);
      fetchAllAmenities();
      message.success("Đã xóa tiện ích!");
    } catch (err) {
      console.error("❌ Lỗi xóa tiện ích:", err);
      message.error("Không thể xóa!");
    }
  };

  const renderAmenityItem = (amenity) => {
    const isSelected = selectedIds.includes(amenity.id);
    const iconName = normalizeIconName(amenity.icon);
    const Icon = Icons[iconName] || HomeOutlined;

    return (
      <div
        key={amenity.id}
        className={`amenity-item ${isSelected ? "selected" : ""}`}
        onClick={() => handleAmenityToggle(amenity)}
      >
        <div className="amenity-left">
          <Icon className="amenity-icon" />
          <span className="amenity-name">{amenity.name}</span>
        </div>
        {showCreateForm && (
          <Tooltip title="Xóa tiện ích">
            <DeleteOutlined
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAmenity(amenity.id);
              }}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  useEffect(() => {
    const normalized = normalizeIconName(newAmenityIcon);
    setPreviewIcon(Icons[normalized] || null);
  }, [newAmenityIcon]);

  return (
    <div className={`amenity-selector ${className}`}>
      <div className="selector-header">
        <Title level={4}>Chọn tiện ích</Title>
        <Text type="secondary">
          Chọn các tiện ích có sẵn trong phòng trọ (tối đa {maxSelection})
        </Text>
      </div>

      <div className="search-filter">
        <Search
          placeholder="Tìm kiếm tiện ích..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : filteredAmenities.length === 0 ? (
        <Empty description="Không có tiện ích nào" />
      ) : (
        <div className="amenity-list">
          {filteredAmenities.map(renderAmenityItem)}
        </div>
      )}

      {showCreateForm && (
        <>
          <Divider>Thêm tiện ích mới</Divider>
          <div className="create-form">
            <Input
              placeholder="Tên tiện ích..."
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
            />
            <Input
              placeholder="Tên icon (ví dụ: WifiOutlined)"
              value={newAmenityIcon}
              onChange={(e) => setNewAmenityIcon(e.target.value)}
            />
            {previewIcon && (
              <div className="icon-preview">
                <previewIcon style={{ fontSize: 22, color: "#1890ff" }} />
              </div>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={!newAmenityName.trim()}
              onClick={handleCreateAmenity}
            >
              Thêm
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AmenitySelector;
