/**
 * Goong Map Modal Component
 * Modal hiển thị bản đồ Goong với vị trí cụ thể
 */

import React, { useRef, useEffect } from "react";
import { Modal, Typography, Space } from "antd";
import { EnvironmentOutlined, LinkOutlined } from "@ant-design/icons";
import { GOONG_CONFIG } from "../../utils/goongConfig";

const { Title, Text } = Typography;

/**
 * Goong Map Modal Component
 * Modal hiển thị bản đồ Goong với vị trí cụ thể
 */
const GoongMapModal = ({ 
  visible, 
  onClose, 
  latitude, 
  longitude, 
  address, 
  title = "Vị trí phòng trọ"
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  // Initialize Goong Map
  useEffect(() => {
    if (!visible || !mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        // Import Goong Maps SDK dynamically
        const goongjs = await import('@goongmaps/goong-js');
        
        // Initialize map
        map.current = new goongjs.Map({
          container: mapContainer.current,
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: [longitude, latitude], // [lng, lat]
          zoom: 16,
          accessToken: GOONG_CONFIG.MAPTILES_KEY
        });

        // Add marker
        marker.current = new goongjs.Marker({
          color: '#ff4d4f'
        })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

        // Add popup
        const popup = new goongjs.Popup({ offset: 25 })
          .setHTML(`
            <div>
              <h5>${title}</h5>
              <p>${address}</p>
            </div>
          `);

        marker.current.setPopup(popup);

      } catch (error) {
        console.error('❌ Error initializing Goong Map:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [visible, latitude, longitude, address, title]);

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
        <div
          ref={mapContainer}
          style={{ height: "100%", width: "100%" }}
        />
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

export default GoongMapModal;
