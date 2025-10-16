import { useState, useCallback, useRef, useEffect } from 'react';
import { parseAddress, reverseGeocode, forwardGeocode } from '../utils/addressParser';
import { getFallbackSuggestions, getFallbackAddress } from '../utils/mapFallback';
import { smartSearch } from '../utils/alternativeMapApis';

/**
 * Custom hook để quản lý MapSelector
 */
export const useMapSelector = (onLocationSelect) => {
  const [selectedPosition, setSelectedPosition] = useState([10.8231, 106.6297]); // TP.HCM default
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New states for 2-step selection
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [previewLocation, setPreviewLocation] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle map click
  const handleMapClick = useCallback(async (lat, lng) => {
    setSelectedPosition([lat, lng]);
    setLoading(true);
    setError(null);
    
    try {
      const addressData = await reverseGeocode(lat, lng);
      setSelectedAddress(addressData.display_name);
      
      if (onLocationSelect) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: addressData.display_name,
          addressDetails: addressData.address,
          rawData: addressData.raw_data
        });
      }
    } catch (err) {
      setError("Không thể lấy địa chỉ từ vị trí này");
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle search with suggestions
  const handleSearchSuggestions = useCallback(async (query) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setSearchSuggestions([]);
      setSearchQuery("");
      return;
    }
    
    // Update search query immediately for UI
    setSearchQuery(query);
    
    // Debounce API calls
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Sử dụng smart search với multiple fallbacks
        const suggestions = await smartSearch(query);
        console.log("🔍 Search suggestions:", suggestions);
        
        setSearchSuggestions(suggestions);
        clearError(); // Clear any previous errors
      } catch (err) {
        console.error("❌ Search suggestions error:", err);
        
        // Final fallback: Sử dụng fallback service
        const fallbackSuggestions = getFallbackSuggestions(query);
        setSearchSuggestions(fallbackSuggestions);
        setError("Không thể kết nối đến dịch vụ bản đồ. Đang sử dụng gợi ý mặc định.");
      } finally {
        setLoading(false);
      }
    }, 300); // Giảm delay xuống 300ms
  }, []);

  // Handle suggestion click (preview mode)
  const handleSuggestionClick = useCallback(async (suggestion) => {
    console.log("📍 Preview location:", suggestion);
    
    setPreviewLocation(suggestion);
    setSelectedPosition([suggestion.lat, suggestion.lng]);
    setSelectedAddress(suggestion.display_name);
    setIsPreviewMode(true);
    setSearchSuggestions([]);
    setSearchQuery(suggestion.display_name);
  }, []);

  // Handle confirm selection
  const handleConfirmSelection = useCallback(() => {
    if (previewLocation && onLocationSelect) {
      // Get detailed address info
      reverseGeocode(previewLocation.lat, previewLocation.lng)
        .then(addressData => {
          onLocationSelect({
            latitude: previewLocation.lat,
            longitude: previewLocation.lng,
            address: addressData.display_name,
            addressDetails: addressData.address,
            rawData: addressData.raw_data
          });
          setIsPreviewMode(false);
          setPreviewLocation(null);
        })
        .catch(err => {
          console.error("Error getting detailed address:", err);
          
          // Fallback: Sử dụng fallback address service
          const fallbackAddress = getFallbackAddress(previewLocation.lat, previewLocation.lng);
          onLocationSelect({
            latitude: previewLocation.lat,
            longitude: previewLocation.lng,
            address: fallbackAddress.display_name,
            addressDetails: fallbackAddress.address,
            rawData: fallbackAddress.raw_data
          });
          setIsPreviewMode(false);
          setPreviewLocation(null);
        });
    }
  }, [previewLocation, onLocationSelect]);

  // Handle cancel preview
  const handleCancelPreview = useCallback(() => {
    setIsPreviewMode(false);
    setPreviewLocation(null);
    setSearchQuery("");
  }, []);

  // Handle current location
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await handleMapClick(latitude, longitude);
      },
      (error) => {
        setError("Không thể lấy vị trí hiện tại");
        setLoading(false);
      }
    );
  }, [handleMapClick]);

  // Parse address for form fields
  const parseLocationForForm = useCallback((locationData) => {
    const { address, addressDetails } = locationData;
    const parsed = parseAddress(address, addressDetails);
    
    return {
      ...parsed,
      fullAddress: address,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    };
  }, []);

  return {
    // State
    selectedPosition,
    selectedAddress,
    loading,
    error,
    
    // New states for 2-step selection
    searchSuggestions,
    previewLocation,
    isPreviewMode,
    searchQuery,
    
    // Actions
    handleMapClick,
    handleSearchSuggestions,
    handleSuggestionClick,
    handleConfirmSelection,
    handleCancelPreview,
    handleCurrentLocation,
    parseLocationForForm,
    
    // Utilities
    setError: (err) => setError(err),
    clearError: () => setError(null),
    setSearchQuery
  };
};

export default useMapSelector;

