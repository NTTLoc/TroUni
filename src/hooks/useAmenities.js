import { useState, useEffect, useCallback } from "react";
import { amenityApi } from "../services/amenityApi";
import { AMENITY_ERRORS, AMENITY_SUCCESS } from "../utils/amenityConstants";

/**
 * Custom hook để quản lý Master Amenities
 * @param {Object} options - Các tùy chọn
 * @param {string} options.roomId - ID của phòng (optional)
 * @param {boolean} options.autoFetch - Tự động fetch data khi mount (default: true)
 * @returns {Object} State và methods để quản lý amenities
 */
export const useAmenities = (options = {}) => {
  const { roomId = null, autoFetch = true } = options;

  // State management
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch tất cả amenities từ API
   */
  const fetchAllAmenities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching all amenities...");
      const data = await amenityApi.getAllAmenities();
      
      console.log("✅ Amenities fetched:", data);
      setAmenities(data || []);
      
      return data;
    } catch (err) {
      console.error("❌ Error fetching amenities:", err);
      setError(AMENITY_ERRORS.FETCH_ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch amenities của một phòng cụ thể
   */
  const fetchAmenitiesByRoom = useCallback(async (targetRoomId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching amenities for room: ${targetRoomId}`);
      const data = await amenityApi.getAmenitiesByRoom(targetRoomId);
      
      console.log(`✅ Room amenities fetched:`, data);
      setAmenities(data || []);
      
      return data;
    } catch (err) {
      console.error(`❌ Error fetching room amenities:`, err);
      setError(AMENITY_ERRORS.FETCH_ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tạo amenity mới (chỉ dành cho ADMIN)
   */
  const createAmenity = useCallback(async (amenityData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔨 Creating amenity:", amenityData);
      const newAmenity = await amenityApi.createAmenity(amenityData);
      
      // Thêm vào danh sách amenities hiện tại
      setAmenities(prev => [...prev, newAmenity]);
      
      console.log("✅ Amenity created:", newAmenity);
      return newAmenity;
    } catch (err) {
      console.error("❌ Error creating amenity:", err);
      setError(AMENITY_ERRORS.CREATE_ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Xóa amenity (chỉ dành cho ADMIN)
   */
  const deleteAmenity = useCallback(async (amenityId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🗑️ Deleting amenity: ${amenityId}`);
      await amenityApi.deleteAmenity(amenityId);
      
      // Xóa khỏi danh sách amenities hiện tại
      setAmenities(prev => prev.filter(amenity => amenity.id !== amenityId));
      
      // Xóa khỏi selected amenities nếu có
      setSelectedAmenities(prev => prev.filter(amenity => amenity.id !== amenityId));
      
      console.log("✅ Amenity deleted");
      return true;
    } catch (err) {
      console.error("❌ Error deleting amenity:", err);
      setError(AMENITY_ERRORS.DELETE_ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Chọn/bỏ chọn amenity
   */
  const toggleAmenity = useCallback((amenity) => {
    setSelectedAmenities(prev => {
      const isSelected = prev.some(selected => selected.id === amenity.id);
      
      if (isSelected) {
        // Bỏ chọn
        return prev.filter(selected => selected.id !== amenity.id);
      } else {
        // Chọn
        return [...prev, amenity];
      }
    });
  }, []);

  /**
   * Chọn amenity
   */
  const selectAmenity = useCallback((amenity) => {
    setSelectedAmenities(prev => {
      const isAlreadySelected = prev.some(selected => selected.id === amenity.id);
      if (!isAlreadySelected) {
        return [...prev, amenity];
      }
      return prev;
    });
  }, []);

  /**
   * Bỏ chọn amenity
   */
  const unselectAmenity = useCallback((amenityId) => {
    setSelectedAmenities(prev => prev.filter(amenity => amenity.id !== amenityId));
  }, []);

  /**
   * Chọn tất cả amenities
   */
  const selectAllAmenities = useCallback(() => {
    setSelectedAmenities([...amenities]);
  }, [amenities]);

  /**
   * Bỏ chọn tất cả amenities
   */
  const unselectAllAmenities = useCallback(() => {
    setSelectedAmenities([]);
  }, []);

  /**
   * Kiểm tra amenity có được chọn không
   */
  const isAmenitySelected = useCallback((amenityId) => {
    return selectedAmenities.some(amenity => amenity.id === amenityId);
  }, [selectedAmenities]);

  /**
   * Lấy danh sách IDs của selected amenities
   */
  const getSelectedAmenityIds = useCallback(() => {
    return selectedAmenities.map(amenity => amenity.id);
  }, [selectedAmenities]);

  /**
   * Set selected amenities từ external data
   */
  const setSelectedAmenitiesFromData = useCallback((amenityData) => {
    if (Array.isArray(amenityData)) {
      setSelectedAmenities(amenityData);
    }
  }, []);

  /**
   * Reset tất cả state
   */
  const reset = useCallback(() => {
    setAmenities([]);
    setSelectedAmenities([]);
    setError(null);
    setLoading(false);
  }, []);

  // Auto fetch khi component mount
  useEffect(() => {
    if (autoFetch) {
      if (roomId) {
        fetchAmenitiesByRoom(roomId);
      } else {
        fetchAllAmenities();
      }
    }
  }, [roomId, autoFetch, fetchAllAmenities, fetchAmenitiesByRoom]);

  return {
    // State
    amenities,
    selectedAmenities,
    loading,
    error,
    
    // Actions
    fetchAllAmenities,
    fetchAmenitiesByRoom,
    createAmenity,
    deleteAmenity,
    
    // Selection management
    toggleAmenity,
    selectAmenity,
    unselectAmenity,
    selectAllAmenities,
    unselectAllAmenities,
    isAmenitySelected,
    getSelectedAmenityIds,
    setSelectedAmenitiesFromData,
    
    // Utilities
    reset,
    
    // Computed values
    selectedCount: selectedAmenities.length,
    totalCount: amenities.length,
    hasSelection: selectedAmenities.length > 0,
    isEmpty: amenities.length === 0
  };
};

export default useAmenities;
