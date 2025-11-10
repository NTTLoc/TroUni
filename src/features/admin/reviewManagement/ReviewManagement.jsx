import React, { useEffect, useState } from "react";
import { Table, Rate, Spin, Input, Button } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllReviewsApi } from "../../../services/reviewApi";
import "./ReviewManagement.scss";

const ReviewManagement = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getAllReviewsApi();
      if (res.code === "SUCCESS") {
        // Sắp xếp theo ngày tạo, mới nhất lên đầu
        const sortedData = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sortedData);
      }
    } catch (err) {
      console.error("❌ Lỗi tải danh sách đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(
    (r) =>
      r.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      r.roomId?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Người dùng",
      dataIndex: ["user", "username"],
      key: "user",
    },
    {
      title: "Mã bài đăng",
      dataIndex: "roomId",
      key: "roomId",
      width: 400, // 👈 giới hạn bề ngang
      ellipsis: true, // tự động ẩn và thêm "..." khi quá dài
    },
    {
      title: "Đánh giá",
      dataIndex: "score",
      key: "score",
      render: (score) => <Rate disabled value={score} />,
      filters: [
        { text: "1 sao", value: 1 },
        { text: "2 sao", value: 2 },
        { text: "3 sao", value: 3 },
        { text: "4 sao", value: 4 },
        { text: "5 sao", value: 5 },
      ],
      onFilter: (value, record) => record.score === value,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      width: 400, // 👈 giới hạn bề ngang
      ellipsis: true,
      render: (text) => text || <i>Không có bình luận</i>,
    },
  ];

  return (
    <div className="review-management">
      <div className="review-header">
        <Input
          placeholder="Tìm theo tên người dùng hoặc mã phòng..."
          prefix={<SearchOutlined />}
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          icon={<ReloadOutlined />}
          className="refresh-btn"
          onClick={fetchReviews}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      {loading ? (
        <div className="loading">
          <Spin tip="Đang tải danh sách đánh giá..." />
        </div>
      ) : (
        <Table
          dataSource={filteredReviews}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          className="review-table"
        />
      )}
    </div>
  );
};

export default ReviewManagement;
