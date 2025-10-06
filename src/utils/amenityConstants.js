// Constants và types cho Master Amenities

/**
 * Cấu trúc dữ liệu Amenity từ backend
 * @typedef {Object} Amenity
 * @property {string} id - UUID của amenity
 * @property {string} name - Tên amenity
 * @property {string} iconUrl - URL của icon
 * @property {boolean} active - Trạng thái hoạt động
 * @property {string} createdAt - Thời gian tạo
 * @property {string} updatedAt - Thời gian cập nhật
 */

/**
 * Dữ liệu request để tạo amenity mới
 * @typedef {Object} CreateAmenityRequest
 * @property {string} name - Tên amenity
 * @property {string} icon - URL icon
 */

// Danh sách các amenities phổ biến với icon mặc định
export const COMMON_AMENITIES = [
  {
    name: "WiFi miễn phí",
    icon: "📶",
    category: "internet"
  },
  {
    name: "Điều hòa",
    icon: "❄️",
    category: "comfort"
  },
  {
    name: "Máy nước nóng",
    icon: "🚿",
    category: "bathroom"
  },
  {
    name: "Tủ lạnh",
    icon: "🧊",
    category: "kitchen"
  },
  {
    name: "Máy giặt",
    icon: "🧺",
    category: "laundry"
  },
  {
    name: "Bếp nấu",
    icon: "🔥",
    category: "kitchen"
  },
  {
    name: "Ban công",
    icon: "🌿",
    category: "outdoor"
  },
  {
    name: "Giường",
    icon: "🛏️",
    category: "furniture"
  },
  {
    name: "Tủ quần áo",
    icon: "👕",
    category: "furniture"
  },
  {
    name: "Bàn học",
    icon: "📚",
    category: "furniture"
  },
  {
    name: "Ghế",
    icon: "🪑",
    category: "furniture"
  },
  {
    name: "Tivi",
    icon: "📺",
    category: "entertainment"
  },
  {
    name: "Camera an ninh",
    icon: "📹",
    category: "security"
  },
  {
    name: "Thang máy",
    icon: "🛗",
    category: "building"
  },
  {
    name: "Bãi xe",
    icon: "🅿️",
    category: "parking"
  },
  {
    name: "Gần trường học",
    icon: "🎓",
    category: "location"
  },
  {
    name: "Gần bệnh viện",
    icon: "🏥",
    category: "location"
  },
  {
    name: "Gần chợ",
    icon: "🛒",
    category: "location"
  },
  {
    name: "Gần bến xe",
    icon: "🚌",
    category: "location"
  },
  {
    name: "Cửa sổ",
    icon: "🪟",
    category: "comfort"
  }
];

// Categories để nhóm amenities
export const AMENITY_CATEGORIES = {
  INTERNET: "internet",
  COMFORT: "comfort", 
  BATHROOM: "bathroom",
  KITCHEN: "kitchen",
  LAUNDRY: "laundry",
  OUTDOOR: "outdoor",
  FURNITURE: "furniture",
  ENTERTAINMENT: "entertainment",
  SECURITY: "security",
  BUILDING: "building",
  PARKING: "parking",
  LOCATION: "location"
};

// Labels cho categories
export const AMENITY_CATEGORY_LABELS = {
  [AMENITY_CATEGORIES.INTERNET]: "Internet & Công nghệ",
  [AMENITY_CATEGORIES.COMFORT]: "Tiện nghi",
  [AMENITY_CATEGORIES.BATHROOM]: "Phòng tắm",
  [AMENITY_CATEGORIES.KITCHEN]: "Bếp",
  [AMENITY_CATEGORIES.LAUNDRY]: "Giặt giũ",
  [AMENITY_CATEGORIES.OUTDOOR]: "Ngoài trời",
  [AMENITY_CATEGORIES.FURNITURE]: "Nội thất",
  [AMENITY_CATEGORIES.ENTERTAINMENT]: "Giải trí",
  [AMENITY_CATEGORIES.SECURITY]: "An ninh",
  [AMENITY_CATEGORIES.BUILDING]: "Tòa nhà",
  [AMENITY_CATEGORIES.PARKING]: "Đỗ xe",
  [AMENITY_CATEGORIES.LOCATION]: "Vị trí"
};

// Validation rules cho amenities
export const AMENITY_VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REQUIRED: true
  },
  ICON: {
    MAX_LENGTH: 500,
    REQUIRED: false
  },
  MAX_SELECTED: 20 // Tối đa 20 amenities được chọn
};

// Error messages
export const AMENITY_ERRORS = {
  NAME_REQUIRED: "Tên tiện ích không được để trống",
  NAME_TOO_SHORT: `Tên tiện ích phải có ít nhất ${AMENITY_VALIDATION.NAME.MIN_LENGTH} ký tự`,
  NAME_TOO_LONG: `Tên tiện ích không được quá ${AMENITY_VALIDATION.NAME.MAX_LENGTH} ký tự`,
  ICON_TOO_LONG: `URL icon không được quá ${AMENITY_VALIDATION.ICON.MAX_LENGTH} ký tự`,
  MAX_SELECTED_EXCEEDED: `Chỉ được chọn tối đa ${AMENITY_VALIDATION.MAX_SELECTED} tiện ích`,
  FETCH_ERROR: "Không thể tải danh sách tiện ích",
  CREATE_ERROR: "Không thể tạo tiện ích mới",
  DELETE_ERROR: "Không thể xóa tiện ích"
};

// Success messages
export const AMENITY_SUCCESS = {
  CREATED: "Tạo tiện ích thành công",
  DELETED: "Xóa tiện ích thành công",
  UPDATED: "Cập nhật tiện ích thành công",
  SELECTED: "Đã chọn tiện ích",
  UNSELECTED: "Đã bỏ chọn tiện ích"
};

export default {
  COMMON_AMENITIES,
  AMENITY_CATEGORIES,
  AMENITY_CATEGORY_LABELS,
  AMENITY_VALIDATION,
  AMENITY_ERRORS,
  AMENITY_SUCCESS
};
