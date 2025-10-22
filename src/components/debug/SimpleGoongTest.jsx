/**
 * Simple Goong API Test Component
 * Component đơn giản để test Goong API reverse geocoding
 */

import React, { useState } from "react";
import { Card, Button, Input, Space, Alert, Typography, Spin } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { reverseGeocode } from "../../utils/addressParser";

const { Title, Text } = Typography;

const SimpleGoongTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState("10.8231");
  const [lng, setLng] = useState("106.6297");

  const testReverseGeocode = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const addressData = await reverseGeocode(
        parseFloat(lat),
        parseFloat(lng)
      );
      setResult(addressData);
      console.log("✅ Goong API Result:", addressData);
    } catch (err) {
      setError(err.message);
      console.error("❌ Goong API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={3}>🧪 Simple Goong API Test</Title>

      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>Latitude:</Text>
            <Input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="10.8231"
              style={{ marginLeft: "8px", width: "200px" }}
            />
          </div>

          <div>
            <Text strong>Longitude:</Text>
            <Input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="106.6297"
              style={{ marginLeft: "8px", width: "200px" }}
            />
          </div>

          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            onClick={testReverseGeocode}
            loading={loading}
          >
            Test Reverse Geocoding
          </Button>

          {loading && (
            <div style={{ textAlign: "center" }}>
              <Spin />
              <div style={{ marginTop: "10px" }}>
                <Text>Đang gọi Goong API...</Text>
              </div>
            </div>
          )}

          {error && (
            <Alert
              message="❌ API Error"
              description={error}
              type="error"
              showIcon
            />
          )}

          {result && (
            <Alert
              message="✅ API Success"
              description={
                <div>
                  <div>
                    <strong>Display Name:</strong> {result.display_name}
                  </div>
                  <div>
                    <strong>Address:</strong>{" "}
                    {JSON.stringify(result.address, null, 2)}
                  </div>
                  <div>
                    <strong>Raw Data:</strong>{" "}
                    {JSON.stringify(result.raw_data, null, 2)}
                  </div>
                </div>
              }
              type="success"
              showIcon
            />
          )}
        </Space>
      </Card>

      <Card title="📍 Test Coordinates" style={{ marginTop: "20px" }}>
        <Space direction="vertical">
          <div>
            <Text strong>TP.HCM Center:</Text> 10.8231, 106.6297
          </div>
          <div>
            <Text strong>Quận 1:</Text> 10.7769, 106.7009
          </div>
          <div>
            <Text strong>Quận 3:</Text> 10.7829, 106.6879
          </div>
          <div>
            <Text strong>Quận 7:</Text> 10.7377, 106.7225
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SimpleGoongTest;

