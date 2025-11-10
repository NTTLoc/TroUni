import React, { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Button,
  Avatar,
  Spin,
  Table,
  Tag,
  Modal,
  Descriptions,
  Carousel,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
} from "antd";
import { WalletOutlined, ReloadOutlined } from "@ant-design/icons";
import { getAllRoomsLandlordApi, updateRoomApi } from "../../services/postApi";
import { assets } from "../../assets/assets";
import "./ManagePost.scss";
import useMessage from "../../hooks/useMessage";

const { TabPane } = Tabs;
const { TextArea } = Input;

const ManagePost = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const message = useMessage();

  const user = JSON.parse(localStorage.getItem("user"));
  const profile = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.id;

  // 🧭 Lấy danh sách phòng
  const fetchRooms = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getAllRoomsLandlordApi(userId);
      const data = Array.isArray(res.data) ? res.data : [];
      setRooms(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách phòng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(
    () => rooms.filter((r) => r.status === activeTab),
    [rooms, activeTab]
  );

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <b>{text}</b>
          <div style={{ fontSize: 12, color: "#888" }}>
            Đăng ngày: {new Date(record.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "streetAddress",
      key: "streetAddress",
      render: (_, r) => `${r.streetAddress}, ${r.district}, ${r.city}`,
    },
    {
      title: "Giá thuê (VNĐ)",
      dataIndex: "pricePerMonth",
      key: "pricePerMonth",
      render: (p) => p?.toLocaleString("vi-VN"),
    },
    {
      title: "Diện tích (m²)",
      dataIndex: "areaSqm",
      key: "areaSqm",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const colorMap = {
          available: "green",
          rented: "orange",
          hidden: "volcano",
        };
        const labelMap = {
          available: "Đang hiển thị",
          rented: "Đã thuê",
          hidden: "Đã ẩn",
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
  ];

  const handleRowClick = (record) => {
    setSelectedRoom(record);
    setIsModalOpen(true);

    // Gán giá trị cho form
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      pricePerMonth: record.pricePerMonth,
      areaSqm: record.areaSqm,
      status: record.status,
      streetAddress: record.streetAddress,
      district: record.district,
      city: record.city,
      ward: record.ward,
      latitude: record.latitude,
      longitude: record.longitude,
      amenities:
        record.amenities?.filter((a) => a.active).map((a) => a.id) || [],
    });
  };

  const handleUpdateRoom = async (values) => {
    try {
      // map amenities full object according to backend
      const updatedAmenities =
        selectedRoom.amenities?.map((a) => ({
          ...a,
          active: values.amenities.includes(a.id),
        })) || [];

      const updateData = {
        ...values,
        roomType: "PHONG_TRO", // mặc định gửi
        amenities: updatedAmenities,
      };

      await updateRoomApi(selectedRoom.id, updateData);
      message.success("Cập nhật phòng thành công!");
      fetchRooms();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update room:", err);
      message.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="manage-container">
      {/* Header */}
      <div className="manage-header">
        <div className="user-info">
          <Avatar size={48} src={profile?.avatarUrl || assets.avatar} />
          <div className="user-detail">
            <h3>{user?.username || "Không có tên hiển thị"}</h3>
          </div>
        </div>

        <div className="search-balance">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchRooms}
            style={{ marginRight: 8 }}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button icon={<WalletOutlined />}>Số dư: 0</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="manage-tabs"
      >
        <TabPane
          tab={`ĐANG HIỂN THỊ (${
            rooms.filter((r) => r.status === "available").length
          })`}
          key="available"
        >
          {loading ? (
            <Spin style={{ display: "block", margin: "100px auto" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredRooms}
              rowKey="id"
              pagination={{ pageSize: 6 }}
              onRow={(record) => ({ onClick: () => handleRowClick(record) })}
              style={{ cursor: "pointer" }}
            />
          )}
        </TabPane>
        <TabPane
          tab={`ĐÃ THUÊ (${rooms.filter((r) => r.status === "rented").length})`}
          key="rented"
        >
          <Table
            columns={columns}
            dataSource={rooms.filter((r) => r.status === "rented")}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            style={{ cursor: "pointer" }}
          />
        </TabPane>
        <TabPane
          tab={`ĐÃ ẨN (${rooms.filter((r) => r.status === "hidden").length})`}
          key="hidden"
        >
          <Table
            columns={columns}
            dataSource={rooms.filter((r) => r.status === "hidden")}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            onRow={(record) => ({ onClick: () => handleRowClick(record) })}
            style={{ cursor: "pointer" }}
          />
        </TabPane>
      </Tabs>

      {/* Modal Chi tiết & Edit */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        className="room-detail-modal"
      >
        {selectedRoom && (
          <Form form={form} layout="vertical" onFinish={handleUpdateRoom}>
            {/* Header */}
            <div className="room-header">
              <Form.Item
                name="title"
                style={{ margin: 0, flex: 1 }}
                rules={[{ required: true }]}
              >
                <Input style={{ fontSize: 20, fontWeight: "bold" }} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>

            {/* Carousel */}
            <div className="room-images" style={{ margin: "16px 0" }}>
              {selectedRoom.images?.length ? (
                <Carousel dots autoplay>
                  {selectedRoom.images.map((img) => (
                    <div key={img.id}>
                      <img
                        src={img.imageUrl}
                        alt={selectedRoom.title}
                        style={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <img
                  src={assets.noImage}
                  alt="No image"
                  style={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}
            </div>

            {/* Thông tin phòng */}
            <Descriptions
              column={1}
              bordered
              size="small"
              className="room-descriptions"
            >
              <Descriptions.Item label="Địa chỉ">
                <Form.Item name="streetAddress" noStyle>
                  <Input />
                </Form.Item>
                <Form.Item name="district" noStyle style={{ marginTop: 4 }}>
                  <Input />
                </Form.Item>
                <Form.Item name="city" noStyle style={{ marginTop: 4 }}>
                  <Input />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Giá thuê">
                <Form.Item name="pricePerMonth" noStyle>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích">
                <Form.Item name="areaSqm" noStyle>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Form.Item name="status" noStyle>
                  <Select>
                    <Select.Option value="available">
                      Đang hiển thị
                    </Select.Option>
                    <Select.Option value="rented">Đã thuê</Select.Option>
                    <Select.Option value="hidden">Đã ẩn</Select.Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Lượt xem">
                {selectedRoom.viewCount}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng">
                {new Date(selectedRoom.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>

            {/* Mô tả & tiện ích */}
            <div className="room-extra" style={{ marginTop: 16 }}>
              <h3>Mô tả chi tiết</h3>
              <Form.Item name="description" noStyle>
                <TextArea rows={4} />
              </Form.Item>

              <h3>Tiện ích</h3>
              <Form.Item name="amenities" noStyle>
                <Checkbox.Group>
                  {selectedRoom.amenities?.map((a) => (
                    <Checkbox key={a.id} value={a.id}>
                      {a.name}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ManagePost;
