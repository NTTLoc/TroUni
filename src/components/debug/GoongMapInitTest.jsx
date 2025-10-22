/**
 * Goong Map Initialization Test Component
 * Component để test Goong Maps SDK initialization
 */

import React, { useRef, useEffect, useState } from "react";
import { Card, Button, Space, Typography, Alert, Spin } from "antd";
import { EnvironmentOutlined, ReloadOutlined } from "@ant-design/icons";
import { GOONG_CONFIG } from "../../utils/goongConfig";

const { Title, Text } = Typography;

const GoongMapInitTest = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sdkInfo, setSdkInfo] = useState(null);

  // Initialize Goong Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      setLoading(true);
      setError(null);

      try {
        // Import Goong Maps SDK dynamically
        const goongjs = await import("@goongmaps/goong-js");

        console.log("✅ Goong Maps SDK loaded:", goongjs);
        console.log("✅ Available classes:", Object.keys(goongjs));

        // Set SDK info
        setSdkInfo({
          version: goongjs.version || "Unknown",
          availableClasses: Object.keys(goongjs),
          hasMap: !!goongjs.Map,
          hasMarker: !!goongjs.Marker,
          hasPopup: !!goongjs.Popup,
          hasNavigationControl: !!goongjs.NavigationControl,
          hasGeocoder: !!goongjs.Geocoder,
        });

        // Initialize map
        map.current = new goongjs.Map({
          container: mapContainer.current,
          style: "https://tiles.goong.io/assets/goong_map_web.json",
          center: [106.6297, 10.8231], // TP.HCM [lng, lat]
          zoom: 15,
          accessToken: GOONG_CONFIG.MAPTILES_KEY,
        });

        // Add navigation control (nếu có)
        try {
          if (goongjs.NavigationControl) {
            map.current.addControl(
              new goongjs.NavigationControl(),
              "top-right"
            );
            console.log("✅ NavigationControl added");
          }
        } catch (err) {
          console.warn("NavigationControl not available:", err);
        }

        // Add marker
        marker.current = new goongjs.Marker({
          draggable: true,
          color: "#ff4d4f",
        })
          .setLngLat([106.6297, 10.8231])
          .addTo(map.current);

        // Add popup
        const popup = new goongjs.Popup({ offset: 25 }).setHTML(`
            <div>
              <h5>🗺️ Goong Maps SDK Test</h5>
              <p>TP.HCM Center</p>
              <p>Coordinates: 10.8231, 106.6297</p>
            </div>
          `);

        marker.current.setPopup(popup);

        // Add click event listener
        map.current.on("click", (e) => {
          const { lng, lat } = e.lngLat;
          console.log("📍 Map clicked at:", lat, lng);

          // Update marker position
          marker.current.setLngLat([lng, lat]);

          // Update popup
          const newPopup = new goongjs.Popup({ offset: 25 }).setHTML(`
              <div>
                <h5>📍 New Location</h5>
                <p>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
              </div>
            `);

          marker.current.setPopup(newPopup);
        });

        // Add marker drag event listener
        marker.current.on("dragend", () => {
          const lngLat = marker.current.getLngLat();
          console.log("📍 Marker dragged to:", lngLat.lat, lngLat.lng);
        });

        // Map load event
        map.current.on("load", () => {
          console.log("✅ Goong Map loaded successfully");
          setMapLoaded(true);
        });

        setMapLoaded(true);
      } catch (error) {
        console.error("❌ Error initializing Goong Map:", error);
        setError(`Không thể khởi tạo bản đồ: ${error.message}`);
      } finally {
        setLoading(false);
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
  }, []);

  const resetMap = () => {
    if (!map.current) return;

    try {
      map.current.flyTo({
        center: [106.6297, 10.8231],
        zoom: 15,
      });
      marker.current.setLngLat([106.6297, 10.8231]);
      console.log("✅ Map reset to TP.HCM center");
    } catch (error) {
      console.error("❌ Error resetting map:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2}>🧪 Goong Map Initialization Test</Title>

      <Card title="🔧 SDK Information" style={{ marginBottom: "20px" }}>
        {sdkInfo ? (
          <Space direction="vertical">
            <div>
              <Text strong>Version:</Text> {sdkInfo.version}
            </div>
            <div>
              <Text strong>Available Classes:</Text>{" "}
              {sdkInfo.availableClasses.join(", ")}
            </div>
            <div>
              <Text strong>Has Map:</Text> {sdkInfo.hasMap ? "✅" : "❌"}
            </div>
            <div>
              <Text strong>Has Marker:</Text> {sdkInfo.hasMarker ? "✅" : "❌"}
            </div>
            <div>
              <Text strong>Has Popup:</Text> {sdkInfo.hasPopup ? "✅" : "❌"}
            </div>
            <div>
              <Text strong>Has NavigationControl:</Text>{" "}
              {sdkInfo.hasNavigationControl ? "✅" : "❌"}
            </div>
            <div>
              <Text strong>Has Geocoder:</Text>{" "}
              {sdkInfo.hasGeocoder ? "✅" : "❌"}
            </div>
          </Space>
        ) : (
          <Text>Loading SDK information...</Text>
        )}
      </Card>

      <Card title="🎮 Map Controls" style={{ marginBottom: "20px" }}>
        <Space wrap>
          <Button
            icon={<ReloadOutlined />}
            onClick={resetMap}
            disabled={!mapLoaded}
          >
            Reset to TP.HCM
          </Button>
        </Space>
      </Card>

      <Card title="🗺️ Goong Map">
        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "10px" }}>
              <Text>Đang khởi tạo Goong Maps SDK...</Text>
            </div>
          </div>
        )}

        {error && (
          <Alert
            message="❌ SDK Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        {mapLoaded && (
          <Alert
            message="✅ SDK Loaded"
            description="Goong Maps SDK đã được khởi tạo thành công!"
            type="success"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        <div
          ref={mapContainer}
          style={{
            height: "500px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #d9d9d9",
          }}
        />

        <div style={{ marginTop: "16px" }}>
          <Text type="secondary">
            💡 Click vào bản đồ để di chuyển marker, hoặc kéo marker để thay đổi
            vị trí
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default GoongMapInitTest;

