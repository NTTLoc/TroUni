import React, { useEffect } from "react";
import { Card, Input, Typography, Spin } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

const { Title } = Typography;

const JoinRoomCard = ({
  name,
  setName,
  roomId,
  setRoomId,
  loading,
  onJoin,
}) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryName = searchParams.get("name");
    const queryRoomId = searchParams.get("roomId");

    if (queryName) setName(queryName);
    if (queryRoomId) setRoomId(queryRoomId);

    // Nếu có đủ cả 2 field thì tự động join luôn
    if (queryName && queryRoomId) {
      const timer = setTimeout(() => {
        onJoin();
      }, 300); // delay nhẹ để set state xong
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const hasQuery = !!(searchParams.get("name") && searchParams.get("roomId"));

  if (hasQuery) {
    return (
      <div className="auto-join-loading">
        <Spin tip="Đang kết nối vào phòng họp..." size="large" />
      </div>
    );
  }

  return (
    <Card className="join-room-card">
      <Title level={3}>
        <VideoCameraOutlined /> Tham gia phòng họp
      </Title>

      <Input
        placeholder="Tên của bạn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <Input
        placeholder="Mã phòng"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* Không hiển thị nút (auto-join) */}
    </Card>
  );
};

export default JoinRoomCard;
