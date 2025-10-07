import React, { useState } from "react";
import { getAllRoomsApi, getAllRoomsSimpleApi } from "../../services/roomApi";
import { Spin, Card, Button, Space, Typography, Row, Col, Divider } from "antd";

const { Title, Text } = Typography;

const RoomApiComparison = () => {
  const [paginationResult, setPaginationResult] = useState(null);
  const [simpleResult, setSimpleResult] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  const testPaginationApi = async () => {
    setLoading1(true);
    setError1(null);
    
    try {
      console.log("🧪 Testing Pagination API...");
      const response = await getAllRoomsApi({ page: 0, size: 10 });
      console.log("🧪 Pagination API Response:", response);
      setPaginationResult(response.data);
    } catch (err) {
      console.error("❌ Pagination API Error:", err);
      setError1(err.message);
    } finally {
      setLoading1(false);
    }
  };

  const testSimpleApi = async () => {
    setLoading2(true);
    setError2(null);
    
    try {
      console.log("🧪 Testing Simple API...");
      const response = await getAllRoomsSimpleApi();
      console.log("🧪 Simple API Response:", response);
      setSimpleResult(response.data);
    } catch (err) {
      console.error("❌ Simple API Error:", err);
      setError2(err.message);
    } finally {
      setLoading2(false);
    }
  };

  const testBothApis = async () => {
    await Promise.all([testPaginationApi()]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>🧪 Room API Comparison</Title>
      <Text>So sánh 2 endpoints: GET /rooms (pagination) vs GET /rooms/all (simple)</Text>

      <Row gutter={20} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Card>
            <Title level={4}>1️⃣ Pagination API</Title>
            <Text code>GET /rooms?page=0&size=10</Text>
            <div style={{ marginTop: "10px" }}>
              <Button 
                onClick={testPaginationApi} 
                loading={loading1}
                type="primary"
                block
              >
                {loading1 ? "Testing..." : "Test Pagination API"}
              </Button>
            </div>
            {error1 && (
              <div style={{ marginTop: "10px", color: "red" }}>
                ❌ Error: {error1}
              </div>
            )}
            {paginationResult && (
              <div style={{ marginTop: "10px", background: "#f0f8ff", padding: "10px" }}>
                <Text><strong>✅ Success!</strong></Text><br/>
                <Text><strong>Type:</strong> {typeof paginationResult}</Text><br/>
                {typeof paginationResult === 'object' && (
                  <>
                    <Text><strong>Keys:</strong> {Object.keys(paginationResult).join(", ")}</Text><br/>
                    <Text><strong>Content:</strong> {Array.isArray(paginationResult.content) ? paginationResult.content.length : "N/A"} items</Text><br/>
                    <Text><strong>Total:</strong> {paginationResult.totalElements || "N/A"}</Text>
                  </>
                )}
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={12}>
          <Card>
            <Title level={4}>2️⃣ Simple API</Title>
            <Text code>GET /rooms/all</Text>
            <div style={{ marginTop: "10px" }}>
              <Button 
                onClick={testSimpleApi} 
                loading={loading2}
                type="primary"
                block
              >
                {loading2 ? "Testing..." : "Test Simple API"}
              </Button>
            </div>
            {error2 && (
              <div style={{ marginTop: "10px", color: "red" }}>
                ❌ Error: {error2}
              </div>
            )}
            {simpleResult && (
              <div style={{ marginTop: "10px", background: "#f0f8ff", padding: "10px" }}>
                <Text><strong>✅ Success!</strong></Text><br/>
                <Text><strong>Type:</strong> {typeof simpleResult}</Text><br/>
                <Text><strong>Is Array:</strong> {Array.isArray(simpleResult) ? "Yes" : "No"}</Text><br/>
                <Text><strong>Length:</strong> {Array.isArray(simpleResult) ? simpleResult.length : "N/A"}</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Display data from simple API if available */}
      {simpleResult && Array.isArray(simpleResult) && (
        <div>
          <Title level={3}>📋 Simple API Data ({simpleResult.length} rooms)</Title>
          <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {simpleResult.map((room, index) => (
              <Card 
                key={room.id || index} 
                title={`🏠 ${room.title || "Untitled"}`}
                style={{ borderColor: "#52c41a" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div><strong>ID:</strong> {room.id}</div>
                  <div><strong>Title:</strong> {room.title || "N/A"}</div>
                  <div><strong>Description:</strong> {room.description || "N/A"}</div>
                  <div><strong>City:</strong> {room.city || "N/A"}</div>
                  <div><strong>District:</strong> {room.district || "N/A"}</div>
                  <div><strong>Price:</strong> {room.pricePerMonth ? `${Number(room.pricePerMonth).toLocaleString()} VNĐ` : "N/A"}</div>
                  <div><strong>Area:</strong> {room.areaSqm ? `${room.areaSqm} m²` : "N/A"}</div>
                  <div><strong>Type:</strong> {room.roomType || "N/A"}</div>
                  <div><strong>Status:</strong> {room.status || "N/A"}</div>
                  <div><strong>Images:</strong> {room.images ? room.images.length : "0"} images</div>
                </Space>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Display data from pagination API if available */}
      {paginationResult && paginationResult.content && (
        <div>
          <Title level={3}>📋 Pagination API Data ({paginationResult.content.length} rooms)</Title>
          <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {paginationResult.content.map((room, index) => (
              <Card 
                key={room.id || index} 
                title={`🏠 ${room.title || "Untitled"}`}
                style={{ borderColor: "#1890ff" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div><strong>ID:</strong> {room.id}</div>
                  <div><strong>Title:</strong> {room.title || "N/A"}</div>
                  <div><strong>Description:</strong> {room.description || "N/A"}</div>
                  <div><strong>City:</strong> {room.city || "N/A"}</div>
                  <div><strong>District:</strong> {room.district || "N/A"}</div>
                  <div><strong>Price:</strong> {room.pricePerMonth ? `${Number(room.pricePerMonth).toLocaleString()} VNĐ` : "N/A"}</div>
                  <div><strong>Area:</strong> {room.areaSqm ? `${room.areaSqm} m²` : "N/A"}</div>
                  <div><strong>Type:</strong> {room.roomType || "N/A"}</div>
                  <div><strong>Status:</strong> {room.status || "N/A"}</div>
                  <div><strong>Images:</strong> {room.images ? room.images.length : "0"} images</div>
                </Space>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomApiComparison;
