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
  Modal,
  Form,
  Select,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ApartmentOutlined,
  HomeOutlined,
  WifiOutlined,
  CarOutlined,
  FireOutlined,
  CoffeeOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  KeyOutlined,
  HeartOutlined,
  CrownOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useAmenities } from "../../../hooks/useAmenities";
import useMessage from "../../../hooks/useMessage";
import * as Icons from "@ant-design/icons";
import "./AmenityManagement.scss";

const ICON_OPTIONS = [
  { value: "HomeOutlined", icon: <HomeOutlined /> },
  { value: "WifiOutlined", icon: <WifiOutlined /> },
  { value: "CarOutlined", icon: <CarOutlined /> },
  { value: "FireOutlined", icon: <FireOutlined /> },
  { value: "CoffeeOutlined", icon: <CoffeeOutlined /> },
  { value: "ShoppingOutlined", icon: <ShoppingOutlined /> },
  { value: "ThunderboltOutlined", icon: <ThunderboltOutlined /> },
  { value: "KeyOutlined", icon: <KeyOutlined /> },
  { value: "HeartOutlined", icon: <HeartOutlined /> },
  { value: "CrownOutlined", icon: <CrownOutlined /> },
  { value: "GiftOutlined", icon: <GiftOutlined /> },
];

const renderIcon = (iconName) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? (
    <IconComponent />
  ) : (
    <ApartmentOutlined style={{ color: "#888" }} />
  );
};

const AmenityManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const message = useMessage();

  const {
    amenities,
    loading,
    error,
    fetchAllAmenities,
    createAmenity,
    deleteAmenity,
  } = useAmenities({ autoFetch: true });

  const fetchAmenities = async () => {
    try {
      await fetchAllAmenities();
    } catch (err) {
      console.error("Lỗi tải danh sách tiện ích:", err);
      message.error("Không thể tải danh sách tiện ích!");
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const filteredAmenities = amenities.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.icon?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await deleteAmenity(id);
      message.success("Đã xóa tiện ích thành công!");
      fetchAmenities();
    } catch (err) {
      console.error("Lỗi xóa tiện ích:", err);
      message.error("Không thể xóa tiện ích!");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một tiện ích để xóa.");
      return;
    }
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteAmenity(id)));
      message.success(`Đã xóa ${selectedRowKeys.length} tiện ích.`);
      setSelectedRowKeys([]);
      fetchAmenities();
    } catch (err) {
      console.error("Lỗi xóa hàng loạt:", err);
      message.error("Không thể xóa các tiện ích đã chọn!");
    }
  };

  const openAddModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleAddAmenity = async () => {
    try {
      const values = await form.validateFields();
      await createAmenity(values);
      message.success("Đã thêm tiện ích mới!");
      setIsModalOpen(false);
      fetchAmenities();
    } catch (err) {
      if (err.errorFields) return;
      console.error("Lỗi thêm tiện ích:", err);
      message.error("Không thể thêm tiện ích!");
    }
  };

  const renderStatusTag = (active) => (
    <Tag color={active ? "green" : "red"}>
      {active ? "Hoạt động" : "Tạm dừng"}
    </Tag>
  );

  // Table columns
  const columns = [
    {
      title: "Tên tiện ích",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <span className="amenity-icon">{renderIcon(record.icon)}</span>
          <span>{text || "—"}</span>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => renderStatusTag(active),
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (date) =>
    //     date ? new Date(date).toLocaleDateString("vi-VN") : "—",
    // },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info(`Sửa tiện ích: ${record.name}`)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="amenity-management">
      <div className="amenity-header">
        <Input
          placeholder="Tìm kiếm tiện ích..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />

        <div className="actions">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAmenities}
            loading={loading}
            className="refresh-btn"
          >
            Làm mới
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
            className="add-btn"
          >
            Thêm tiện ích
          </Button>

          <Popconfirm
            title="Xác nhận xóa các tiện ích đã chọn?"
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
          <Spin tip="Đang tải tiện ích..." />
        </div>
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={filteredAmenities}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* Modal thêm tiện ích */}
      <Modal
        title="Thêm tiện ích mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddAmenity}
        okText="Thêm"
        cancelText="Hủy"
        getContainer={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên tiện ích"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên tiện ích!" }]}
          >
            <Input placeholder="Nhập tên tiện ích..." />
          </Form.Item>

          <Form.Item
            label="Biểu tượng (Icon)"
            name="icon"
            rules={[{ required: true, message: "Vui lòng chọn biểu tượng!" }]}
          >
            <Select
              placeholder="Chọn biểu tượng..."
              className="icon-select"
              dropdownClassName="icon-dropdown"
              optionLabelProp="label"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {ICON_OPTIONS.map((item) => (
                <Select.Option
                  key={item.value}
                  value={item.value}
                  label={item.icon}
                >
                  <div className="icon-only-option">{item.icon}</div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AmenityManagement;
