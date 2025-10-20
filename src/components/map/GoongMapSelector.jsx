/**
 * Goong Map Selector Component
 * Component để chọn địa điểm sử dụng Goong Maps SDK
 */

import React, { useRef, useEffect, useState } from "react";
import { Card, Button, Input, Space, Alert, Typography, Spin, List, AutoComplete } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { GOONG_CONFIG } from "../../utils/goongConfig";
import { goongApi } from "../../services/goongApi";
import "./MapSelector.scss";

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * Goong Map Selector Component
 * Component để chọn địa điểm trên bản đồ Goong và lấy địa chỉ
 */
const GoongMapSelector = ({
  onLocationSelect,
  initialPosition = [10.8411276, 106.809883],
  initialAddress = "",
  className = "",
  height = "400px",
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  
  const [selectedPosition, setSelectedPosition] = useState(initialPosition);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewLocation, setPreviewLocation] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Initialize Goong Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        // Import Goong Maps SDK dynamically
        const goongjs = await import('@goongmaps/goong-js');
        
        // Initialize map
        map.current = new goongjs.Map({
          container: mapContainer.current,
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: [selectedPosition[1], selectedPosition[0]], // [lng, lat]
          zoom: 15,
          accessToken: GOONG_CONFIG.MAPTILES_KEY
        });

        // Add navigation control (nếu có)
        try {
          if (goongjs.NavigationControl) {
            map.current.addControl(new goongjs.NavigationControl(), 'top-right');
          }
        } catch (err) {
          console.warn('NavigationControl not available in Goong Maps SDK');
        }

        // Add marker
        marker.current = new goongjs.Marker({
          draggable: true,
          color: '#ff4d4f'
        })
        .setLngLat([selectedPosition[1], selectedPosition[0]])
        .addTo(map.current);

        // Add popup to marker
        const popup = new goongjs.Popup({ offset: 25 })
          .setHTML(`
            <div>
              <h5>📍 Vị trí đã chọn</h5>
              <p>${selectedAddress || 'Chưa có địa chỉ'}</p>
              <p><small>Tọa độ: ${selectedPosition[0].toFixed(6)}, ${selectedPosition[1].toFixed(6)}</small></p>
            </div>
          `);

        marker.current.setPopup(popup);

        // Add click event listener
        map.current.on('click', handleMapClick);
        
        // Add marker drag event listener
        marker.current.on('dragend', handleMarkerDrag);

        // Note: Goong Maps SDK không có Geocoder control như Mapbox
        // Sử dụng search functionality thông qua API thay vì Geocoder control

      } catch (error) {
        console.error('❌ Error initializing Goong Map:', error);
        setError('Không thể khởi tạo bản đồ');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle map click
  const handleMapClick = async (e) => {
    const { lng, lat } = e.lngLat;
    setLoading(true);
    setError(null);
    
    try {
      const addressData = await goongApi.reverseGeocode(lat, lng);
      
      // Set preview location thay vì gọi onLocationSelect ngay
      setPreviewLocation({
        latitude: lat,
        longitude: lng,
        address: addressData.display_name,
        addressDetails: addressData.address,
        rawData: addressData.raw_data
      });
      
      setIsPreviewMode(true);
      
      // Update marker position
      marker.current.setLngLat([lng, lat]);
      
      // Update popup content
      const goongjs = await import('@goongmaps/goong-js');
      const popup = new goongjs.Popup({ offset: 25 })
        .setHTML(`
          <div>
            <h5>📍 Vị trí đã chọn</h5>
            <p>${addressData.display_name}</p>
            <p><small>Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}</small></p>
            <p><small>Nhấn "Xác nhận" để chọn vị trí này</small></p>
          </div>
        `);
      
      marker.current.setPopup(popup);
      
    } catch (err) {
      setError("Không thể lấy địa chỉ từ vị trí này");
    } finally {
      setLoading(false);
    }
  };

  // Handle marker drag
  const handleMarkerDrag = async () => {
    const lngLat = marker.current.getLngLat();
    const lat = lngLat.lat;
    const lng = lngLat.lng;
    
    setLoading(true);
    setError(null);
    
    try {
      const addressData = await goongApi.reverseGeocode(lat, lng);
      
      // Set preview location thay vì gọi onLocationSelect ngay
      setPreviewLocation({
        latitude: lat,
        longitude: lng,
        address: addressData.display_name,
        addressDetails: addressData.address,
        rawData: addressData.raw_data
      });
      
      setIsPreviewMode(true);
      
      // Update popup content
      const goongjs = await import('@goongmaps/goong-js');
      const popup = new goongjs.Popup({ offset: 25 })
        .setHTML(`
          <div>
            <h5>📍 Vị trí đã chọn</h5>
            <p>${addressData.display_name}</p>
            <p><small>Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}</small></p>
            <p><small>Nhấn "Xác nhận" để chọn vị trí này</small></p>
          </div>
        `);
      
      marker.current.setPopup(popup);
      
    } catch (err) {
      setError("Không thể lấy địa chỉ từ vị trí này");
    } finally {
      setLoading(false);
    }
  };

  // Handle search suggestions
  const handleSearchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const results = await goongApi.searchPlaces(query, { limit: 5 });
      setSearchSuggestions(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchSuggestions([]);
    }
  };

  // Handle search selection - chỉ preview, chưa confirm
  const handleSearchSelect = async (value, option) => {
    try {
      const placeId = option.key;
      const placeDetail = await goongApi.getPlaceDetail(placeId);
      
      const lat = placeDetail.lat;
      const lng = placeDetail.lng;
      
      // Set preview location (chưa confirm)
      setPreviewLocation({
        latitude: lat,
        longitude: lng,
        address: placeDetail.display_name,
        addressDetails: placeDetail.address,
        rawData: placeDetail.raw_data
      });
      
      setIsPreviewMode(true);
      
      // Update map and marker để preview
      if (map.current) {
        map.current.flyTo({ center: [lng, lat], zoom: 16 });
        marker.current.setLngLat([lng, lat]);
      }
      
    } catch (err) {
      setError("Không thể lấy chi tiết địa điểm");
    }
  };

  // Confirm location selection
  const handleConfirmLocation = () => {
    if (!previewLocation) return;
    
    const { latitude, longitude, address, addressDetails, rawData } = previewLocation;
    
    // Set selected location
    setSelectedPosition([latitude, longitude]);
    setSelectedAddress(address);
    
    // Clear preview
    setPreviewLocation(null);
    setIsPreviewMode(false);
    setSearchQuery("");
    setSearchSuggestions([]);
    
    // Call parent callback
    if (onLocationSelect) {
      onLocationSelect({
        latitude: latitude,
        longitude: longitude,
        address: address,
        addressDetails: addressDetails,
        rawData: rawData
      });
    }
  };

  // Cancel preview
  const handleCancelPreview = () => {
    setPreviewLocation(null);
    setIsPreviewMode(false);
    setSearchQuery("");
    setSearchSuggestions([]);
    
    // Reset map to original position
    if (map.current) {
      map.current.flyTo({ 
        center: [selectedPosition[1], selectedPosition[0]], 
        zoom: 15 
      });
      marker.current.setLngLat([selectedPosition[1], selectedPosition[0]]);
    }
  };

  return (
    <div className={`goong-map-selector ${className}`}>
      <Card title="🗺️ Chọn vị trí trên bản đồ" size="small">
        {/* Search Bar */}
        <div className="search-section" style={{ marginBottom: '16px' }}>
          <AutoComplete
            style={{ width: '100%' }}
            placeholder="Tìm kiếm địa điểm..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearchSuggestions}
            onSelect={handleSearchSelect}
            options={searchSuggestions.map(suggestion => ({
              key: suggestion.place_id,
              value: suggestion.display_name,
              label: suggestion.display_name
            }))}
              notFoundContent={searchQuery ? "Không tìm thấy địa điểm" : null}
              disabled={isPreviewMode}
            >
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm địa điểm..."
                suffix={
                  searchQuery && !isPreviewMode && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchSuggestions([]);
                      }}
                    />
                  )
                }
              />
            </AutoComplete>
          </div>

          {/* Preview Location Info */}
          {isPreviewMode && previewLocation && (
            <Alert
              message="📍 Địa điểm đã chọn"
              description={
                <div>
                  <div><strong>Địa chỉ:</strong> {previewLocation.address}</div>
                  <div><strong>Tọa độ:</strong> {previewLocation.latitude.toFixed(6)}, {previewLocation.longitude.toFixed(6)}</div>
                  <div style={{ marginTop: '8px' }}>
                    <Space>
                      <Button 
                        type="primary" 
                        size="small" 
                        icon={<CheckOutlined />}
                        onClick={handleConfirmLocation}
                      >
                        Xác nhận
                      </Button>
                      <Button 
                        size="small" 
                        icon={<CloseOutlined />}
                        onClick={handleCancelPreview}
                      >
                        Hủy
                      </Button>
                    </Space>
                  </div>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

        {/* Error Alert */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Map Container */}
        <div className="map-container" style={{ height }}>
          {loading && (
            <div className="map-loading">
              <Spin size="large" />
              <Text>Đang tải...</Text>
            </div>
          )}

          <div
            ref={mapContainer}
            style={{ height: "100%", width: "100%", borderRadius: "8px" }}
          />
        </div>

        {/* Selected Location Info */}
        {selectedAddress && (
          <div className="location-info" style={{ marginTop: '16px' }}>
            <Title level={5}>
              <EnvironmentOutlined /> Địa điểm đã chọn:
            </Title>
            <Text>{selectedAddress}</Text>
            <br />
            <Text type="secondary">
              Tọa độ: {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
            </Text>
          </div>
        )}

        {/* Instructions */}
        <div className="map-instructions" style={{ marginTop: '16px' }}>
          <Text type="secondary">
            💡 Nhấp vào bản đồ hoặc kéo marker để chọn vị trí, hoặc tìm kiếm địa điểm
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default GoongMapSelector;
