import React from "react";
import { Card, Button, Descriptions } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Account = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Card title="Thông tin tài khoản" bordered>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Họ tên">
            {auth?.user?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {auth?.user?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">Người dùng</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Button type="primary" onClick={() => navigate("/change-password")}>
            Đổi mật khẩu
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Account;
