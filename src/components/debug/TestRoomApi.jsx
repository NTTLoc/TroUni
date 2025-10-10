import React, { useState, useEffect } from "react";
import { getAllRoomsApi } from "../../services/postApi";
import { Spin, Card, Button, Space, Typography } from "antd";

const { Title, Text } = Typography;

const TestRoomApi = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  // Debug: track state changes
  console.log("🧪 TestRoomApi: Component render - rooms:", rooms.length, rooms);
  console.log("🧪 TestRoomApi: Component render - stats:", stats);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    console.log("🧪 TestRoomApi: Starting fetchRooms...");

    try {
      console.log("🧪 TestRoomApi: Fetching all rooms from database...");
      const response = await getAllRoomsApi({ page: 0, size: 10 });
      console.log("🧪 TestRoomApi: getAllRoomsApi completed successfully!");

      console.log("🧪 TestRoomApi: Full API response:", response);
      console.log("🧪 TestRoomApi: Response data:", response.data);
      console.log("🧪 TestRoomApi: Response status:", response.status);
      console.log("🧪 TestRoomApi: Response.data type:", typeof response.data);
      console.log(
        "🧪 TestRoomApi: Response.data keys:",
        Object.keys(response.data || {})
      );

      const roomsData = response.data?.content || [];
      console.log("🧪 TestRoomApi: Rooms data:", roomsData);
      console.log(
        "🧪 TestRoomApi: Rooms data length:",
        roomsData.length ? roomsData.length : "NO LENGTH"
      );

      console.log("🧪 TestRoomApi: Setting rooms state with:", roomsData);
      setRooms(roomsData);
      console.log("🧪 TestRoomApi: setRooms called!");

      const newStats = {
        total: response.data?.totalElements || 0,
        currentPage: response.data?.number || 0,
        totalPages: response.data?.totalPages || 0,
        pageSize: response.data?.size || 0,
      };
      console.log("🧪 TestRoomApi: Setting stats state with:", newStats);
      setStats(newStats);
      console.log("🧪 TestRoomApi: setStats called!");

      console.log("🧪 TestRoomApi: State updated successfully!");
    } catch (err) {
      console.error("❌ TestRoomApi: Error fetching rooms:", err);
      console.error("❌ TestRoomApi: Error details:", err.message, err.stack);
      setError(err?.message || "Failed to fetch rooms");
    } finally {
      console.log("🧪 TestRoomApi: Setting loading to false...");
      setLoading(false);
      console.log("🧪 TestRoomApi: fetchRooms completed!");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: "10px" }}>Đang tải dữ liệu từ database...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Card
          style={{
            margin: "10px",
            background: "#fff2f0",
            borderColor: "#ff4d4f",
          }}
        >
          <Title level={4} style={{ color: "#ff4d4f" }}>
            ❌ Lỗi API
          </Title>
          <Text>{error}</Text>
          <div style={{ marginTop: "10px" }}>
            <Button onClick={fetchRooms} type="primary" danger>
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>🧪 Test Room API - Database Data</Title>

      {/* Stats Card */}
      <Card style={{ marginBottom: "20px" }}>
        <Title level={4}>📊 Thống kê API</Title>
        <Space direction="vertical">
          <Text>
            <strong>Tổng số phòng:</strong> {stats.total}
          </Text>
          <Text>
            <strong>Trang hiện tại:</strong> {stats.currentPage + 1}/
            {stats.totalPages}
          </Text>
          <Text>
            <strong>Số phòng/trang:</strong> {stats.pageSize}
          </Text>
          <Text>
            <strong>Số phòng đang hiển thị:</strong> {rooms.length}
          </Text>
        </Space>
        <div style={{ marginTop: "10px" }}>
          <Button onClick={fetchRooms} type="primary">
            🔄 Refresh Data
          </Button>
        </div>
      </Card>

      {/* Rooms List */}
      <Title level={3}>🏠 Danh sách phòng từ database</Title>

      {rooms.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <Text>Không có data trong database</Text>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {rooms.map((room, index) => (
            <Card
              key={room.id || index}
              title={`🏠 ${room.title || "Không có tiêu đề"}`}
              style={{ borderColor: "#52c41a" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <strong>ID:</strong> {room.id}
                </div>
                <div>
                  <strong>Tiêu đề:</strong> {room.title || "Không có"}
                </div>
                <div>
                  <strong>Mô tả:</strong> {room.description || "Không có"}
                </div>
                <div>
                  <strong>Địa chỉ:</strong> {room.streetAddress || "Không có"}
                </div>
                <div>
                  <strong>Thành phố:</strong> {room.city || "Không có"}
                </div>
                <div>
                  <strong>Quận:</strong> {room.district || "Không có"}
                </div>
                <div>
                  <strong>Phường:</strong> {room.ward || "Không có"}
                </div>
                <div>
                  <strong>Giá:</strong>{" "}
                  {room.pricePerMonth
                    ? `${room.pricePerMonth.toLocaleString()} VNĐ`
                    : "Không có"}
                </div>
                <div>
                  <strong>Diện tích:</strong>{" "}
                  {room.areaSqm ? `${room.areaSqm} m²` : "Không có"}
                </div>
                <div>
                  <strong>Loại phòng:</strong> {room.roomType || "Không có"}
                </div>
                <div>
                  <strong>Trạng thái:</strong> {room.status || "Không có"}
                </div>
                <div>
                  <strong>Ngày tạo:</strong>{" "}
                  {room.createdAt
                    ? new Date(room.createdAt).toLocaleString()
                    : "Không có"}
                </div>
                <div>
                  <strong>Số ảnh:</strong>{" "}
                  {room.images ? room.images.length : "0"}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestRoomApi;
