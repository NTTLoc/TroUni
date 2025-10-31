import React, { useState, useEffect } from "react";
import { getAllRoomsApi, searchRoomsApi } from "../../services/postApi";
import { Spin, Typography, Button, Empty } from "antd";
import "./Post.scss";
import PostTab from "../../features/post/postTab/PostTab";
import PostList from "../../features/post/postList/PostList";
import PriceFilter from "../../features/post/priceFilter/PriceFilter";
import LocationFilter from "../../features/post/locationFilter/LocationFilter";
import RoomTypeFilter from "../../features/post/roomTypeFilter/RoomTypeFilter";
import FilterActions from "../../features/post/filterAction/FilterAction";
import AreaFilter from "../../features/post/areaFilter/AreaFilter";

const { Title, Text } = Typography;

const Post = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [areaRange, setAreaRange] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // 🟢 Fetch toàn bộ phòng ban đầu
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllRoomsApi();
      const data = res?.data?.content || res?.data || res?.content || res || [];
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching rooms:", err);
      setError("Không thể tải danh sách phòng trọ");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Hàm tìm kiếm/lọc
  const searchRooms = async (showFullLoading = true) => {
    if (showFullLoading) setLoading(true);
    else setSearching(true);
    setError(null);

    try {
      const params = {};

      if (selectedRoomTypes.length === 1) {
        params.roomType = selectedRoomTypes[0];
      }
      if (priceRange) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }
      if (areaRange) {
        params.minArea = areaRange[0];
        params.maxArea = areaRange[1];
      }
      if (selectedCity) params.city = selectedCity;
      if (selectedDistrict) params.district = selectedDistrict;

      const res = await searchRoomsApi(params);
      let roomsData =
        res?.data?.data || res?.data?.content || res?.data || res || [];

      // Lọc theo từ khóa
      if (searchTerm.trim()) {
        const lower = searchTerm.toLowerCase();
        roomsData = roomsData.filter(
          (r) =>
            r.title?.toLowerCase().includes(lower) ||
            r.description?.toLowerCase().includes(lower)
        );
      }

      // Lọc theo nhiều loại phòng
      if (selectedRoomTypes.length > 1) {
        roomsData = roomsData.filter((r) =>
          selectedRoomTypes.includes(r.roomType)
        );
      }

      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      console.error("❌ Error searching rooms:", err);
      setError("Không thể tìm kiếm phòng trọ");
    } finally {
      if (showFullLoading) setLoading(false);
      else setSearching(false);
    }
  };

  // 🟢 Tự động lọc khi thay đổi filter (debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      if (
        priceRange ||
        areaRange ||
        selectedCity ||
        selectedDistrict ||
        selectedRoomTypes.length > 0
      ) {
        searchRooms(false);
      } else {
        fetchRooms();
      }
    }, 500);
    return () => clearTimeout(t);
  }, [
    priceRange,
    areaRange,
    selectedCity,
    selectedDistrict,
    selectedRoomTypes,
  ]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleResetFilters = () => {
    setSearchTerm("");
    setPriceRange(null);
    setAreaRange(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedRoomTypes([]);
    fetchRooms();
  };

  const handleSearch = () => {
    searchRooms(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="all-rooms-loading">
        <Spin size="large" />
        <Text style={{ marginTop: 20, display: "block" }}>
          Đang tải danh sách phòng trọ...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-rooms-error">
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={fetchRooms}>
            Thử lại
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="all-rooms-page">
      {/* Bên trái: Danh sách phòng */}
      <div className="room-left">
        <div className="top">
          <div className="rooms-header">
            <Title level={2}>Tất cả phòng trọ</Title>
            <Text type="secondary">
              Tìm thấy {rooms.length} phòng trọ{" "}
              {searching && (
                <span style={{ marginLeft: 8, color: "#1890ff" }}>
                  🔍 Đang tìm kiếm...
                </span>
              )}
            </Text>
          </div>
        </div>

        <div className="bottom">
          <PostTab onTabChange={handleTabChange} />
          {/* 🟢 Truyền rooms xuống PostList */}
          <PostList activeTab={activeTab} rooms={rooms} loading={loading} />
        </div>
      </div>

      {/* Bên phải: Bộ lọc */}
      <div className="rooms-right">
        <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
        <AreaFilter areaRange={areaRange} setAreaRange={setAreaRange} />
        <LocationFilter
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
        />
        <RoomTypeFilter
          selectedRoomTypes={selectedRoomTypes}
          setSelectedRoomTypes={setSelectedRoomTypes}
        />
        <FilterActions
          handleResetFilters={handleResetFilters}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default Post;
