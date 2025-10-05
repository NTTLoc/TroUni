import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Image,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useAmenities } from "../../hooks/useAmenities";
import { AMENITY_CATEGORIES, AMENITY_CATEGORY_LABELS } from "../../utils/amenityConstants";
import "./AmenityManagement.scss";

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * AmenityManagement Component
 * Component để quản lý amenities trong Admin Dashboard
 */
const AmenityManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  const {
    amenities,
    loading,
    error,
    fetchAllAmenities,
    createAmenity,
    deleteAmenity,
    reset
  } = useAmenities({ autoFetch: true });

  // Filter amenities based on search
  const filteredAmenities = amenities.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create/edit amenity
  const handleSubmit = async (values) => {
    try {
      if (editingAmenity) {
        // TODO: Implement update amenity when backend supports it
        message.success("Cập nhật tiện ích thành công!");
      } else {
        await createAmenity(values);
        message.success("Tạo tiện ích thành công!");
      }
      
      setIsModalVisible(false);
      setEditingAmenity(null);
      form.resetFields();
    } catch (error) {
      console.error("Error saving amenity:", error);
      message.error("Có lỗi xảy ra khi lưu tiện ích!");
    }
  };

  // Handle delete amenity
  const handleDelete = async (amenityId) => {
    try {
      await deleteAmenity(amenityId);
      message.success("Xóa tiện ích thành công!");
    } catch (error) {
      console.error("Error deleting amenity:", error);
      message.error("Có lỗi xảy ra khi xóa tiện ích!");
    }
  };

  // Handle edit amenity
  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    form.setFieldsValue({
      name: amenity.name,
      icon: amenity.iconUrl
    });
    setIsModalVisible(true);
  };

  // Handle create new amenity
  const handleCreate = () => {
    setEditingAmenity(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Icon",
      dataIndex: "iconUrl",
      key: "icon",
      width: 80,
      render: (iconUrl, record) => (
        <div style={{ textAlign: "center" }}>
          {iconUrl ? (
            <Image
              src={iconUrl}
              alt={record.name}
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
              fallback="🏠"
            />
          ) : (
            <span style={{ fontSize: "24px" }}>🏠</span>
          )}
        </div>
      ),
    },
    {
      title: "Tên tiện ích",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      width: 100,
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tiện ích"
            description="Bạn có chắc chắn muốn xóa tiện ích này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="amenity-management">
      {/* Header */}
      <div className="management-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>Quản lý tiện ích</Title>
            <Text type="secondary">
              Quản lý danh sách các tiện ích có sẵn cho phòng trọ
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAllAmenities}
                loading={loading}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Thêm tiện ích
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Search and Stats */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm tiện ích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Space>
              <Text>Tổng cộng: <Text strong>{filteredAmenities.length}</Text> tiện ích</Text>
              <Text>Đang hoạt động: <Text strong>{amenities.filter(a => a.active).length}</Text></Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Amenities Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAmenities}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tiện ích`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingAmenity ? "Chỉnh sửa tiện ích" : "Thêm tiện ích mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAmenity(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên tiện ích"
            rules={[
              { required: true, message: "Vui lòng nhập tên tiện ích" },
              { min: 2, message: "Tên tiện ích phải có ít nhất 2 ký tự" },
              { max: 100, message: "Tên tiện ích không được quá 100 ký tự" }
            ]}
          >
            <Input placeholder="VD: WiFi miễn phí" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
            rules={[
              { max: 500, message: "URL icon không được quá 500 ký tự" }
            ]}
          >
            <Input 
              placeholder="Emoji (🏠) hoặc URL hình ảnh" 
              addonBefore="Icon:"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingAmenity ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingAmenity(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AmenityManagement;
