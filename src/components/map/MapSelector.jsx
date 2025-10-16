import React, { useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Card, Button, Input, Space, Alert, Typography, Spin, List, AutoComplete } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useMapSelector } from "../../hooks/useMapSelector";
import "leaflet/dist/leaflet.css";
import "./MapSelector.scss";

const { Title, Text } = Typography;
const { Search } = Input;

// Fix cho default markers trong Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/**
 * MapSelector Component
 * Component để chọn địa điểm trên bản đồ và lấy địa chỉ
 */
const MapSelector = ({
  onLocationSelect,
  initialPosition = [10.8411276, 106.809883],
  initialAddress = "",
  className = "",
  height = "400px",
}) => {
  const mapRef = useRef(null);
  const {
    selectedPosition,
    selectedAddress,
    loading,
    error,
    searchSuggestions,
    previewLocation,
    isPreviewMode,
    searchQuery,
    handleMapClick,
    handleSearchSuggestions,
    handleSuggestionClick,
    handleConfirmSelection,
    handleCancelPreview,
    handleCurrentLocation,
    setError,
    clearError,
    setSearchQuery
  } = useMapSelector(onLocationSelect);

  // Component để handle click events trên map
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        handleMapClick(lat, lng);
      },
    });
    return null;
  };

  // Handle search input change
  const onSearchChange = (value) => {
    handleSearchSuggestions(value);
  };

  // Handle search input
  const onSearch = (value) => {
    handleSearchSuggestions(value);
  };

  // Handle suggestion selection
  const onSelect = (value, option) => {
    // Prevent the input from being updated with the full suggestion text
    const suggestion = searchSuggestions.find(s => s.id === option.key);
    if (suggestion) {
      handleSuggestionClick(suggestion);
    }
  };

  return (
    <div className={`map-selector ${className}`}>
      <Card
        title={
          <Space>
            <EnvironmentOutlined />
            <span>Chọn địa điểm trên bản đồ</span>
          </Space>
        }
      >
        {/* Search Bar */}
        <div className="map-search">
          <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
            <AutoComplete
              placeholder="Tìm kiếm địa điểm..."
              value={searchQuery}
              onSearch={onSearch}
              onChange={onSearchChange}
              onSelect={onSelect}
              options={searchSuggestions.map(suggestion => ({
                value: suggestion.display_name,
                key: suggestion.id,
                label: suggestion.display_name
              }))}
              style={{ flex: 1 }}
              size="large"
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy địa điểm"}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleCurrentLocation}
              loading={loading}
              title="Vị trí hiện tại"
            />
          </Space.Compact>
        </div>

        {/* Error Display */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={clearError}
          />
        )}

        {/* Preview Mode */}
        {isPreviewMode && previewLocation && (
          <Alert
            message="Xem trước địa điểm"
            description={
              <div>
                <Text strong>{previewLocation.display_name}</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<CheckOutlined />}
                      onClick={handleConfirmSelection}
                    >
                      Xác nhận chọn địa điểm này
                    </Button>
                    <Button 
                      icon={<CloseOutlined />}
                      onClick={handleCancelPreview}
                    >
                      Hủy
                    </Button>
                  </Space>
                </div>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Map Container */}
        <div className="map-container" style={{ height }}>
          {loading && (
            <div className="map-loading">
              <Spin size="large" />
              <Text>Đang tải...</Text>
            </div>
          )}

          <MapContainer
            center={selectedPosition}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Click handler */}
            <MapClickHandler />

            {/* Selected marker */}
            <Marker position={selectedPosition}>
              <Popup>
                <div>
                  <Title level={5}>Vị trí đã chọn</Title>
                  <Text>{selectedAddress}</Text>
                  <br />
                  <Text type="secondary">
                    Tọa độ: {selectedPosition[0].toFixed(6)},{" "}
                    {selectedPosition[1].toFixed(6)}
                  </Text>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Selected Location Info */}
        {selectedAddress && (
          <div className="location-info">
            <Title level={5}>
              <EnvironmentOutlined /> Địa điểm đã chọn:
            </Title>
            <Text>{selectedAddress}</Text>
            <br />
            <Text type="secondary">
              Tọa độ: {selectedPosition[0].toFixed(6)},{" "}
              {selectedPosition[1].toFixed(6)}
            </Text>
          </div>
        )}

        {/* Instructions */}
        <div className="map-instructions">
          <Text type="secondary">
            💡 Nhấp vào bản đồ để chọn vị trí hoặc tìm kiếm địa điểm
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MapSelector;
