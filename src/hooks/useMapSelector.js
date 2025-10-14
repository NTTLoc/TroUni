import { useState, useCallback } from 'react';
import { parseAddress, reverseGeocode, forwardGeocode } from '../utils/addressParser';

/**
 * Custom hook để quản lý MapSelector
 */
export const useMapSelector = (onLocationSelect) => {
  const [selectedPosition, setSelectedPosition] = useState([10.8231, 106.6297]); // TP.HCM default
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Handle search
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await forwardGeocode(query);
      await handleMapClick(result.lat, result.lng);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleMapClick]);

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
    
    // Actions
    handleMapClick,
    handleSearch,
    handleCurrentLocation,
    parseLocationForForm,
    
    // Utilities
    setError: (err) => setError(err),
    clearError: () => setError(null)
  };
};

export default useMapSelector;

