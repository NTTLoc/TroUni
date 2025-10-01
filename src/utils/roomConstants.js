import { formatNumberWithCommas } from "./numberFormatting";

// ==================== ROOM TYPES & ENUMS ====================

/**
 * Room Type Enum - tương ứng với backend
 */
export const ROOM_TYPE = {
  STUDIO: "STUDIO",
  APARTMENT: "APARTMENT", 
  HOUSE: "HOUSE",
  PHONG_TRO: "PHONG_TRO",        // Backend sử dụng PHONG_TRO
  SHARED_ROOM: "SHARED_ROOM",
  DORMITORY: "DORMITORY"
};

/**
 * Room Status Enum
 */
export const ROOM_STATUS = {
  AVAILABLE: "available",
  RENTED: "rented",
  MAINTENANCE: "maintenance",
  UNAVAILABLE: "unavailable"
};

/**
 * Room Type Labels cho UI
 */
export const ROOM_TYPE_LABELS = {
  [ROOM_TYPE.STUDIO]: "Studio",
  [ROOM_TYPE.APARTMENT]: "Căn hộ",
  [ROOM_TYPE.HOUSE]: "Nhà nguyên căn",
  [ROOM_TYPE.PHONG_TRO]: "Phòng trọ",        // Thêm label cho PHONG_TRO
  [ROOM_TYPE.SHARED_ROOM]: "Phòng chung",
  [ROOM_TYPE.DORMITORY]: "Ký túc xá"
};

/**
 * Room Status Labels cho UI
 */
export const ROOM_STATUS_LABELS = {
  [ROOM_STATUS.AVAILABLE]: "Còn trống",
  [ROOM_STATUS.RENTED]: "Đã thuê",
  [ROOM_STATUS.MAINTENANCE]: "Bảo trì",
  [ROOM_STATUS.UNAVAILABLE]: "Không khả dụng"
};

// ==================== DEFAULT VALUES ====================

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION = {
  page: 0,
  size: 12,
  sort: "createdAt,desc"
};

/**
 * Default search filters
 */
export const DEFAULT_SEARCH_FILTERS = {
  city: "",
  district: "",
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  roomType: "",
  status: ROOM_STATUS.AVAILABLE
};

// ==================== VALIDATION CONSTANTS ====================

/**
 * Validation rules cho Room form
 */
export const ROOM_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200
  },
  DESCRIPTION: {
    MAX_LENGTH: 2000
  },
  PRICE: {
    MIN: 0,
    MAX: 100000000 // 100 triệu
  },
  AREA: {
    MIN: 1,
    MAX: 10000 // 10,000 m²
  },
  ADDRESS: {
    MAX_LENGTH: 500
  }
};

// ==================== UI CONSTANTS ====================

/**
 * Các thành phố phổ biến ở Việt Nam
 */
export const VIETNAM_CITIES = [
  "Hồ Chí Minh",
  "Hà Nội", 
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái"
];

/**
 * Các quận/huyện phổ biến ở TP.HCM
 */
export const HCM_DISTRICTS = [
  "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5",
  "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
  "Quận 11", "Quận 12", "Quận Thủ Đức", "Quận Gò Vấp",
  "Quận Bình Thạnh", "Quận Tân Bình", "Quận Tân Phú",
  "Quận Phú Nhuận", "Quận Huyện Bình Chánh", "Quận Huyện Củ Chi",
  "Quận Huyện Hóc Môn", "Quận Huyện Nhà Bè", "Quận Huyện Cần Giờ"
];

/**
 * Các quận/huyện phổ biến ở Hà Nội
 */
export const HN_DISTRICTS = [
  "Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ", "Quận Long Biên",
  "Quận Cầu Giấy", "Quận Đống Đa", "Quận Hai Bà Trưng", "Quận Hoàng Mai",
  "Quận Thanh Xuân", "Quận Huyện Sóc Sơn", "Quận Huyện Đông Anh",
  "Quận Huyện Gia Lâm", "Quận Huyện Nam Từ Liêm", "Quận Huyện Thanh Trì",
  "Quận Huyện Bắc Từ Liêm", "Quận Huyện Mê Linh", "Quận Huyện Hà Đông",
  "Quận Huyện Sơn Tây", "Quận Huyện Ba Vì", "Quận Huyện Phúc Thọ",
  "Quận Huyện Đan Phượng", "Quận Huyện Hoài Đức", "Quận Huyện Quốc Oai",
  "Quận Huyện Thạch Thất", "Quận Huyện Chương Mỹ", "Quận Huyện Thanh Oai",
  "Quận Huyện Thường Tín", "Quận Huyện Phú Xuyên", "Quận Huyện Ứng Hòa",
  "Quận Huyện Mỹ Đức"
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format giá tiền hiển thị
 * @param {number} price - Giá tiền
 * @returns {string} Giá tiền đã format
 */
export const formatPrice = (price) => {
  if (!price) return "0 VNĐ";
  const formatted = formatNumberWithCommas(price);
  return `${formatted} VNĐ`;
};

/**
 * Format diện tích hiển thị
 * @param {number} area - Diện tích (m²)
 * @returns {string} Diện tích đã format
 */
export const formatArea = (area) => {
  if (!area) return "0 m²";
  return `${area} m²`;
};

/**
 * Format địa chỉ đầy đủ
 * @param {Object} room - Room object
 * @returns {string} Địa chỉ đầy đủ
 */
export const formatFullAddress = (room) => {
  if (!room) return "";
  
  const parts = [
    room.streetAddress,
    room.ward,
    room.district,
    room.city
  ].filter(Boolean);
  
  return parts.join(", ");
};

/**
 * Lấy label của room type
 * @param {string} roomType - Room type
 * @returns {string} Label hiển thị
 */
export const getRoomTypeLabel = (roomType) => {
  return ROOM_TYPE_LABELS[roomType] || roomType;
};

/**
 * Lấy label của room status
 * @param {string} status - Room status
 * @returns {string} Label hiển thị
 */
export const getRoomStatusLabel = (status) => {
  return ROOM_STATUS_LABELS[status] || status;
};

/**
 * Kiểm tra phòng có đang được boost không
 * @param {Object} room - Room object
 * @returns {boolean} True nếu đang boost
 */
export const isRoomBoosted = (room) => {
  if (!room || !room.boostExpiresAt) return false;
  return new Date(room.boostExpiresAt) > new Date();
};

/**
 * Tính số ngày còn lại của boost
 * @param {Object} room - Room object
 * @returns {number} Số ngày còn lại
 */
export const getBoostDaysLeft = (room) => {
  if (!isRoomBoosted(room)) return 0;
  
  const now = new Date();
  const boostEnd = new Date(room.boostExpiresAt);
  const diffTime = boostEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
