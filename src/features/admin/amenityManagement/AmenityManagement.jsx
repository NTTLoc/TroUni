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
  Switch,
} from "antd";
import {
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
  VideoCameraOutlined,
  SafetyOutlined,
  DollarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  SmileOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  SunOutlined,
  BuildOutlined,
  BankOutlined,
  RestOutlined,
  SyncOutlined,
  DashboardOutlined,
  PoweroffOutlined,
  SearchOutlined,
  EditOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import * as Icons from "@ant-design/icons";
import { useAmenities } from "../../../hooks/useAmenities";
import useMessage from "../../../hooks/useMessage";
import "./AmenityManagement.scss";

/* 🎨 Danh sách icon và tiện ích gợi ý sẵn */
const ICON_OPTIONS = [
  {
    value: "HomeOutlined",
    icon: <HomeOutlined />,
    label: "Nội thất / Phòng đầy đủ",
  },
  { value: "RestOutlined", icon: <RestOutlined />, label: "Nhà vệ sinh riêng" },
  { value: "BankOutlined", icon: <BankOutlined />, label: "Ban công / Cửa sổ" },
  {
    value: "FireOutlined",
    icon: <FireOutlined />,
    label: "Máy lạnh / Bình nóng lạnh",
  },
  { value: "SyncOutlined", icon: <SyncOutlined />, label: "Máy giặt" },
  {
    value: "ThunderboltOutlined",
    icon: <ThunderboltOutlined />,
    label: "Điện / Nước riêng",
  },
  {
    value: "DashboardOutlined",
    icon: <DashboardOutlined />,
    label: "Đồng hồ điện nước riêng",
  },
  {
    value: "PoweroffOutlined",
    icon: <PoweroffOutlined />,
    label: "Ổ cắm điện",
  },
  { value: "WifiOutlined", icon: <WifiOutlined />, label: "Wi-Fi miễn phí" },
  {
    value: "VideoCameraOutlined",
    icon: <VideoCameraOutlined />,
    label: "Camera an ninh",
  },
  { value: "CarOutlined", icon: <CarOutlined />, label: "Chỗ để xe" },
  { value: "SafetyOutlined", icon: <SafetyOutlined />, label: "Bảo vệ 24/7" },
  {
    value: "KeyOutlined",
    icon: <KeyOutlined />,
    label: "Khóa riêng / vân tay",
  },
  {
    value: "CoffeeOutlined",
    icon: <CoffeeOutlined />,
    label: "Khu nấu ăn / bếp riêng",
  },
  {
    value: "SunOutlined",
    icon: <SunOutlined />,
    label: "Sân phơi / Ánh sáng tốt",
  },
  {
    value: "BuildOutlined",
    icon: <BuildOutlined />,
    label: "Sân thượng / Không gian chung",
  },
  {
    value: "EnvironmentOutlined",
    icon: <EnvironmentOutlined />,
    label: "Gần trạm xe / bến bus",
  },
  {
    value: "ShopOutlined",
    icon: <ShopOutlined />,
    label: "Gần chợ / cửa hàng",
  },
  {
    value: "ShoppingOutlined",
    icon: <ShoppingOutlined />,
    label: "Gần siêu thị / tiện lợi",
  },
  {
    value: "CrownOutlined",
    icon: <CrownOutlined />,
    label: "Gần trường đại học",
  },
  {
    value: "DollarOutlined",
    icon: <DollarOutlined />,
    label: "Giá tốt / Đặt cọc thấp",
  },
  {
    value: "FileTextOutlined",
    icon: <FileTextOutlined />,
    label: "Hợp đồng rõ ràng",
  },
  {
    value: "ClockCircleOutlined",
    icon: <ClockCircleOutlined />,
    label: "Thuê ngắn hạn / linh hoạt",
  },
  {
    value: "SmileOutlined",
    icon: <SmileOutlined />,
    label: "Chủ nhà thân thiện",
  },
  {
    value: "HeartOutlined",
    icon: <HeartOutlined />,
    label: "Khu vực yên tĩnh / thân thiện",
  },
  {
    value: "GiftOutlined",
    icon: <GiftOutlined />,
    label: "Ưu đãi / khuyến mãi",
  },
];

/* 🧩 Render icon từ tên DB */
const renderIcon = (iconName) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? (
    <IconComponent style={{ fontSize: 18 }} />
  ) : (
    <ApartmentOutlined style={{ color: "#aaa" }} />
  );
};

const AmenityManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const showMsg = useMessage();

  const {
    amenities,
    loading,
    fetchAllAmenities,
    createAmenity,
    deleteAmenity,
    updateAmenity,
  } = useAmenities({ autoFetch: true });

  useEffect(() => {
    fetchAllAmenities();
  }, []);

  const filteredAmenities = amenities.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.icon?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const openAddModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  /* ➕ Thêm tiện ích */
  const handleAddAmenity = async () => {
    try {
      const { icon } = await form.validateFields();
      const selected = ICON_OPTIONS.find((i) => i.value === icon);
      if (!selected) return showMsg.error("Tiện ích không hợp lệ!");

      const exists = amenities.some((a) => a.icon === selected.value);
      if (exists) return showMsg.warning("Tiện ích này đã tồn tại!");

      const payload = {
        name: selected.label,
        icon: selected.value,
        active: true,
      };
      await createAmenity(payload);

      showMsg.success("Đã thêm tiện ích mới!");
      setIsModalOpen(false);
      fetchAllAmenities();
    } catch (err) {
      if (!err.errorFields) {
        console.error(err);
        showMsg.error("Không thể thêm tiện ích!");
      }
    }
  };

  /* ✏️ Mở modal chỉnh sửa */
  const openEditModal = (record) => {
    setEditRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      active: record.active,
    });
    setIsEditModalOpen(true);
  };

  /* 💾 Cập nhật tiện ích */
  const handleUpdateAmenity = async () => {
    try {
      const values = await editForm.validateFields();
      await updateAmenity(editRecord.id, values);
      showMsg.success("Đã cập nhật tiện ích!");
      setIsEditModalOpen(false);
      fetchAllAmenities();
    } catch (err) {
      console.error("Lỗi cập nhật tiện ích:", err);
      showMsg.error("Không thể cập nhật tiện ích!");
    }
  };

  /* 🗑️ Xóa tiện ích */
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteAmenity(id)));
      showMsg.success(`Đã xóa ${selectedRowKeys.length} tiện ích.`);
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      fetchAllAmenities();
    } catch (err) {
      showMsg.error("Không thể xóa tiện ích.");
    }
  };

  /* 🧾 Bảng */
  const columns = [
    {
      title: "Tiện ích",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          {renderIcon(record.icon)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Mã icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => <Tag color="blue">{icon}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Sửa
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
            onClick={fetchAllAmenities}
            loading={loading}
            className="refresh-btn"
          >
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Thêm tiện ích
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!selectedRowKeys.length}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Xóa đã chọn
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <Spin tip="Đang tải danh sách tiện ích..." />
        </div>
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={filteredAmenities}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* ➕ Modal thêm */}
      <Modal
        title="Thêm tiện ích mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddAmenity}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Chọn tiện ích"
            name="icon"
            rules={[{ required: true, message: "Vui lòng chọn tiện ích!" }]}
          >
            <Select
              placeholder="Chọn tiện ích..."
              optionLabelProp="label"
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {ICON_OPTIONS.map((item) => (
                <Select.Option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {item.icon} <span>{item.label}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ✏️ Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa tiện ích"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateAmenity}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Tên tiện ích" name="name">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Trạng thái hoạt động"
            name="active"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ❌ Modal xóa */}
      <Modal
        title="Xác nhận xóa tiện ích"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteSelected}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong>{" "}
          tiện ích đã chọn không?
        </p>
      </Modal>
    </div>
  );
};

export default AmenityManagement;
