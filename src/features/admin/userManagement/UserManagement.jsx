import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Spin,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getAllUsersApi } from "../../../services/userApi";
import "./UserManagement.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Gắn nhãn vai trò tiếng Việt
  const renderRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "MANAGER":
        return "Quản lý";
      case "LANDLORD":
        return "Chủ trọ";
      case "STUDENT":
        return "Người dùng";
      default:
        return "Không xác định";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleRowClick = (record) => {
    message.info(`Xem chi tiết: ${record.fullName || record.username}`);
    console.log("Thông tin chi tiết người dùng:", record);
    // sau này bạn có thể mở modal hoặc chuyển trang chi tiết tại đây
  };

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng để xóa.");
      return;
    }
    message.success(`Đã xóa ${selectedRowKeys.length} người dùng.`);
    // TODO: Gọi API xóa ở đây
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      render: (text) => text || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Người dùng", value: "STUDENT" },
        { text: "Chủ trọ", value: "LANDLORD" },
        { text: "Quản lý", value: "MANAGER" },
        { text: "Quản trị viên", value: "ADMIN" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        const colorMap = {
          ADMIN: "red",
          MANAGER: "purple",
          LANDLORD: "blue",
          STUDENT: "green",
        };
        return <Tag color={colorMap[role]}>{renderRoleLabel(role)}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Hoạt động", value: "ACTIVE" },
        { text: "Vô hiệu hóa", value: "INACTIVE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "orange"}>
          {status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hóa"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <div className="user-header">
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
            className="refresh-btn"
          >
            Làm mới
          </Button>
          <Popconfirm
            title="Xác nhận xóa người dùng đã chọn?"
            onConfirm={handleDeleteSelected}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              className="delete-btn"
            >
              Xóa đã chọn
            </Button>
          </Popconfirm>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <Spin tip="Đang tải người dùng..." />
        </div>
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={filteredUsers.map((u) => ({ ...u, key: u.id }))}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      )}
    </div>
  );
};

export default UserManagement;
