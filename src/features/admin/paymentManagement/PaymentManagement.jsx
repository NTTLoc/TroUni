import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Spin, Modal } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { getAllPaymentsApi } from "../../../services/paymentApi";
import useMessage from "../../../hooks/useMessage";
import "./PaymentManagement.scss";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [viewingPayment, setViewingPayment] = useState(null);
  const message = useMessage();

  // 🔹 Lấy danh sách thanh toán
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAllPaymentsApi();
      setPayments(res || []);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách thanh toán:", err);
      message.error("Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 🔹 Lọc thanh toán theo tìm kiếm (mã giao dịch hoặc roomId)
  const filteredPayments = payments
    .filter(
      (p) =>
        p.transactionCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.roomId?.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 🔹 Hiển thị màu trạng thái thanh toán
  const renderStatusTag = (status) => {
    const colorMap = {
      PENDING: "orange",
      PROCESSING: "blue",
      COMPLETED: "green",
      FAILED: "red",
      CANCELLED: "volcano",
      REFUNDED: "purple",
      EXPIRED: "gray",
    };

    const labelMap = {
      PENDING: "Chờ thanh toán",
      PROCESSING: "Đang xử lý",
      COMPLETED: "Thành công",
      FAILED: "Thất bại",
      CANCELLED: "Đã hủy",
      REFUNDED: "Hoàn tiền",
      EXPIRED: "Hết hạn",
    };

    return <Tag color={colorMap[status]}>{labelMap[status] || status}</Tag>;
  };

  // 🔹 Hiển thị phương thức thanh toán
  const renderMethod = (method) => {
    const map = {
      MOMO: "Momo",
      ZALOPAY: "ZaloPay",
      BANK: "Chuyển khoản",
      CASH: "Tiền mặt",
      PAYOS: "PayOS",
    };
    return map[method] || method;
  };

  // 🔹 Mở modal xem chi tiết
  const handleView = (record) => {
    setViewingPayment(record);
  };

  // 🔹 Cấu hình bảng
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filters: [
        { text: "PayOS", value: "PAYOS" },
        { text: "Momo", value: "MOMO" },
        { text: "ZaloPay", value: "ZALOPAY" },
        { text: "Chuyển khoản", value: "BANK" },
        { text: "Tiền mặt", value: "CASH" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: renderMethod,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ thanh toán", value: "PENDING" },
        { text: "Đang xử lý", value: "PROCESSING" },
        { text: "Thành công", value: "COMPLETED" },
        { text: "Thất bại", value: "FAILED" },
        { text: "Đã hủy", value: "CANCELLED" },
        { text: "Hoàn tiền", value: "REFUNDED" },
        { text: "Hết hạn", value: "EXPIRED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: renderStatusTag,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      render: (date) =>
        new Date(date).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },

    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="payment-management">
      <div className="payment-header" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo mã giao dịch hoặc ID phòng..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 350 }}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchPayments}
          loading={loading}
          style={{ marginLeft: 10 }}
          className="refresh-btn"
        >
          Làm mới
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin tip="Đang tải giao dịch..." />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPayments.map((p) => ({ ...p, key: p.id }))}
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* 🔹 Modal xem chi tiết */}
      <Modal
        title="Chi tiết giao dịch"
        open={!!viewingPayment}
        onCancel={() => setViewingPayment(null)}
        footer={null}
        centered
      >
        {viewingPayment ? (
          <div className="payment-detail">
            <p>
              <strong>Mã giao dịch:</strong> {viewingPayment.transactionCode}
            </p>
            <p>
              <strong>Số tiền:</strong>{" "}
              {viewingPayment.amount?.toLocaleString("vi-VN")} VNĐ
            </p>
            <p>
              <strong>Phương thức:</strong>{" "}
              {renderMethod(viewingPayment.paymentMethod)}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {renderStatusTag(viewingPayment.status)}
            </p>
            <p>
              <strong>Room ID:</strong> {viewingPayment.roomId}
            </p>
            <p>
              <strong>User ID:</strong> {viewingPayment.userId}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(viewingPayment.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        ) : (
          <Spin />
        )}
      </Modal>
    </div>
  );
};

export default PaymentManagement;
