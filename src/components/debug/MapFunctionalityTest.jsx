/**
 * Map Functionality Test Component
 * Component để test tất cả chức năng map sau khi sửa lỗi
 */

import React, { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Alert,
  Divider,
  Row,
  Col,
} from "antd";
import {
  EnvironmentOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import GoongMapSelector from "../map/GoongMapSelector";
import { goongApi } from "../../services/goongApi";

const { Title, Text, Paragraph } = Typography;

const MapFunctionalityTest = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    console.log("✅ Location selected:", locationData);

    // Test parse address
    testAddressParsing(locationData);
  };

  const testAddressParsing = async (locationData) => {
    setLoading(true);
    const results = [];

    try {
      // Test 1: Kiểm tra địa chỉ có được parse đúng không
      const addressDetails = locationData.addressDetails;
      results.push({
        test: "Parse địa chỉ",
        status:
          addressDetails && (addressDetails.city || addressDetails.district)
            ? "PASS"
            : "FAIL",
        details: `City: ${addressDetails?.city || "N/A"}, District: ${
          addressDetails?.district || "N/A"
        }, Ward: ${addressDetails?.ward || "N/A"}`,
      });

      // Test 2: Kiểm tra reverse geocoding
      try {
        const reverseResult = await goongApi.reverseGeocode(
          locationData.latitude,
          locationData.longitude
        );
        results.push({
          test: "Reverse Geocoding",
          status: reverseResult.display_name ? "PASS" : "FAIL",
          details: reverseResult.display_name || "No address found",
        });
      } catch (error) {
        results.push({
          test: "Reverse Geocoding",
          status: "FAIL",
          details: error.message,
        });
      }

      // Test 3: Kiểm tra search functionality
      try {
        const searchResults = await goongApi.searchPlaces("Quận 1, TP.HCM", {
          limit: 3,
        });
        results.push({
          test: "Search Places",
          status: searchResults.length > 0 ? "PASS" : "FAIL",
          details: `Found ${searchResults.length} results`,
        });
      } catch (error) {
        results.push({
          test: "Search Places",
          status: "FAIL",
          details: error.message,
        });
      }
    } catch (error) {
      results.push({
        test: "General Test",
        status: "FAIL",
        details: error.message,
      });
    } finally {
      setLoading(false);
      setTestResults(results);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    const results = [];

    try {
      // Test API connectivity
      const testLocation = { lat: 10.8231, lng: 106.6297 };
      const reverseResult = await goongApi.reverseGeocode(
        testLocation.lat,
        testLocation.lng
      );

      results.push({
        test: "API Connectivity",
        status: reverseResult.display_name ? "PASS" : "FAIL",
        details: reverseResult.display_name || "API not responding",
      });

      // Test search functionality
      const searchResults = await goongApi.searchPlaces("TP.HCM", { limit: 5 });
      results.push({
        test: "Search Functionality",
        status: searchResults.length > 0 ? "PASS" : "FAIL",
        details: `Found ${searchResults.length} search results`,
      });

      // Test place detail
      if (searchResults.length > 0) {
        const placeDetail = await goongApi.getPlaceDetail(
          searchResults[0].place_id
        );
        results.push({
          test: "Place Detail",
          status: placeDetail.lat && placeDetail.lng ? "PASS" : "FAIL",
          details: `Place: ${placeDetail.display_name}`,
        });
      }
    } catch (error) {
      results.push({
        test: "API Test",
        status: "FAIL",
        details: error.message,
      });
    } finally {
      setLoading(false);
      setTestResults(results);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2}>🧪 Map Functionality Test</Title>

      <Paragraph>
        Component này để test tất cả chức năng map sau khi sửa lỗi parse địa chỉ
        và marker positioning.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="🗺️ Interactive Map Test" size="small">
            <GoongMapSelector
              onLocationSelect={handleLocationSelect}
              initialPosition={[10.8231, 106.6297]}
              initialAddress=""
              height="400px"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📊 Test Results" size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={runAllTests}
                loading={loading}
                block
              >
                Run All Tests
              </Button>

              {selectedLocation && (
                <Alert
                  message="✅ Location Selected"
                  description={
                    <div>
                      <div>
                        <strong>Address:</strong> {selectedLocation.address}
                      </div>
                      <div>
                        <strong>Coordinates:</strong>{" "}
                        {selectedLocation.latitude.toFixed(6)},{" "}
                        {selectedLocation.longitude.toFixed(6)}
                      </div>
                      <div>
                        <strong>City:</strong>{" "}
                        {selectedLocation.addressDetails?.city || "N/A"}
                      </div>
                      <div>
                        <strong>District:</strong>{" "}
                        {selectedLocation.addressDetails?.district || "N/A"}
                      </div>
                      <div>
                        <strong>Ward:</strong>{" "}
                        {selectedLocation.addressDetails?.ward || "N/A"}
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              )}

              {testResults.length > 0 && (
                <div>
                  <Title level={5}>Test Results:</Title>
                  {testResults.map((result, index) => (
                    <Alert
                      key={index}
                      message={result.test}
                      description={result.details}
                      type={result.status === "PASS" ? "success" : "error"}
                      showIcon
                      style={{ marginBottom: "8px" }}
                    />
                  ))}
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="🔧 Test Scenarios" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" title="📍 Test 1: Search & Select">
              <Space direction="vertical">
                <Text>1. Search for "Quận 1, TP.HCM"</Text>
                <Text>2. Select from suggestions</Text>
                <Text>3. Check preview mode</Text>
                <Text>4. Click "Xác nhận"</Text>
                <Text>5. Verify address parsing</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card size="small" title="🗺️ Test 2: Map Interaction">
              <Space direction="vertical">
                <Text>1. Click on map</Text>
                <Text>2. Drag marker</Text>
                <Text>3. Check marker positioning</Text>
                <Text>4. Verify no overlap with forms</Text>
                <Text>5. Test responsive design</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card size="small" title="🔍 Test 3: Address Parsing">
              <Space direction="vertical">
                <Text>1. Test with TP.HCM locations</Text>
                <Text>2. Test with Hà Nội locations</Text>
                <Text>3. Verify city parsing</Text>
                <Text>4. Verify district parsing</Text>
                <Text>5. Verify ward parsing</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card
        title="📋 Expected Results"
        size="small"
        style={{ marginTop: "16px" }}
      >
        <Space direction="vertical">
          <Text>
            ✅ <strong>Search:</strong> Suggestions appear when typing
          </Text>
          <Text>
            ✅ <strong>Preview:</strong> Preview mode shows before confirmation
          </Text>
          <Text>
            ✅ <strong>Parsing:</strong> Address components parsed correctly
          </Text>
          <Text>
            ✅ <strong>Positioning:</strong> Marker doesn't overlap with forms
          </Text>
          <Text>
            ✅ <strong>Responsive:</strong> Map works on mobile devices
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default MapFunctionalityTest;
