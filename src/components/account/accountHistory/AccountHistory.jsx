import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Typography } from "antd";
import useMessage from "../../../hooks/useMessage";
import paymentService from "../../../services/paymentApi";
import "./AccountHistory.scss";

const { Title } = Typography;

const AccountHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const message = useMessage();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getMyPaymentHistory();
      // sort theo ngày mới nhất
      const sortedData = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransactions(sortedData);
    } catch (err) {
      console.error("❌ Lỗi tải lịch sử giao dịch:", err);
      message.error("Không thể tải lịch sử giao dịch!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const statusOptions = [
    { text: "Chờ thanh toán", value: "PENDING" },
    { text: "Đang xử lý", value: "PROCESSING" },
    { text: "Thành công", value: "COMPLETED" },
    { text: "Thất bại", value: "FAILED" },
    { text: "Đã hủy", value: "CANCELLED" },
    { text: "Đã hoàn tiền", value: "REFUNDED" },
    { text: "Hết hạn", value: "EXPIRED" },
  ];

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      key: "transactionCode",
      width: 120,
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Số tiền (VND)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span style={{ color: amount >= 0 ? "green" : "red" }}>
          {amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: statusOptions, // <-- thêm filter options
      onFilter: (value, record) => record.status === value, // <-- logic filter
      render: (status) => {
        const colorMap = {
          PENDING: "blue",
          PROCESSING: "orange",
          COMPLETED: "green",
          FAILED: "volcano",
          CANCELLED: "gray",
          REFUNDED: "purple",
          EXPIRED: "red",
        };
        const labelMap = {
          PENDING: "Chờ thanh toán",
          PROCESSING: "Đang xử lý",
          COMPLETED: "Thành công",
          FAILED: "Thất bại",
          CANCELLED: "Đã hủy",
          REFUNDED: "Đã hoàn tiền",
          EXPIRED: "Hết hạn",
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
  ];

  return (
    <div className="account-history">
      <Title level={4} className="account-history-title">
        Lịch sử giao dịch
      </Title>

      {loading ? (
        <div className="loading-spin">
          <Spin tip="Đang tải lịch sử giao dịch..." />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          className="full-table"
        />
      )}
    </div>
  );
};

export default AccountHistory;
