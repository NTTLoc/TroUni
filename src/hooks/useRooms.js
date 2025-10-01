import { useState, useEffect, useCallback } from "react";
import { 
  getAllRoomsApi, 
  getRoomByIdApi, 
  createRoomApi, 
  updateRoomApi, 
  deleteRoomApi,
  searchRoomsApi,
  getMyRoomsApi,
  formatRoomData,
  formatUpdateRoomData
} from "../services/roomApi";
import { DEFAULT_PAGINATION, DEFAULT_SEARCH_FILTERS } from "../utils/roomConstants";

/**
 * Custom hook để quản lý Room data
 */
export const useRooms = (initialParams = {}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    ...DEFAULT_PAGINATION,
    ...initialParams
  });
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch rooms với pagination
  const fetchRooms = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 useRooms: Fetching rooms with params:", { ...pagination, ...params });
      const response = await getAllRoomsApi({
        ...pagination,
        ...params
      });
      
      console.log("📡 useRooms: API response:", response);
      console.log("📡 useRooms: Response data:", response?.data);
      
      if (response?.data) {
        // API trả về response.data.content, không phải response.data.content
        const roomsData = response.data.content || [];
        console.log("📦 useRooms: Rooms data:", roomsData);
        console.log("📦 useRooms: Total elements:", response.data.totalElements);
        setRooms(roomsData);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
        setPagination(prev => ({ ...prev, ...params }));
        return roomsData; // Return data for direct use
      }
      
      return [];
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra khi tải danh sách phòng");
      console.error("❌ useRooms: Error fetching rooms:", err);
      throw err; // Re-throw để PostList có thể catch
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // Search rooms với filters
  const searchRooms = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchRoomsApi({
        ...DEFAULT_SEARCH_FILTERS,
        ...searchParams,
        page: pagination.page,
        size: pagination.size
      });
      
      if (response?.data) {
        setRooms(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra khi tìm kiếm phòng");
      console.error("Error searching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]);

  // Load more rooms (pagination)
  const loadMore = useCallback(() => {
    if (pagination.page < totalPages - 1) {
      fetchRooms({ page: pagination.page + 1 });
    }
  }, [pagination.page, totalPages, fetchRooms]);

  // Refresh rooms
  const refresh = useCallback(() => {
    fetchRooms({ page: 0 });
  }, [fetchRooms]);

  // Initial load - tắt auto-load để PostList tự quản lý
  // useEffect(() => {
  //   fetchRooms();
  // }, []);

  return {
    rooms,
    loading,
    error,
    pagination,
    totalElements,
    totalPages,
    fetchRooms,
    searchRooms,
    loadMore,
    refresh,
    setPagination
  };
};

/**
 * Custom hook để quản lý một Room cụ thể
 */
export const useRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoom = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getRoomByIdApi(id);
      if (response?.data) {
        setRoom(response.data);
      }
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra khi tải thông tin phòng");
      console.error("Error fetching room:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId);
    }
  }, [roomId, fetchRoom]);

  return {
    room,
    loading,
    error,
    fetchRoom,
    setRoom
  };
};

/**
 * Custom hook để quản lý Room CRUD operations
 */
export const useRoomManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create room
  const createRoom = useCallback(async (roomData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedData = formatRoomData(roomData);
      const response = await createRoomApi(formattedData);
      return response?.data;
    } catch (err) {
      const errorMessage = err?.message || "Có lỗi xảy ra khi tạo phòng";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update room
  const updateRoom = useCallback(async (roomId, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedData = formatUpdateRoomData(updateData);
      const response = await updateRoomApi(roomId, formattedData);
      return response?.data;
    } catch (err) {
      const errorMessage = err?.message || "Có lỗi xảy ra khi cập nhật phòng";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete room
  const deleteRoom = useCallback(async (roomId) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteRoomApi(roomId);
      return true;
    } catch (err) {
      const errorMessage = err?.message || "Có lỗi xảy ra khi xóa phòng";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
    setError
  };
};

/**
 * Custom hook để quản lý My Rooms (phòng của user hiện tại)
 */
export const useMyRooms = () => {
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMyRooms = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 useMyRooms: Fetching my rooms...");
      const response = await getMyRoomsApi({
        ...pagination,
        ...params
      });
      
      console.log("📡 useMyRooms: API response:", response);
      
      if (response?.data) {
        const roomsData = response.data.content || [];
        console.log("📦 useMyRooms: My rooms data:", roomsData);
        setMyRooms(roomsData);
        setTotalElements(response.data.totalElements || 0);
        setPagination(prev => ({ ...prev, ...params }));
        return roomsData;
      }
      
      return [];
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra khi tải danh sách phòng của bạn");
      console.error("❌ useMyRooms: Error fetching my rooms:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // Tắt auto-load để component tự quản lý
  // useEffect(() => {
  //   fetchMyRooms();
  // }, []);

  return {
    myRooms,
    loading,
    error,
    pagination,
    totalElements,
    fetchMyRooms,
    setPagination
  };
};
