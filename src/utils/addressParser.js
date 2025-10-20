/**
 * Address Parser Utility
 * Parse địa chỉ từ Goong Maps API để extract city, district, ward
 */

import { VIETNAM_CITIES, HCM_DISTRICTS, HN_DISTRICTS } from './roomConstants';
import { goongApi } from '../services/goongApi';

/**
 * Parse địa chỉ để extract thành phố, quận/huyện, phường/xã
 * @param {string} address - Địa chỉ đầy đủ
 * @param {Object} addressDetails - Chi tiết địa chỉ từ Goong Maps API
 * @returns {Object} - { city, district, ward }
 */
export const parseAddress = (address, addressDetails = {}) => {
  let parsedCity = "";
  let parsedDistrict = "";
  let parsedWard = "";

  // Method 1: Extract từ structured data
  if (addressDetails.city || addressDetails.town || addressDetails.municipality) {
    parsedCity = addressDetails.city || addressDetails.town || addressDetails.municipality;
    
    // Normalize Vietnamese city names
    if (parsedCity.includes("Hồ Chí Minh") || parsedCity.includes("Ho Chi Minh")) {
      parsedCity = "Hồ Chí Minh";
    } else if (parsedCity.includes("Hà Nội") || parsedCity.includes("Ha Noi")) {
      parsedCity = "Hà Nội";
    }
  }

  if (addressDetails.suburb || addressDetails.county || addressDetails.district) {
    parsedDistrict = addressDetails.suburb || addressDetails.county || addressDetails.district;
  }

  if (addressDetails.village || addressDetails.hamlet || addressDetails.neighbourhood) {
    parsedWard = addressDetails.village || addressDetails.hamlet || addressDetails.neighbourhood;
  }

  // Method 2: Parse từ display_name nếu cần
  if (!parsedCity || !parsedDistrict) {
    const addressParts = address.split(",").map(part => part.trim());
    
    // Find city
    if (!parsedCity) {
      const cityMatch = addressParts.find(part => 
        VIETNAM_CITIES.some(city => part.includes(city))
      );
      parsedCity = cityMatch ? VIETNAM_CITIES.find(c => cityMatch.includes(c)) : "";
    }

    // Find district
    if (parsedCity && !parsedDistrict) {
      const districts = getDistrictsForCity(parsedCity);
      const districtMatch = addressParts.find(part => 
        districts.some(district => part.includes(district))
      );
      parsedDistrict = districtMatch ? districts.find(d => districtMatch.includes(d)) : "";
    }

    // Find ward
    if (!parsedWard) {
      const wardMatch = addressParts.find(part => 
        part.includes("Phường") || 
        part.includes("Xã") || 
        part.includes("Thị trấn") ||
        part.includes("Ward") ||
        part.includes("Commune")
      );
      parsedWard = wardMatch || "";
    }
  }

  return {
    city: parsedCity,
    district: parsedDistrict,
    ward: parsedWard
  };
};

/**
 * Get districts cho thành phố
 */
export const getDistrictsForCity = (city) => {
  if (city === "Hồ Chí Minh") return HCM_DISTRICTS;
  if (city === "Hà Nội") return HN_DISTRICTS;
  return [];
};

/**
 * Reverse geocoding với Goong Maps API
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const result = await goongApi.reverseGeocode(lat, lng);
    
    return {
      display_name: result.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      address: result.address || {},
      raw_data: result.raw_data || result
    };
  } catch (err) {
    console.error("❌ Goong reverse geocoding error:", err);
    
    // Fallback: Trả về tọa độ nếu API fail
    return {
      display_name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      address: {},
      raw_data: {}
    };
  }
};

/**
 * Forward geocoding để search địa điểm với Goong Maps API
 */
export const forwardGeocode = async (query) => {
  try {
    const results = await goongApi.searchPlacesWithDetail(query, { limit: 1 });
    
    if (results && results.length > 0) {
      const result = results[0];
      return {
        lat: result.lat,
        lng: result.lng,
        display_name: result.display_name
      };
    }
    
    throw new Error("Không tìm thấy địa điểm");
  } catch (err) {
    console.error("❌ Goong forward geocoding error:", err);
    throw err;
  }
};

