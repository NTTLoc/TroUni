// ==================== CITY/DISTRICT MAPPING ====================

/**
 * Mapping từ frontend format sang backend format
 */
export const CITY_MAPPING = {
  "Hồ Chí Minh": "HCM",
  "Hà Nội": "HN", 
  "Đà Nẵng": "DN",
  "Cần Thơ": "CT",
  "Hải Phòng": "HP"
};

/**
 * Mapping quận/huyện từ frontend sang backend
 */
export const DISTRICT_MAPPING = {
  // HCM
  "Quận 1": "Quan 1",
  "Quận 2": "Quan 2", 
  "Quận 3": "Quan 3",
  "Quận 4": "Quan 4",
  "Quận 5": "Quan 5",
  "Quận 6": "Quan 6",
  "Quận 7": "Quan 7",
  "Quận 8": "Quan 8",
  "Quận 9": "Quan 9",
  "Quận 10": "Quan 10",
  "Quận 11": "Quan 11",
  "Quận 12": "Quan 12",
  "Quận Thủ Đức": "Thu Duc",
  "Quận Gò Vấp": "Go Vap",
  "Quận Bình Thạnh": "Binh Thanh",
  "Quận Tân Bình": "Tan Binh",
  "Quận Tân Phú": "Tan Phu",
  "Quận Phú Nhuận": "Phu Nhuan",
  
  // HN
  "Quận Ba Đình": "Ba Dinh",
  "Quận Hoàn Kiếm": "Hoan Kiem",
  "Quận Tây Hồ": "Tay Ho",
  "Quận Long Biên": "Long Bien",
  "Quận Cầu Giấy": "Cau Giay",
  "Quận Đống Đa": "Dong Da",
  "Quận Hai Bà Trưng": "Hai Ba Trung",
  "Quận Hoàng Mai": "Hoang Mai",
  "Quận Thanh Xuân": "Thanh Xuan"
};

/**
 * Convert city name từ frontend sang backend format
 * @param {string} frontendCity - Tên thành phố từ frontend
 * @returns {string} Tên thành phố cho backend
 */
export const convertCityForBackend = (frontendCity) => {
  return CITY_MAPPING[frontendCity] || frontendCity;
};

/**
 * Convert district name từ frontend sang backend format
 * @param {string} frontendDistrict - Tên quận/huyện từ frontend
 * @returns {string} Tên quận/huyện cho backend
 */
export const convertDistrictForBackend = (frontendDistrict) => {
  return DISTRICT_MAPPING[frontendDistrict] || frontendDistrict;
};

/**
 * Convert ward name từ frontend sang backend format
 * @param {string} frontendWard - Tên phường/xã từ frontend
 * @returns {string} Tên phường/xã cho backend
 */
export const convertWardForBackend = (frontendWard) => {
  // Convert "Phường X" -> "Phuong X"
  return frontendWard
    .replace(/Phường/g, "Phuong")
    .replace(/Xã/g, "Xa")
    .replace(/Thị trấn/g, "Thi tran");
};

/**
 * Convert tất cả địa chỉ từ frontend sang backend format
 * @param {Object} addressData - Dữ liệu địa chỉ từ frontend
 * @returns {Object} Dữ liệu địa chỉ cho backend
 */
export const convertAddressForBackend = (addressData) => {
  return {
    ...addressData,
    city: convertCityForBackend(addressData.city),
    district: convertDistrictForBackend(addressData.district),
    ward: convertWardForBackend(addressData.ward)
  };
};
