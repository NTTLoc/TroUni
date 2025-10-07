import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Button,
  Tag,
  Space,
  Menu,
  Empty,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useMyRooms } from "../../hooks/useRooms";
import { useNavigate } from "react-router-dom";
import AccountInfo from "../../components/account/accountInfo/AccountInfo";
import ManagePost from "../../pages/managePost/ManagePost";
import "./LandlordDashboard.scss";

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { myRooms, loading, fetchMyRooms } = useMyRooms();
  const [activeMenu, setActiveMenu] = useState("rooms");

  useEffect(() => {
    fetchMyRooms();
  }, [fetchMyRooms]);

  // Thống kê tổng quan
  const getStats = () => {
    const totalRooms = myRooms.length;
    const availableRooms = myRooms.filter(
      (room) => room.status === "available"
    ).length;
    const rentedRooms = myRooms.filter(
      (room) => room.status === "rented"
    ).length;
    const totalRevenue = myRooms
      .filter((room) => room.status === "rented")
      .reduce((sum, room) => sum + (parseInt(room.pricePerMonth) || 0), 0);

    return {
      totalRooms,
      availableRooms,
      rentedRooms,
      totalRevenue,
    };
  };

  const stats = getStats();

  // Cột cho bảng phòng trọ
  const roomColumns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <div style={{ maxWidth: 200 }}>
          <div style={{ fontWeight: 500 }}>{text}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          available: { color: "green", text: "Còn trống" },
          rented: { color: "blue", text: "Đã thuê" },
          maintenance: { color: "orange", text: "Bảo trì" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Giá thuê",
      dataIndex: "pricePerMonth",
      key: "pricePerMonth",
      render: (price) => `${parseInt(price || 0).toLocaleString()} VNĐ`,
    },
    {
      title: "Diện tích",
      dataIndex: "areaSqm",
      key: "areaSqm",
      render: (area) => (area ? `${area} m²` : "N/A"),
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) => {
        const parts = [];
        if (record.ward) parts.push(record.ward);
        if (record.district) parts.push(record.district);
        if (record.city) parts.push(record.city);
        return parts.join(", ") || "N/A";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/rooms/${record.id}`)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/rooms/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRoom(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteRoom = (roomId) => {
    // TODO: Implement delete room
    console.log("Delete room:", roomId);
  };

  const handleCreateRoom = () => {
    navigate("/rooms/create");
  };

  const menuItems = [
    // {
    //   key: "overview",
    //   icon: <HomeOutlined />,
    //   label: "Tổng Quan",
    // },
    {
      key: "rooms",
      icon: <FileTextOutlined />,
      label: "Quản Lý Phòng Trọ",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Thống Kê",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài Đặt",
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      // case "overview":
      //   return renderOverview();
      case "rooms":
        return renderRooms();
      case "analytics":
        return renderAnalytics();
      case "profile":
        return renderProfile();
      case "settings":
        return renderSettings();
      // default:
      //   return renderOverview();
    }
  };

  // const renderOverview = () => (
  //   <>
  //     {/* Thống kê */}
  //     <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
  //       <Col xs={24} sm={12} lg={6}>
  //         <Card>
  //           <Statistic
  //             title="Tổng Phòng Trọ"
  //             value={stats.totalRooms}
  //             prefix={<HomeOutlined />}
  //           />
  //         </Card>
  //       </Col>
  //       <Col xs={24} sm={12} lg={6}>
  //         <Card>
  //           <Statistic
  //             title="Phòng Còn Trống"
  //             value={stats.availableRooms}
  //             prefix={<HomeOutlined />}
  //             valueStyle={{ color: "#3f8600" }}
  //           />
  //         </Card>
  //       </Col>
  //       <Col xs={24} sm={12} lg={6}>
  //         <Card>
  //           <Statistic
  //             title="Phòng Đã Thuê"
  //             value={stats.rentedRooms}
  //             prefix={<UserOutlined />}
  //             valueStyle={{ color: "#1890ff" }}
  //           />
  //         </Card>
  //       </Col>
  //       <Col xs={24} sm={12} lg={6}>
  //         <Card>
  //           <Statistic
  //             title="Doanh Thu Tháng"
  //             value={stats.totalRevenue}
  //             prefix={<DollarOutlined />}
  //             suffix="VNĐ"
  //             valueStyle={{ color: "#cf1322" }}
  //           />
  //         </Card>
  //       </Col>
  //     </Row>

  //     {/* Phòng trọ gần đây */}
  //     {/* <Card
  //       title="Phòng Trọ Gần Đây"
  //       extra={
  //         <Button type="link" onClick={() => setActiveMenu("rooms")}>
  //           Xem tất cả
  //         </Button>
  //       }
  //     >
  //       {myRooms.length > 0 ? (
  //         <Table
  //           dataSource={myRooms.slice(0, 5)}
  //           columns={roomColumns.slice(0, -1)} // Bỏ cột thao tác
  //           pagination={false}
  //           size="small"
  //         />
  //       ) : (
  //         <Empty description="Chưa có phòng trọ nào" />
  //       )}
  //     </Card> */}
  //   </>
  // );

  const renderRooms = () => (
    <ManagePost />
    // {/* <Card>
    // <div style={{ marginBottom: 16 }}>
    //   <Button
    //     type="primary"
    //     icon={<PlusOutlined />}
    //     onClick={handleCreateRoom}
    //   >
    //     Thêm Phòng Trọ Mới
    //   </Button>
    // </div>

    // {myRooms.length > 0 ? (
    //   <Table
    //     dataSource={myRooms}
    //     columns={roomColumns}
    //     loading={loading}
    //     rowKey="id"
    //     pagination={{
    //       pageSize: 10,
    //       showSizeChanger: true,
    //       showQuickJumper: true,
    //     }}
    //   />
    // ) : (
    //   <Empty
    //     description="Chưa có phòng trọ nào"
    //     image={Empty.PRESENTED_IMAGE_SIMPLE}
    //   >
    //     <Button type="primary" onClick={handleCreateRoom}>
    //       Thêm Phòng Trọ Đầu Tiên
    //     </Button>
    //   </Empty>
    // )}
    // </Card> */}
  );

  const renderAnalytics = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Tổng Phòng Trọ"
            value={stats.totalRooms}
            prefix={<HomeOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Phòng Còn Trống"
            value={stats.availableRooms}
            prefix={<HomeOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Phòng Đã Thuê"
            value={stats.rentedRooms}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      {/* <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Doanh Thu Tháng"
            value={stats.totalRevenue}
            prefix={<DollarOutlined />}
            suffix="VNĐ"
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col> */}

      {/* <Col xs={24} lg={12}>
        <Card title="Doanh Thu Theo Tháng">
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div
              style={{ fontSize: "32px", fontWeight: "bold", color: "#cf1322" }}
            >
              {stats.totalRevenue.toLocaleString()} VNĐ
            </div>
            <div style={{ color: "#666" }}>
              Từ {stats.rentedRooms} phòng đang cho thuê
            </div>
          </div>
        </Card>
      </Col> */}
    </Row>
  );

  const renderProfile = () => (
    <div>
      <AccountInfo />
    </div>
  );

  const renderSettings = () => (
    <Card title="Cài Đặt Tài Khoản">
      <div style={{ padding: "20px" }}>
        <p>Cài đặt thông báo</p>
        <p>Bảo mật tài khoản</p>
        <p>Tùy chỉnh giao diện</p>
      </div>
    </Card>
  );

  return (
    <div className="landlord-container">
      <Row gutter={24}>
        {/* Sidebar */}
        <Col span={6}>
          <Card className="landlord-sidebar">
            <Menu
              mode="inline"
              selectedKeys={[activeMenu]}
              onClick={(e) => setActiveMenu(e.key)}
              items={menuItems}
            />
          </Card>
        </Col>

        {/* Content */}
        <Col span={18}>
          <Card className="landlord-content">{renderContent()}</Card>
        </Col>
      </Row>
    </div>
  );
};

export default LandlordDashboard;
