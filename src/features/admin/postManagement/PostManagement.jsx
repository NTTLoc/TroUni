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
  Space,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  getPaginatedRoomsApi,
  getRoomByIdApi,
  updateRoomApi,
  deleteRoomApi,
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
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [hasAmenityChanged, setHasAmenityChanged] = useState(false);
  const [form] = Form.useForm();
  const message = useMessage();

  // 🧭 Lấy danh sách bài đăng
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPaginatedRoomsApi();
      const data = res.data?.content || res.data || [];

      // ✅ Sắp xếp giảm dần theo createdAt (ưu tiên), nếu không có thì theo id
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        if (dateB - dateA !== 0) return dateB - dateA;
        return (b.id || 0) - (a.id || 0);
      });

      setPosts(
        sortedData.map((item, idx) => ({
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
      setHasImageChanged(false);
      setHasAmenityChanged(false);

      form.setFieldsValue({
        title: room.title,
        description: room.description,
        roomType: room.roomType,
        streetAddress: room.streetAddress,
        city: room.city,
        district: room.district,
        ward: room.ward,
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

  // 💾 Lưu thay đổi
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // ⚙️ Nếu không thay đổi ảnh, chỉ gửi mảng string cũ
      const imagesPayload = hasImageChanged
        ? currentRoom?.images
            ?.map((img) =>
              typeof img === "string" ? img : img.imageUrl || img.url || ""
            )
            .filter(Boolean)
        : undefined; // ⚠️ undefined nghĩa là không gửi => backend giữ nguyên

      // ⚙️ Nếu không thay đổi tiện ích, không gửi lên
      const amenitiesPayload = hasAmenityChanged
        ? currentRoom?.amenities
            ?.map((a) => ({
              name: a.name || "",
              description: a.description || "",
              iconUrl: a.iconUrl || "",
              isActive: typeof a.isActive === "boolean" ? a.isActive : true,
            }))
            .filter((x) => x.name && x.name.trim())
        : undefined;

      const updatedRoom = {
        title: values.title,
        description: values.description,
        roomType: values.roomType,
        streetAddress: values.streetAddress,
        city: values.city,
        district: values.district,
        ward: values.ward,
        pricePerMonth: values.pricePerMonth,
        areaSqm: values.areaSqm,
        status: values.status,
        ...(imagesPayload ? { images: imagesPayload } : {}),
        ...(amenitiesPayload ? { amenities: amenitiesPayload } : {}),
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

  // ➕ Thêm ảnh
  const handleAddImage = (url) => {
    if (!url.trim()) return;
    const newImage = { id: Date.now(), imageUrl: url };
    setCurrentRoom({
      ...currentRoom,
      images: [...(currentRoom?.images || []), newImage],
    });
    setHasImageChanged(true);
  };

  // ❌ Xóa ảnh
  const handleRemoveImage = (id) => {
    setCurrentRoom({
      ...currentRoom,
      images: currentRoom.images.filter((img) => img.id !== id),
    });
    setHasImageChanged(true);
  };

  // ➕ Thêm tiện ích
  const handleAddAmenity = (name) => {
    if (!name.trim()) return;
    if (currentRoom?.amenities?.some((a) => a.name === name)) {
      message.warning("Tiện ích đã tồn tại.");
      return;
    }
    setCurrentRoom({
      ...currentRoom,
      amenities: [...(currentRoom?.amenities || []), { name }],
    });
    setHasAmenityChanged(true);
  };

  // ❌ Xóa tiện ích
  const handleRemoveAmenity = (name) => {
    setCurrentRoom({
      ...currentRoom,
      amenities: currentRoom.amenities.filter((a) => a.name !== name),
    });
    setHasAmenityChanged(true);
  };

  // 🗑️ Xóa bài đăng
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
      render: (status) => {
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
      },
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
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setIsDeleteModalOpen(true)}
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

      {/* Modal chi tiết */}
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
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
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

          <Divider orientation="left">Thông tin thuê</Divider>
          <Form.Item
            label="Giá thuê (VND)"
            name="pricePerMonth"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Diện tích (m²)"
            name="areaSqm"
            rules={[{ required: true }]}
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

        {/* ẢNH */}
        {isEditing && (
          <>
            <Divider orientation="left">Ảnh</Divider>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input.Search
                placeholder="Nhập URL ảnh mới"
                enterButton={<PlusOutlined />}
                onSearch={handleAddImage}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {currentRoom?.images?.map((img) => (
                  <div
                    key={img.id || img.imageUrl}
                    style={{ position: "relative" }}
                  >
                    <Image
                      width={120}
                      height={90}
                      src={img.imageUrl}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                    <Button
                      icon={<MinusCircleOutlined />}
                      size="small"
                      danger
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        borderRadius: "50%",
                      }}
                      onClick={() => handleRemoveImage(img.id)}
                    />
                  </div>
                ))}
              </div>
            </Space>
          </>
        )}

        {/* TIỆN ÍCH */}
        {isEditing && (
          <>
            <Divider orientation="left">Tiện ích</Divider>
            <Input.Search
              placeholder="Nhập tên tiện ích mới"
              enterButton={<PlusOutlined />}
              onSearch={handleAddAmenity}
            />
            <List
              bordered
              dataSource={currentRoom?.amenities || []}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      icon={<MinusCircleOutlined />}
                      size="small"
                      danger
                      onClick={() => handleRemoveAmenity(item.name)}
                    />,
                  ]}
                >
                  {item.name}
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>

      {/* Modal xóa */}
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
          Bạn có chắc muốn xóa <b>{selectedRowKeys.length}</b> bài đăng không?
        </p>
      </Modal>
    </div>
  );
};

export default PostManagement;
