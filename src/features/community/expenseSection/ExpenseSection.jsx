import React from "react";
import { Table, Tag } from "antd";

const dummyExpenses = [
  { key: 1, name: "Tiền điện", amount: "200,000đ", status: "Chưa thanh toán" },
  { key: 2, name: "Tiền nước", amount: "100,000đ", status: "Đã thanh toán" },
];

const columns = [
  { title: "Khoản chi", dataIndex: "name", key: "name" },
  { title: "Số tiền", dataIndex: "amount", key: "amount" },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status === "Đã thanh toán" ? (
        <Tag color="green">{status}</Tag>
      ) : (
        <Tag color="red">{status}</Tag>
      ),
  },
];

const ExpenseSection = () => (
  <Table columns={columns} dataSource={dummyExpenses} pagination={false} />
);

export default ExpenseSection;
