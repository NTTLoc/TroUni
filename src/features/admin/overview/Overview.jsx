import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Space,
  Button,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  ReloadOutlined,
  StarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { getStats } from "../../../services/adminApi.js";
import { fetchAndProcessStats } from "../../../utils/adminOverview.js";
import "./Overview.scss";

const { RangePicker } = DatePicker;
const COLORS = ["#52c41a", "#faad14", "#1890ff", "#bfbfbf"];

const Overview = () => {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    totalReviews: 0,
  });
  const [chartData, setChartData] = useState({
    revenueData: [],
    userGrowthData: [],
    statusData: [],
  });

  // =====================================================
  // 🟩 FETCH 1: API tổng quan (5 ô thống kê nhanh)
  // =====================================================
  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      const res = await getStats();
      console.log("📊 Overview Stats:", res.data);

      if (res.data) {
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalPosts: res.data.totalRooms || 0,
          totalRevenue: res.data.totalRevenue || 0,
          totalTransactions: res.data.totalTransactions || 0,
          totalReviews: res.data.totalReviews || 0,
        });
      }
    } catch (error) {
      console.error("❌ Fetch overview stats error:", error);
      message.error("Không thể tải dữ liệu tổng quan!");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 🟦 FETCH 2: API chi tiết (cho biểu đồ)
  // =====================================================
  const fetchChartsData = async () => {
    try {
      setLoading(true);
      const data = await fetchAndProcessStats();

      // Dữ liệu cho biểu đồ
      setChartData({
        revenueData: data.revenueData,
        userGrowthData: data.userGrowthData,
        statusData: data.statusData,
      });
    } catch (error) {
      console.error("❌ Fetch chart data error:", error);
      message.error("Không thể tải dữ liệu biểu đồ!");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 🟨 Lần đầu vào trang → load cả 2 loại dữ liệu
  // =====================================================
  useEffect(() => {
    fetchOverviewStats();
    fetchChartsData();
  }, []);

  const handleFilter = (dates) => setDateRange(dates);

  // =====================================================
  // 🧩 UI
  // =====================================================
  return (
    <div className="overview-page">
      <h2 className="page-title">Tổng quan hệ thống</h2>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          {/* --- THỐNG KÊ NHANH --- */}
          <Row gutter={[16, 16]} justify="space-between">
            <Col xs={24} sm={12} md={4} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Người dùng"
                  value={stats.totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={4} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Bài đăng"
                  value={stats.totalPosts}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={4} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Lượt đánh giá"
                  value={stats.totalReviews}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={4} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Số giao dịch"
                  value={stats.totalTransactions}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={4} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Doanh thu"
                  value={stats.totalRevenue}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="Triệu"
                />
              </Card>
            </Col>
          </Row>

          {/* Bộ lọc thời gian */}
          <div className="filter-section">
            <Space>
              <RangePicker onChange={handleFilter} />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchOverviewStats();
                  fetchChartsData();
                }}
              >
                Làm mới
              </Button>
            </Space>
          </div>

          {/* Biểu đồ doanh thu */}
          <div className="chart-section full-width">
            <Card title="Doanh thu theo tháng (Triệu VNĐ)">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1890ff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Biểu đồ người dùng và trạng thái bài đăng */}
          <Row gutter={[16, 16]} className="chart-section">
            <Col xs={24} md={12}>
              <Card title="Người dùng mới theo tháng">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#00bfa6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Trạng thái bài đăng">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Overview;
