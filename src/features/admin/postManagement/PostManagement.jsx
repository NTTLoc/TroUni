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
import { getAllRoomsApi } from "../../../services/postApi";
import "./PostManagement.scss";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 🧭 Gọi API lấy danh sách bài đăng
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getAllRoomsApi();
      const data = res.data?.content || res.data || [];

      // Định dạng lại dữ liệu
      setPosts(
        data.map((item, idx) => ({
          key: item.id || idx,
          title: item.title || item.name || "Không có tiêu đề",
          author: item.ownerName || item.user?.fullName || "Chưa rõ",
          status: item.status || "Chờ duyệt",
        }))
      );
    } catch (err) {
      console.error("Lỗi tải danh sách bài đăng:", err);
      message.error("Không thể tải danh sách bài đăng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🧮 Lọc & tìm kiếm
  const filteredPosts = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Khi click vào dòng
  const handleRowClick = (record) => {
    message.info(`Xem chi tiết: ${record.title}`);
    console.log("📄 Chi tiết bài đăng:", record);
  };

  // Xóa nhiều dòng
  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một bài đăng để xóa.");
      return;
    }
    message.success(`Đã xóa ${selectedRowKeys.length} bài đăng.`);
    // TODO: Gọi API xóa thật
  };

  // Render trạng thái với màu
  const renderStatusTag = (status) => {
    let color;
    switch (status) {
      case "Đang hiển thị":
      case "ACTIVE":
        color = "green";
        break;
      case "Chờ duyệt":
      case "PENDING":
        color = "orange";
        break;
      case "Đã ẩn":
      case "HIDDEN":
        color = "volcano";
        break;
      case "Bị từ chối":
      case "REJECTED":
        color = "red";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: "Tiêu đề bài đăng",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "—",
    },
    {
      title: "Người đăng",
      dataIndex: "author",
      key: "author",
      render: (text) => text || "Không rõ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang hiển thị", value: "Đang hiển thị" },
        { text: "Chờ duyệt", value: "Chờ duyệt" },
        { text: "Đã ẩn", value: "Đã ẩn" },
        { text: "Bị từ chối", value: "Bị từ chối" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => renderStatusTag(status),
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
    <div className="post-management">
      <div className="post-header">
        <Input
          placeholder="Tìm kiếm theo tiêu đề hoặc người đăng..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPosts}
            loading={loading}
            className="refresh-btn"
          >
            Làm mới
          </Button>

          <Popconfirm
            title="Xác nhận xóa bài đăng đã chọn?"
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
          <Spin tip="Đang tải bài đăng..." />
        </div>
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={filteredPosts}
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

export default PostManagement;
