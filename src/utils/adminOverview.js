import { getAllUsersApi } from "../services/userApi";
import { getAllRoomsAdminApi } from "../services/postApi";
import { getAllPaymentsApi } from "../services/paymentApi";

/**
 * Hàm lấy dữ liệu tổng quan và xử lý để hiển thị biểu đồ
 */
export const fetchAndProcessStats = async () => {
  try {
    console.log("📊 Fetching data from all APIs...");

    // Gọi đồng thời 3 API
    const [usersRes, roomsRes, paymentsRes] = await Promise.all([
      getAllUsersApi(),
      getAllRoomsAdminApi(),
      getAllPaymentsApi(),
    ]);

    console.log(roomsRes);

    const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
    const rooms = Array.isArray(roomsRes?.data) ? roomsRes.data : [];
    const payments = Array.isArray(paymentsRes?.data) ? paymentsRes.data : [];

    // --- Doanh thu theo tháng ---
    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      month: `Tháng ${i + 1}`,
      revenue: parseFloat(
        (
          payments
            .filter((p) => new Date(p.createdAt).getMonth() + 1 === i + 1)
            .reduce((sum, p) => sum + (p.amount || 0), 0) / 1_000_000
        ).toFixed(2)
      ),
    }));

    // --- Người dùng mới theo tháng ---
    const userGrowthData = Array.from({ length: 12 }, (_, i) => ({
      month: `Tháng ${i + 1}`,
      users: users.filter((u) => new Date(u.createdAt).getMonth() + 1 === i + 1)
        .length,
    }));

    // --- Trạng thái bài đăng ---
    const statusMap = rooms.reduce((acc, r) => {
      const key = (r.status || "UNKNOWN").toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusMap).map(([name, value]) => ({
      name:
        name === "AVAILABLE"
          ? "Có sẵn"
          : name === "RENTED"
          ? "Đã thuê"
          : name === "HIDDEN"
          ? "Ẩn"
          : name === "PENDING"
          ? "Chờ duyệt"
          : "Khác",
      value,
    }));

    return {
      // Dữ liệu biểu đồ
      revenueData,
      userGrowthData,
      statusData,
    };
  } catch (error) {
    console.error("❌ fetchAndProcessStats ERROR:", error);
    throw error;
  }
};
