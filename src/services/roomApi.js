import axios from "../utils/axios.customize";
import { convertAddressForBackend } from "../utils/addressMapping";

// ==================== ROOM MANAGEMENT APIs ====================

/**
 * Tạo ảnh cho phòng trọ
 * @param {string} roomId - ID của phòng trọ
 * @param {Object} imageData - Dữ liệu ảnh (imageUrl array)
 * @returns {Promise} Response từ API
 */
export const createRoomImagesApi = (roomId, imageData) => {
  const URL_API = `/room-images/${roomId}`;
  console.log("🖼️ Creating room images:", imageData);
  console.log("📡 API URL:", URL_API);
  console.log("🔍 Room ID:", roomId);
  console.log("📋 Image URLs:", imageData.imageUrl);

  return axios
    .post(URL_API, imageData)
    .then((response) => {
      console.log("✅ Room images created successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("❌ Failed to create room images:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    });
};

/**
 * Lấy tất cả ảnh của phòng trọ
 * @param {string} roomId - ID của phòng trọ
 * @returns {Promise} Response từ API
 */
export const getRoomImagesApi = (roomId) => {
  const URL_API = `/api/rooms/${roomId}/images`; // ✅ Sửa endpoint đúng
  return axios.get(URL_API);
};

/**
 * Xóa ảnh phòng trọ
 * @param {string} imageId - ID của ảnh
 * @returns {Promise} Response từ API
 */
export const deleteRoomImageApi = (imageId) => {
  const URL_API = `/room-images/${imageId}`;
  return axios.delete(URL_API);
};

/**
 * Upload file ảnh lên server
 * @param {File} file - File ảnh cần upload
 * @returns {Promise} Response từ API
 */
export const uploadImageFileApi = (file) => {
  const URL_API = "/upload/image"; // Cần tạo endpoint này trên backend
  const formData = new FormData();
  formData.append("file", file);

  console.log("📤 Uploading image file:", file.name);
  return axios.post(URL_API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Tạo URL từ file object (mock function cho demo)
 * @param {File} file - File object
 * @returns {string} Mock URL
 */
export const generateMockImageUrl = (file) => {
  // Tạo mock URL từ file name
  const timestamp = Date.now();
  const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `https://example.com/images/${timestamp}_${fileName}`;
};

/**
 * Tạo phòng trọ mới
 * @param {Object} roomData - Dữ liệu phòng trọ
 * @returns {Promise} Response từ API
 */
export const createRoomApi = (roomData) => {
  const URL_API = "/rooms/room"; // ✅ Sửa từ "/rooms" thành "/api/rooms"

  // Debug: Log dữ liệu gửi lên
  console.log("🚀 Creating room with data:", roomData);
  console.log("📡 API URL:", URL_API);
  console.log("📊 Data type:", typeof roomData);
  console.log("📊 Data keys:", Object.keys(roomData));
  console.log("📊 JSON stringified:", JSON.stringify(roomData, null, 2));

  return axios
    .post(URL_API, roomData)
    .then((response) => {
      console.log("✅ Room created successfully:", response);
      return response;
    })
    .catch((error) => {
      console.error("❌ Room creation failed:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw error;
    });
};

/**
 * Lấy thông tin phòng trọ theo ID
 * @param {string} roomId - ID của phòng trọ
 * @returns {Promise} Response từ API
 */
export const getRoomByIdApi = (roomId) => {
  const URL_API = `/rooms/${roomId}/details`; // ✅ Sửa lại endpoint đúng
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
/**
 * Lấy danh sách tất cả phòng trọ với pagination (của Spring Data)
 * @param {Object} params - Tham số phân trang và filter
 * @param {number} params.page - Trang hiện tại (bắt đầu từ 0)
 * @param {number} params.size - Số lượng item per page
 * @param {string} params.sort - Sắp xếp (ví dụ: "createdAt,desc")
 * @returns {Promise} Response từ API
 */
export const getAllRoomsApi = (params = {}) => {
  const URL_API = "/rooms";
  console.log("🌐 getAllRoomsApi: Calling API:", URL_API);
  console.log("🌐 getAllRoomsApi: With params:", params);

  return axios
    .get(URL_API, { params })
    .then((response) => {
      console.log("🌐 getAllRoomsApi: RAW RESPONSE:", response);
      console.log("🌐 getAllRoomsApi: RESPONSE.DATA:", response.data);
      console.log("🌐 getAllRoomsApi: RESPONSE.STATUS:", response.status);
      console.log("🌐 getAllRoomsApi: CONTENT TYPE:", typeof response.data);

      // Log structure của response.data
      if (response.data && typeof response.data === "object") {
        console.log(
          "🌐 getAllRoomsApi: RESPONSE KEYS:",
          Object.keys(response.data)
        );
        console.log("🌐 getAllRoomsApi: CONTENT ARRAY:", response.data.content);
        console.log(
          "🌐 getAllRoomsApi: CONTENT LENGTH:",
          response.data.content?.length
        );
      }

      // ✅ Fix: Trả về response object thay vì response.data
      // Vì AllRooms.jsx đang expect response.content, không phải response.data.content
      return response;
    })
    .catch((error) => {
      console.error("❌ getAllRoomsApi: ERROR:", error);
      console.error("❌ getAllRoomsApi: ERROR RESPONSE:", error.response);
      throw error;
    });
};

/**
 * Lấy danh sách tất cả phòng trọ không phân trang (danh sách đơn giản)
 * @returns {Promise} Response từ API
 */
export const getAllRoomsSimpleApi = () => {
  const URL_API = "/rooms/all";
  console.log("🌐 getAllRoomsSimpleApi: Calling API:", URL_API);

  return axios
    .get(URL_API)
    .then((response) => {
      console.log("🌐 getAllRoomsSimpleApi: RAW RESPONSE:", response);
      console.log("🌐 getAllRoomsSimpleApi: RESPONSE.DATA:", response.data);
      console.log("🌐 getAllRoomsSimpleApi: RESPONSE.STATUS:", response.status);
      console.log(
        "🌐 getAllRoomsSimpleApi: RESPONSE TYPE:",
        Array.isArray(response.data) ? "Array" : typeof response.data
      );
      console.log(
        "🌐 getAllRoomsSimpleApi: RESPONSE LENGTH:",
        Array.isArray(response.data) ? response.data.length : "NOT ARRAY"
      );

      return response;
    })
    .catch((error) => {
      console.error("❌ getAllRoomsSimpleApi: ERROR:", error);
      console.error("❌ getAllRoomsSimpleApi: ERROR RESPONSE:", error.response);
      throw error;
    });
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
  console.log("🔍 searchRoomsApi: Calling API:", URL_API);
  console.log("🔍 searchRoomsApi: With params:", searchParams);

  return axios
    .get(URL_API, { params: searchParams })
    .then((response) => {
      console.log("🔍 searchRoomsApi: RESPONSE:", response);
      return response;
    })
    .catch((error) => {
      console.error("❌ searchRoomsApi: ERROR:", error);
      throw error;
    });
};

/**
 * Lấy danh sách phòng trọ của user hiện tại
 * @param {Object} params - Tham số phân trang
 * @returns {Promise} Response từ API
 */
export const getMyRoomsApi = (params = {}) => {
  const URL_API = "/rooms";
  return axios.get(URL_API, { params });
};

/**
 * Increment view count for a room
 * @param {string} roomId - ID của phòng trọ
 * @returns {Promise} Response từ API
 */
export const incrementViewCountApi = (roomId) => {
  const URL_API = `/rooms/${roomId}/view`;
  console.log("👁️ Incrementing view count for room:", roomId);

  return axios
    .post(URL_API)
    .then((response) => {
      console.log("✅ View count incremented:", response);
      return response;
    })
    .catch((error) => {
      console.error("❌ Error incrementing view count:", error);
      throw error;
    });
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
  if (!formData.title || formData.title.trim() === "") {
    errors.push("Tiêu đề không được để trống");
  }

  if (!formData.roomType) {
    errors.push("Loại phòng không được để trống");
  }

  if (!formData.city) {
    errors.push("Thành phố không được để trống");
  }

  if (!formData.district) {
    errors.push("Quận/huyện không được để trống");
  }

  if (!formData.ward) {
    errors.push("Phường/xã không được để trống");
  }

  if (!formData.streetAddress) {
    errors.push("Địa chỉ chi tiết không được để trống");
  }

  if (!formData.pricePerMonth || formData.pricePerMonth <= 0) {
    errors.push("Giá thuê phải lớn hơn 0");
  }

  // Validate enum values
  const validRoomTypes = [
    "STUDIO",
    "APARTMENT",
    "HOUSE",
    "PHONG_TRO",
    "SHARED_ROOM",
    "DORMITORY",
  ];
  if (formData.roomType && !validRoomTypes.includes(formData.roomType)) {
    errors.push(
      `Loại phòng không hợp lệ. Chỉ chấp nhận: ${validRoomTypes.join(", ")}`
    );
  }

  const validStatuses = ["available", "rented", "maintenance", "unavailable"];
  if (formData.status && !validStatuses.includes(formData.status)) {
    errors.push(
      `Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
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
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  // Convert address format cho backend
  const addressData = convertAddressForBackend({
    city: formData.city,
    district: formData.district,
    ward: formData.ward?.trim(),
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
    // ✅ Sửa: Backend expect amenities với format [{name: "..."}]
    amenities: formData.amenityIds
      ? formData.amenityIds.map((amenity) => ({ name: amenity.name }))
      : [],
    images: formData.images || [],
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
  if (formData.pricePerMonth)
    updateData.pricePerMonth = String(formData.pricePerMonth);
  if (formData.areaSqm) updateData.areaSqm = String(formData.areaSqm);
  if (formData.status) updateData.status = formData.status;
  if (formData.images) updateData.images = formData.images;
  if (formData.amenityIds) updateData.amenityIds = formData.amenityIds;

  return updateData;
};
