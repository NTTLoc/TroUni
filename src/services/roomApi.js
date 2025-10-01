import axios from "../utils/axios.customize";
import { convertAddressForBackend } from "../utils/addressMapping";

// ==================== ROOM MANAGEMENT APIs ====================

/**
 * Tạo phòng trọ mới
 * @param {Object} roomData - Dữ liệu phòng trọ
 * @returns {Promise} Response từ API
 */
export const createRoomApi = (roomData) => {
  const URL_API = "/rooms/room";
  
  // Debug: Log dữ liệu gửi lên
  console.log("🚀 Creating room with data:", roomData);
  console.log("📡 API URL:", URL_API);
  
  return axios.post(URL_API, roomData);
};

/**
 * Lấy thông tin phòng trọ theo ID
 * @param {string} roomId - ID của phòng trọ
 * @returns {Promise} Response từ API
 */
export const getRoomByIdApi = (roomId) => {
  const URL_API = `/rooms/${roomId}`;
  return axios.get(URL_API);
};

/**
 * Cập nhật thông tin phòng trọ
 * @param {string} roomId - ID của phòng trọ
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise} Response từ API
 */
export const updateRoomApi = (roomId, updateData) => {
  const URL_API = `/rooms/${roomId}`;
  return axios.put(URL_API, updateData);
};

/**
 * Xóa phòng trọ
 * @param {string} roomId - ID của phòng trọ
 * @returns {Promise} Response từ API
 */
export const deleteRoomApi = (roomId) => {
  const URL_API = `/rooms/${roomId}`;
  return axios.delete(URL_API);
};

/**
 * Lấy danh sách tất cả phòng trọ (có phân trang)
 * @param {Object} params - Tham số phân trang và filter
 * @param {number} params.page - Trang hiện tại (bắt đầu từ 0)
 * @param {number} params.size - Số lượng item per page
 * @param {string} params.sort - Sắp xếp (ví dụ: "createdAt,desc")
 * @returns {Promise} Response từ API
 */
export const getAllRoomsApi = (params = {}) => {
  const URL_API = "/rooms";
  return axios.get(URL_API, { params });
};

// ==================== SEARCH & FILTER APIs ====================

/**
 * Tìm kiếm phòng trọ với các bộ lọc
 * @param {Object} searchParams - Tham số tìm kiếm
 * @param {string} searchParams.city - Thành phố
 * @param {string} searchParams.district - Quận/huyện
 * @param {number} searchParams.minPrice - Giá tối thiểu
 * @param {number} searchParams.maxPrice - Giá tối đa
 * @param {number} searchParams.minArea - Diện tích tối thiểu
 * @param {number} searchParams.maxArea - Diện tích tối đa
 * @param {number} searchParams.page - Trang hiện tại
 * @param {number} searchParams.size - Số lượng per page
 * @returns {Promise} Response từ API
 */
export const searchRoomsApi = (searchParams = {}) => {
  const URL_API = "/rooms/search";
  return axios.get(URL_API, { params: searchParams });
};

/**
 * Lấy danh sách phòng trọ của user hiện tại
 * @param {Object} params - Tham số phân trang
 * @returns {Promise} Response từ API
 */
export const getMyRoomsApi = (params = {}) => {
  const URL_API = "/rooms/my-rooms";
  return axios.get(URL_API, { params });
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate dữ liệu phòng trọ trước khi gửi
 * @param {Object} formData - Dữ liệu từ form
 * @returns {Object} Validation result
 */
export const validateRoomData = (formData) => {
  const errors = [];
  
  // Required fields validation
  if (!formData.title || formData.title.trim() === '') {
    errors.push('Tiêu đề không được để trống');
  }
  
  if (!formData.roomType) {
    errors.push('Loại phòng không được để trống');
  }
  
  if (!formData.city) {
    errors.push('Thành phố không được để trống');
  }
  
  if (!formData.district) {
    errors.push('Quận/huyện không được để trống');
  }
  
  if (!formData.ward) {
    errors.push('Phường/xã không được để trống');
  }
  
  if (!formData.streetAddress) {
    errors.push('Địa chỉ chi tiết không được để trống');
  }
  
  if (!formData.pricePerMonth || formData.pricePerMonth <= 0) {
    errors.push('Giá thuê phải lớn hơn 0');
  }
  
  // Validate enum values
  const validRoomTypes = ['STUDIO', 'APARTMENT', 'HOUSE', 'PHONG_TRO', 'SHARED_ROOM', 'DORMITORY'];
  if (formData.roomType && !validRoomTypes.includes(formData.roomType)) {
    errors.push(`Loại phòng không hợp lệ. Chỉ chấp nhận: ${validRoomTypes.join(', ')}`);
  }
  
  const validStatuses = ['available', 'rented', 'maintenance', 'unavailable'];
  if (formData.status && !validStatuses.includes(formData.status)) {
    errors.push(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Format dữ liệu phòng trọ để gửi lên API
 * @param {Object} formData - Dữ liệu từ form
 * @returns {Object} Dữ liệu đã format
 */
export const formatRoomData = (formData) => {
  // Validate trước khi format
  const validation = validateRoomData(formData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Convert address format cho backend
  const addressData = convertAddressForBackend({
    city: formData.city,
    district: formData.district,
    ward: formData.ward?.trim()
  });

  const formattedData = {
    title: formData.title?.trim(),
    description: formData.description?.trim() || null,
    roomType: formData.roomType,
    streetAddress: formData.streetAddress?.trim(),
    city: addressData.city,
    district: addressData.district,
    ward: addressData.ward,
    // Backend nhận string cho latitude/longitude
    latitude: formData.latitude ? String(formData.latitude) : null,
    longitude: formData.longitude ? String(formData.longitude) : null,
    // Backend nhận string cho price và area
    pricePerMonth: String(formData.pricePerMonth),
    areaSqm: formData.areaSqm ? String(formData.areaSqm) : null,
    status: formData.status || "available",
    images: formData.images || [],
    amenityIds: formData.amenityIds || []
  };
  
  // Log formatted data for debugging
  console.log("📋 Formatted room data:", formattedData);
  
  return formattedData;
};

/**
 * Format dữ liệu cập nhật phòng trọ
 * @param {Object} formData - Dữ liệu từ form
 * @returns {Object} Dữ liệu đã format
 */
export const formatUpdateRoomData = (formData) => {
  const updateData = {};
  
  // Chỉ gửi các field có giá trị
  if (formData.title) updateData.title = formData.title;
  if (formData.description) updateData.description = formData.description;
  if (formData.roomType) updateData.roomType = formData.roomType;
  if (formData.streetAddress) updateData.streetAddress = formData.streetAddress;
  if (formData.city) updateData.city = formData.city;
  if (formData.district) updateData.district = formData.district;
  if (formData.ward) updateData.ward = formData.ward;
  if (formData.latitude) updateData.latitude = String(formData.latitude);
  if (formData.longitude) updateData.longitude = String(formData.longitude);
  if (formData.pricePerMonth) updateData.pricePerMonth = String(formData.pricePerMonth);
  if (formData.areaSqm) updateData.areaSqm = String(formData.areaSqm);
  if (formData.status) updateData.status = formData.status;
  if (formData.images) updateData.images = formData.images;
  if (formData.amenityIds) updateData.amenityIds = formData.amenityIds;
  
  return updateData;
};
