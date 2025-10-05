import axiosInstance from "../utils/axios.customize.js";

// API endpoints cho Master Amenities
const AMENITY_ENDPOINTS = {
  BASE: "/master-amenities",
  BY_ROOM: (roomId) => `/master-amenities/room/${roomId}`,
  BY_ID: (amenityId) => `/master-amenities/${amenityId}`,
};

/**
 * Amenity API Service
 * Cung cấp các method để tương tác với Master Amenities API
 */
export const amenityApi = {
  /**
   * Lấy tất cả master amenities
   * @returns {Promise<Array>} Danh sách tất cả amenities
   */
  getAllAmenities: async () => {
    try {
      console.log("🔍 Fetching all master amenities...");
      const response = await axiosInstance.get(AMENITY_ENDPOINTS.BASE);
      
      console.log("✅ All amenities fetched:", response);
      return response?.data || response || [];
    } catch (error) {
      console.error("❌ Error fetching all amenities:", error);
      throw error;
    }
  },

  /**
   * Lấy amenities của một phòng cụ thể
   * @param {string} roomId - ID của phòng
   * @returns {Promise<Array>} Danh sách amenities của phòng
   */
  getAmenitiesByRoom: async (roomId) => {
    try {
      console.log(`🔍 Fetching amenities for room: ${roomId}`);
      const response = await axiosInstance.get(AMENITY_ENDPOINTS.BY_ROOM(roomId));
      
      console.log(`✅ Amenities for room ${roomId}:`, response);
      return response?.data || response || [];
    } catch (error) {
      console.error(`❌ Error fetching amenities for room ${roomId}:`, error);
      throw error;
    }
  },

  /**
   * Tạo amenity mới (chỉ dành cho ADMIN)
   * @param {Object} amenityData - Dữ liệu amenity mới
   * @param {string} amenityData.name - Tên amenity
   * @param {string} amenityData.icon - URL icon
   * @returns {Promise<Object>} Amenity đã tạo
   */
  createAmenity: async (amenityData) => {
    try {
      console.log("🔨 Creating new amenity:", amenityData);
      const response = await axiosInstance.post(AMENITY_ENDPOINTS.BASE, amenityData);
      
      console.log("✅ Amenity created:", response);
      return response?.data || response;
    } catch (error) {
      console.error("❌ Error creating amenity:", error);
      throw error;
    }
  },

  /**
   * Xóa amenity (chỉ dành cho ADMIN)
   * @param {string} amenityId - ID của amenity cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteAmenity: async (amenityId) => {
    try {
      console.log(`🗑️ Deleting amenity: ${amenityId}`);
      const response = await axiosInstance.delete(AMENITY_ENDPOINTS.BY_ID(amenityId));
      
      console.log("✅ Amenity deleted:", response);
      return response?.data || response;
    } catch (error) {
      console.error(`❌ Error deleting amenity ${amenityId}:`, error);
      throw error;
    }
  },
};

// Export default để dễ import
export default amenityApi;
