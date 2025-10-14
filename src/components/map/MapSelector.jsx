import React, { useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Card, Button, Input, Space, Alert, Typography, Spin } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
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
    handleMapClick,
    handleSearch,
    handleCurrentLocation,
    setError,
    clearError,
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

  // Handle search
  const onSearch = (value) => {
    handleSearch(value);
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
            <Search
              placeholder="Tìm kiếm địa điểm..."
              onSearch={onSearch}
              loading={loading}
              enterButton={<SearchOutlined />}
              size="large"
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
