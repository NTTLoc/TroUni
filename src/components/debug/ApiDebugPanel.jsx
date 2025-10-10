import React, { useState } from "react";
import { Button, Card, Space, Typography, Alert, Divider } from "antd";
import {
  BugOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import {
  testApiConnection,
  testCreateRoomComplete,
  testCreateRoomMinimal,
  debugRequestHeaders,
} from "../../utils/apiDebug";
import { createRoomApi, getAllRoomsApi } from "../../services/postApi";

const { Title, Text, Paragraph } = Typography;

const ApiDebugPanel = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const runApiTest = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test 1: Debug headers
      console.log("🔍 Running API debug tests...");
      testResults.headers = debugRequestHeaders();

      // Test 2: API connection
      testResults.connection = await testApiConnection();

      setResults(testResults);
    } catch (error) {
      console.error("❌ API test failed:", error);
      testResults.error = error.message || "Unknown error";
      setResults(testResults);
    } finally {
      setLoading(false);
    }
  };

  const testCompleteRoom = async () => {
    setLoading(true);
    try {
      const result = await testCreateRoomComplete();
      setResults((prev) => ({
        ...prev,
        completeTest: { success: true, data: result },
      }));
    } catch (error) {
      console.error("❌ Complete test failed:", error);
      setResults((prev) => ({
        ...prev,
        completeTest: { success: false, error: error.message || error },
      }));
    } finally {
      setLoading(false);
    }
  };

  const testMinimalRoom = async () => {
    setLoading(true);
    try {
      const result = await testCreateRoomMinimal();
      setResults((prev) => ({
        ...prev,
        minimalTest: { success: true, data: result },
      }));
    } catch (error) {
      console.error("❌ Minimal test failed:", error);
      setResults((prev) => ({
        ...prev,
        minimalTest: { success: false, error: error.message || error },
      }));
    } finally {
      setLoading(false);
    }
  };

  const testGetAllRooms = async () => {
    try {
      setLoading(true);
      console.log("🧪 Testing getAllRooms API...");
      const response = await getAllRoomsApi({ page: 0, size: 10 });
      console.log("📦 getAllRooms response:", response);
      setResults((prev) => ({
        ...prev,
        getAllRooms: { success: true, data: response },
      }));
    } catch (error) {
      console.error("❌ getAllRooms error:", error);
      setResults((prev) => ({
        ...prev,
        getAllRooms: { success: false, error: error.message || error },
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3}>
            <BugOutlined /> API Debug Panel
          </Title>
          <Paragraph>
            Sử dụng panel này để debug các vấn đề với Room API
          </Paragraph>
        </div>

        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            icon={<ApiOutlined />}
            loading={loading}
            onClick={runApiTest}
            block
          >
            Test API Connection
          </Button>

          <Button
            icon={<DatabaseOutlined />}
            loading={loading}
            onClick={testCompleteRoom}
            block
          >
            Test Tạo Phòng (Dữ liệu đầy đủ)
          </Button>

          <Button
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={testMinimalRoom}
            block
          >
            Test Tạo Phòng (Dữ liệu tối thiểu)
          </Button>

          <Button
            icon={<DatabaseOutlined />}
            loading={loading}
            onClick={testGetAllRooms}
            block
          >
            Test Lấy Danh Sách Phòng
          </Button>
        </Space>

        {Object.keys(results).length > 0 && (
          <>
            <Divider />
            <Title level={4}>Kết quả Test:</Title>

            {results.headers && (
              <Alert
                message="Request Headers"
                description={
                  <div>
                    <Text strong>Base URL:</Text> {results.headers.baseURL}
                    <br />
                    <Text strong>Has Token:</Text>{" "}
                    {results.headers.hasToken ? "✅" : "❌"}
                    <br />
                    <Text strong>Token Preview:</Text>{" "}
                    {results.headers.tokenPreview || "None"}
                  </div>
                }
                type="info"
                style={{ marginBottom: "16px" }}
              />
            )}

            {results.connection !== undefined && (
              <Alert
                message="API Connection"
                description={
                  results.connection
                    ? "✅ Kết nối thành công"
                    : "❌ Kết nối thất bại"
                }
                type={results.connection ? "success" : "error"}
                style={{ marginBottom: "16px" }}
              />
            )}

            {results.createRoom && (
              <Alert
                message="Create Room Test"
                description="✅ Test tạo phòng thành công"
                type="success"
                style={{ marginBottom: "16px" }}
              />
            )}

            {results.completeTest && (
              <Alert
                message="Complete Room Test"
                description={
                  results.completeTest.success
                    ? "✅ Test tạo phòng với dữ liệu đầy đủ thành công"
                    : `❌ Test thất bại: ${results.completeTest.error}`
                }
                type={results.completeTest.success ? "success" : "error"}
                style={{ marginBottom: "16px" }}
              />
            )}

            {results.minimalTest && (
              <Alert
                message="Minimal Room Test"
                description={
                  results.minimalTest.success
                    ? "✅ Test tạo phòng với dữ liệu tối thiểu thành công"
                    : `❌ Test thất bại: ${results.minimalTest.error}`
                }
                type={results.minimalTest.success ? "success" : "error"}
                style={{ marginBottom: "16px" }}
              />
            )}

            {results.getAllRooms && (
              <Alert
                message="Get All Rooms Test"
                description={
                  results.getAllRooms.success
                    ? `✅ Lấy danh sách phòng thành công! Tìm thấy ${
                        results.getAllRooms.data?.data?.content?.length || 0
                      } phòng trọ`
                    : `❌ Test thất bại: ${results.getAllRooms.error}`
                }
                type={results.getAllRooms.success ? "success" : "error"}
                style={{ marginBottom: "16px" }}
              />
            )}

            {results.error && (
              <Alert
                message="Error"
                description={results.error}
                type="error"
                style={{ marginBottom: "16px" }}
              />
            )}
          </>
        )}

        <Divider />

        <div>
          <Title level={4}>Hướng dẫn Debug:</Title>
          <ol>
            <li>
              Mở <Text code>Developer Tools</Text> (F12)
            </li>
            <li>
              Vào tab <Text code>Console</Text>
            </li>
            <li>Chạy các test ở trên</li>
            <li>Kiểm tra logs trong console</li>
            <li>
              Kiểm tra tab <Text code>Network</Text> để xem request/response
            </li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default ApiDebugPanel;
