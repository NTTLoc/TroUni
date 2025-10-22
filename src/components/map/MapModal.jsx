import React from "react";
import { Modal, Typography, Space } from "antd";
import { EnvironmentOutlined, LinkOutlined } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import GoongTileLayer from "./GoongTileLayer";
import "leaflet/dist/leaflet.css";

const { Title, Text } = Typography;

// Fix cho default markers trong Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/**
 * MapModal Component
 * Modal hiển thị bản đồ với vị trí cụ thể
 */
const MapModal = ({ 
  visible, 
  onClose, 
  latitude, 
  longitude, 
  address, 
  title = "Vị trí phòng trọ"
}) => {
  const position = [latitude, longitude];

  // Tạo link Google Maps và Goong Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const goongMapsUrl = `https://map.goong.io/?lat=${latitude}&lng=${longitude}&zoom=16`;

  return (
    <Modal
      title={
        <Space>
          <EnvironmentOutlined />
          <span>{title}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {address}
        </Text>
      </div>

      {/* Map Container */}
      <div style={{ height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <GoongTileLayer layerType="BASIC" />
          <Marker position={position}>
            <Popup>
              <div>
                <Title level={5}>{title}</Title>
                <Text>{address}</Text>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Space>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: "#1890ff" }}
          >
            <LinkOutlined /> Mở Google Maps
          </a>
          <a 
            href={goongMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: "#1890ff" }}
          >
            <LinkOutlined /> Mở Goong Maps
          </a>
        </Space>
      </div>
    </Modal>
  );
};

export default MapModal;

