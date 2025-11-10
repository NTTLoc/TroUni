import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Spin,
  Modal,
  Form,
  Select,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getAllUsersApi,
  updateUserApi,
  deleteUserApi,
} from "../../../services/userApi";
import "./UserManagement.scss";
import useMessage from "../../../hooks/useMessage";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const message = useMessage();

  // 🔹 Lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      const data = Array.isArray(res.data) ? res.data : [];

      // 🔹 Sắp xếp theo createdAt mới nhất
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUsers(sortedData);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách người dùng:", err);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Hiển thị nhãn vai trò
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

  // 🔹 Lọc người dùng theo tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // 🔹 Chỉnh sửa người dùng
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateUserApi(editingUser.id, values);
      message.success("Cập nhật người dùng thành công!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      message.error("Không thể cập nhật người dùng");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mở modal xác nhận xóa
  const openDeleteModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng để xóa.");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  // 🔹 Thực hiện xóa người dùng
  const handleDeleteSelected = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteUserApi(id)));
      message.success(`Đã xóa ${selectedRowKeys.length} người dùng.`);
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa người dùng:", err);
      message.error("Không thể xóa người dùng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cấu hình bảng
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
        { text: "Bị khóa", value: "LOCKED" },
        { text: "Tạm đình chỉ", value: "SUSPENDED" },
        { text: "Đã xóa", value: "DELETED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colorMap = {
          ACTIVE: "green",
          LOCKED: "orange",
          SUSPENDED: "purple",
          DELETED: "red",
        };

        const labelMap = {
          ACTIVE: "Hoạt động",
          LOCKED: "Bị khóa",
          SUSPENDED: "Tạm đình chỉ",
          DELETED: "Đã xóa",
        };

        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
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
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            className="delete-btn"
            onClick={openDeleteModal}
          >
            Xóa đã chọn
          </Button>
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
        />
      )}

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="STUDENT">Người dùng</Select.Option>
              <Select.Option value="LANDLORD">Chủ trọ</Select.Option>
              <Select.Option value="MANAGER">Quản lý</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="LOCKED">Bị khóa</Select.Option>
              <Select.Option value="SUSPENDED">Tạm đình chỉ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 🗑️ Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa người dùng"
        open={isDeleteModalOpen}
        onOk={handleDeleteSelected}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
        centered
      >
        <p>
          Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong>{" "}
          người dùng đã chọn không?
        </p>
        <p style={{ color: "gray", fontSize: "13px" }}>
          Hành động này sẽ đặt trạng thái người dùng thành <b>DELETED</b>.
        </p>
      </Modal>
    </div>
  );
};

export default UserManagement;
