/**
 * Address Parser Utility
 * Parse địa chỉ từ OpenStreetMap để extract city, district, ward
 */

import { VIETNAM_CITIES, HCM_DISTRICTS, HN_DISTRICTS } from './roomConstants';

/**
 * Parse địa chỉ để extract thành phố, quận/huyện, phường/xã
 * @param {string} address - Địa chỉ đầy đủ
 * @param {Object} addressDetails - Chi tiết địa chỉ từ OpenStreetMap
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
 * Reverse geocoding với OpenStreetMap
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=vi`
    );
    
    if (!response.ok) throw new Error("Network error");
    
    const data = await response.json();
    
    return {
      display_name: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      address: data.address || {},
      raw_data: data
    };
  } catch (err) {
    console.error("❌ Reverse geocoding error:", err);
    throw err;
  }
};

/**
 * Forward geocoding để search địa điểm
 */
export const forwardGeocode = async (query) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1&accept-language=vi&countrycodes=vn`
    );
    
    if (!response.ok) throw new Error("Network error");
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name
      };
    }
    
    throw new Error("Không tìm thấy địa điểm");
  } catch (err) {
    console.error("❌ Forward geocoding error:", err);
    throw err;
  }
};

