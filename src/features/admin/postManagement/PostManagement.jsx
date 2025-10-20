import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Spin,
  Modal,
  Form,
  Select,
  InputNumber,
  Image,
  Divider,
  List,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getPaginatedRoomsApi,
  getRoomByIdApi,
  updateRoomApi,
  deleteRoomApi, // ✅ thêm import đúng
} from "../../../services/postApi";
import "./PostManagement.scss";
import useMessage from "../../../hooks/useMessage";

const { TextArea } = Input;
const { Option } = Select;

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [form] = Form.useForm();
  const message = useMessage();

  // 🧭 Lấy danh sách bài đăng
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPaginatedRoomsApi();
      const data = res.data?.content || res.data || [];
      setPosts(
        data.map((item, idx) => ({
          key: item.id || idx,
          id: item.id,
          title: item.title || "Không có tiêu đề",
          author: item.owner?.username || "Chưa rõ",
          status: item.status || "pending",
        }))
      );
    } catch (err) {
      console.error("❌ Lỗi tải danh sách bài đăng:", err);
      message.error("Không thể tải danh sách bài đăng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🧮 Lọc tìm kiếm
  const filteredPosts = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // 🎯 Khi click vào dòng -> xem chi tiết
  const handleRowClick = async (record) => {
    try {
      setLoading(true);
      const res = await getRoomByIdApi(record.id);
      const room = res.data;
      setCurrentRoom(room);

      form.setFieldsValue({
        title: room.title,
        description: room.description,
        roomType: room.roomType,
        streetAddress: room.streetAddress,
        city: room.city,
        district: room.district,
        ward: room.ward,
        latitude: room.latitude,
        longitude: room.longitude,
        pricePerMonth: room.pricePerMonth,
        areaSqm: room.areaSqm,
        status: room.status,
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error("❌ Lỗi tải chi tiết phòng:", err);
      message.error("Không thể tải chi tiết bài đăng.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Render trạng thái
  const renderStatusTag = (status) => {
    const colorMap = {
      available: "green",
      rented: "orange",
      hidden: "volcano",
      pending: "blue",
    };
    const labelMap = {
      available: "Sẵn có",
      rented: "Đã thuê",
      hidden: "Ẩn",
      pending: "Chờ duyệt",
    };
    return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
  };

  // 💾 Lưu thay đổi
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updatedRoom = {
        ...currentRoom,
        ...values,
        images: currentRoom.images?.map((img) =>
          typeof img === "string" ? img : img.imageUrl
        ),
        amenities:
          currentRoom.amenities?.map((a) => ({
            id: a.id,
            name: a.name,
          })) || [],
      };

      await updateRoomApi(currentRoom.id, updatedRoom);
      message.success("Cập nhật bài đăng thành công!");
      setIsEditing(false);
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      message.error("Không thể lưu thay đổi!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mở modal xác nhận xóa
  const openDeleteModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một bài đăng để xóa.");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  // 🗑️ Xóa bài đăng đã chọn
  const handleDeleteSelected = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteRoomApi(id)));
      message.success(`Đã xóa ${selectedRowKeys.length} bài đăng.`);
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error("❌ Lỗi khi xóa bài đăng:", err);
      message.error("Không thể xóa bài đăng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Cấu hình bảng
  const columns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Người đăng", dataIndex: "author", key: "author" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
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
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={openDeleteModal}
          >
            Xóa đã chọn
          </Button>
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

      {/* 🧩 Modal chi tiết bài đăng */}
      <Modal
        title={isEditing ? "Chỉnh sửa bài đăng" : "Chi tiết bài đăng"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditing(false);
        }}
        onOk={isEditing ? handleSave : () => setIsEditing(true)}
        okText={isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
        cancelText="Đóng"
        confirmLoading={loading}
        width={900}
      >
        <Form form={form} layout="vertical" disabled={!isEditing}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Loại phòng" name="roomType">
            <Input placeholder="VD: Phòng đơn, phòng đôi..." />
          </Form.Item>

          <Divider orientation="left">Địa chỉ</Divider>
          <Form.Item label="Đường" name="streetAddress">
            <Input />
          </Form.Item>
          <Form.Item label="Phường / Xã" name="ward">
            <Input />
          </Form.Item>
          <Form.Item label="Quận / Huyện" name="district">
            <Input />
          </Form.Item>
          <Form.Item label="Thành phố" name="city">
            <Input />
          </Form.Item>

          <Divider orientation="left">Tọa độ</Divider>
          <Form.Item label="Vĩ độ (latitude)" name="latitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Kinh độ (longitude)" name="longitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Divider orientation="left">Thông tin thuê</Divider>
          <Form.Item
            label="Giá thuê mỗi tháng (VND)"
            name="pricePerMonth"
            rules={[{ required: true, message: "Vui lòng nhập giá thuê" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Diện tích (m²)"
            name="areaSqm"
            rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Divider orientation="left">Trạng thái</Divider>
          <Form.Item label="Trạng thái" name="status">
            <Select>
              <Option value="available">Đang trống</Option>
              <Option value="rented">Đã thuê</Option>
              <Option value="hidden">Ẩn</Option>
              <Option value="pending">Chờ duyệt</Option>
            </Select>
          </Form.Item>
        </Form>

        {/* 🖼 Hình ảnh */}
        {currentRoom?.images?.length > 0 && (
          <>
            <Divider orientation="left">Hình ảnh</Divider>
            <Image.PreviewGroup>
              <div
                className="image-gallery"
                style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
              >
                {currentRoom.images.map((img, index) => (
                  <Image
                    key={img.id || index}
                    width={120}
                    height={90}
                    src={img.imageUrl}
                    alt={`Ảnh ${index + 1}`}
                    style={{ objectFit: "cover", borderRadius: 6 }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </>
        )}

        {/* 🛋 Tiện ích */}
        {currentRoom?.amenities?.length > 0 && (
          <>
            <Divider orientation="left">Tiện ích</Divider>
            <List
              bordered
              dataSource={currentRoom.amenities}
              renderItem={(item) => <List.Item>{item.name}</List.Item>}
            />
          </>
        )}
      </Modal>

      {/* 🗑️ Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa bài đăng"
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
          Bạn có chắc chắn muốn xóa <b>{selectedRowKeys.length}</b> bài đăng đã
          chọn không?
        </p>
        <p style={{ color: "gray", fontSize: 13 }}>
          Hành động này sẽ **xóa mềm (soft delete)** bài đăng khỏi hệ thống.
        </p>
      </Modal>
    </div>
  );
};

export default PostManagement;
