/**
 * Goong Maps API Service
 * Service để tương tác với Goong Maps API
 */

import { buildGoongUrl, getGoongHeaders } from '../utils/goongConfig';

/**
 * Goong API Service Class
 */
class GoongApiService {
  constructor() {
    // Sử dụng proxy để tránh CORS
    this.baseUrl = '/api/goong';
  }

  /**
   * Tìm kiếm địa điểm từ text (Geocoding)
   * @param {string} query - Từ khóa tìm kiếm
   * @param {Object} options - Tùy chọn tìm kiếm
   * @returns {Promise<Array>} - Danh sách kết quả tìm kiếm
   */
  async searchPlaces(query, options = {}) {
    try {
      // Không sử dụng location để search toàn quốc
      const params = {
        input: query,
        limit: options.limit || 10,
        more_compound: options.more_compound || true,
        api_key: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE'
      };

      // Chỉ thêm location nếu được chỉ định cụ thể
      if (options.location) {
        params.location = options.location;
        params.radius = options.radius || 50000;
      }

      const url = buildGoongUrl('/Place/AutoComplete', params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getGoongHeaders(),
        mode: 'cors' // Explicitly set CORS mode
      });

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Goong API error: ${data.error_message || 'Unknown error'}`);
      }

      // Transform data to match our expected format
      return data.predictions.map(prediction => ({
        id: prediction.place_id,
        display_name: prediction.description,
        lat: null, // Will be filled by place detail
        lng: null, // Will be filled by place detail
        place_id: prediction.place_id,
        structured_formatting: prediction.structured_formatting,
        types: prediction.types,
        reference: prediction.reference
      }));

    } catch (error) {
      console.error('❌ Goong search places error:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết địa điểm từ place_id
   * @param {string} placeId - Place ID từ Goong
   * @returns {Promise<Object>} - Chi tiết địa điểm
   */
  async getPlaceDetail(placeId) {
    try {
      const params = {
        place_id: placeId,
        api_key: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE'
      };

      const url = buildGoongUrl('/Place/Detail', params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getGoongHeaders()
      });

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Goong API error: ${data.error_message || 'Unknown error'}`);
      }

      const result = data.result;
      
      return {
        id: result.place_id,
        display_name: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: {
          city: this.extractAddressComponent(result.address_components, 'administrative_area_level_1'),
          district: this.extractAddressComponent(result.address_components, 'administrative_area_level_2'),
          ward: this.extractAddressComponent(result.address_components, 'administrative_area_level_3'),
          street: this.extractAddressComponent(result.address_components, 'route'),
          country: this.extractAddressComponent(result.address_components, 'country'),
          postal_code: this.extractAddressComponent(result.address_components, 'postal_code')
        },
        place_id: result.place_id,
        types: result.types,
        raw_data: result
      };

    } catch (error) {
      console.error('❌ Goong place detail error:', error);
      throw error;
    }
  }

  /**
   * Reverse geocoding - lấy địa chỉ từ tọa độ
   * @param {number} lat - Vĩ độ
   * @param {number} lng - Kinh độ
   * @returns {Promise<Object>} - Thông tin địa chỉ
   */
  async reverseGeocode(lat, lng) {
    try {
      const params = {
        latlng: `${lat},${lng}`,
        api_key: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE'
      };

      const url = buildGoongUrl('/Geocode', params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getGoongHeaders()
      });

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Goong API error: ${data.error_message || 'Unknown error'}`);
      }

      if (!data.results || data.results.length === 0) {
        throw new Error('Không tìm thấy địa chỉ cho tọa độ này');
      }

      const result = data.results[0];
      
      // Goong API có cấu trúc khác với Google Maps
      return {
        display_name: result.formatted_address || result.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        address: {
          city: this.extractGoongAddressComponent(result, 'city') || this.extractGoongAddressComponent(result, 'province'),
          district: this.extractGoongAddressComponent(result, 'district') || this.extractGoongAddressComponent(result, 'county'),
          ward: this.extractGoongAddressComponent(result, 'ward') || this.extractGoongAddressComponent(result, 'suburb'),
          street: this.extractGoongAddressComponent(result, 'street') || this.extractGoongAddressComponent(result, 'route'),
          country: this.extractGoongAddressComponent(result, 'country') || 'Việt Nam',
          postal_code: this.extractGoongAddressComponent(result, 'postal_code')
        },
        place_id: result.place_id || `goong-${lat}-${lng}`,
        geometry: result.geometry || { location: { lat, lng } },
        raw_data: result
      };

    } catch (error) {
      console.error('❌ Goong reverse geocode error:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm địa điểm hoàn chỉnh (search + get detail)
   * @param {string} query - Từ khóa tìm kiếm
   * @param {Object} options - Tùy chọn tìm kiếm
   * @returns {Promise<Array>} - Danh sách kết quả với đầy đủ thông tin
   */
  async searchPlacesWithDetail(query, options = {}) {
    try {
      // Bước 1: Tìm kiếm địa điểm
      const searchResults = await this.searchPlaces(query, options);
      
      // Bước 2: Lấy chi tiết cho từng địa điểm
      const detailedResults = await Promise.allSettled(
        searchResults.slice(0, 5).map(async (place) => {
          try {
            const detail = await this.getPlaceDetail(place.place_id);
            return detail;
          } catch (error) {
            console.warn(`Failed to get detail for place ${place.place_id}:`, error);
            return null;
          }
        })
      );

      // Lọc kết quả thành công
      return detailedResults
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);

    } catch (error) {
      console.error('❌ Goong search with detail error:', error);
      throw error;
    }
  }

  /**
   * Helper function để extract address component
   * @param {Array} components - Address components từ Goong API
   * @param {string} type - Loại component cần lấy
   * @returns {string} - Giá trị component
   */
  extractAddressComponent(components, type) {
    if (!components || !Array.isArray(components)) return '';
    
    const component = components.find(comp => comp.types.includes(type));
    return component ? component.long_name : '';
  }

  /**
   * Helper function để extract address component từ Goong API response
   * @param {Object} result - Result từ Goong API
   * @param {string} field - Field cần lấy
   * @returns {string} - Giá trị component
   */
  extractGoongAddressComponent(result, field) {
    if (!result) return '';
    
    // Thử các field có thể có trong Goong API response
    const possibleFields = [
      field,
      `${field}_name`,
      `address_${field}`,
      `formatted_${field}`
    ];
    
    for (const possibleField of possibleFields) {
      if (result[possibleField]) {
        return result[possibleField];
      }
    }
    
    // Thử trong address_components nếu có
    if (result.address_components && Array.isArray(result.address_components)) {
      const component = result.address_components.find(comp => 
        comp.types && comp.types.includes(field)
      );
      if (component) {
        return component.long_name || component.short_name || '';
      }
    }
    
    // Parse từ formatted_address nếu không có structured data
    if (result.formatted_address && !result.address_components) {
      return this.parseFromFormattedAddress(result.formatted_address, field);
    }
    
    return '';
  }

  /**
   * Parse địa chỉ từ formatted_address string
   * @param {string} formattedAddress - Địa chỉ đã format
   * @param {string} field - Field cần lấy
   * @returns {string} - Giá trị component
   */
  parseFromFormattedAddress(formattedAddress, field) {
    if (!formattedAddress) return '';
    
    // Normalize địa chỉ trước khi parse
    const normalizedAddress = this.normalizeAddress(formattedAddress);
    const addressParts = normalizedAddress.split(',').map(part => part.trim());
    
    switch (field) {
      case 'city':
        // Tìm thành phố (TP.HCM, Hà Nội, etc.)
        const cityMatch = addressParts.find(part => 
          part.includes('TP.') || 
          part.includes('Thành phố') ||
          part.includes('Hồ Chí Minh') ||
          part.includes('Hà Nội')
        );
        if (cityMatch) {
          if (cityMatch.includes('Hồ Chí Minh')) return 'Hồ Chí Minh';
          if (cityMatch.includes('Hà Nội')) return 'Hà Nội';
          return cityMatch;
        }
        break;
        
      case 'district':
        // Tìm quận/huyện (sau khi đã normalize)
        const districtMatch = addressParts.find(part => 
          part.includes('Quận') || 
          part.includes('Huyện') ||
          part.includes('District')
        );
        if (districtMatch) {
          return districtMatch;
        }
        break;
        
      case 'ward':
        // Tìm phường/xã (sau khi đã normalize)
        const wardMatch = addressParts.find(part => 
          part.includes('Phường') || 
          part.includes('Xã') ||
          part.includes('Ward') ||
          part.includes('Commune')
        );
        if (wardMatch) {
          return wardMatch;
        }
        break;
        
      case 'street':
        // Tìm đường/địa chỉ cụ thể (thường là phần đầu)
        if (addressParts.length > 0) {
          const firstPart = addressParts[0];
          if (firstPart.includes('Đường') || 
              firstPart.includes('Phố') || 
              firstPart.includes('Street') ||
              firstPart.includes('Avenue')) {
            return firstPart;
          }
        }
        break;
        
      case 'country':
        // Tìm quốc gia (thường là phần cuối)
        const countryMatch = addressParts.find(part => 
          part.includes('Việt Nam') || 
          part.includes('Vietnam')
        );
        if (countryMatch) {
          return 'Việt Nam';
        }
        break;
    }
    
    return '';
  }

  /**
   * Normalize địa chỉ để xử lý các viết tắt và format khác nhau
   * @param {string} address - Địa chỉ gốc
   * @returns {string} - Địa chỉ đã normalize
   */
  normalizeAddress(address) {
    if (!address) return '';
    
    let normalized = address;
    
    // Xử lý các viết tắt phổ biến
    const abbreviations = {
      'P.': 'Phường',
      'Q.': 'Quận',
      'TP.': 'Thành phố',
      'TP.HCM': 'Thành phố Hồ Chí Minh',
      'TP.HN': 'Thành phố Hà Nội',
      'X.': 'Xã',
      'H.': 'Huyện',
      'TT.': 'Thị trấn'
    };
    
    // Thay thế các viết tắt
    Object.entries(abbreviations).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr.replace('.', '\\.')}\\b`, 'g');
      normalized = normalized.replace(regex, full);
    });
    
    // Xử lý các trường hợp đặc biệt
    normalized = normalized
      .replace(/TP\.HCM/gi, 'Thành phố Hồ Chí Minh')
      .replace(/TP\.HN/gi, 'Thành phố Hà Nội')
      .replace(/HCM/gi, 'Hồ Chí Minh')
      .replace(/HN/gi, 'Hà Nội');
    
    return normalized;
  }

  /**
   * Tính khoảng cách giữa hai điểm
   * @param {Object} origin - Điểm xuất phát {lat, lng}
   * @param {Object} destination - Điểm đích {lat, lng}
   * @returns {Promise<Object>} - Thông tin khoảng cách
   */
  async getDistance(origin, destination) {
    try {
      const params = {
        origins: `${origin.lat},${origin.lng}`,
        destinations: `${destination.lat},${destination.lng}`,
        vehicle: 'car',
        api_key: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE'
      };

      const url = buildGoongUrl('/DistanceMatrix', params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getGoongHeaders()
      });

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Goong API error: ${data.error_message || 'Unknown error'}`);
      }

      return data.rows[0].elements[0];

    } catch (error) {
      console.error('❌ Goong distance calculation error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const goongApi = new GoongApiService();

// Export individual functions for backward compatibility
export const searchPlaces = (query, options) => goongApi.searchPlaces(query, options);
export const getPlaceDetail = (placeId) => goongApi.getPlaceDetail(placeId);
export const reverseGeocode = (lat, lng) => goongApi.reverseGeocode(lat, lng);
export const searchPlacesWithDetail = (query, options) => goongApi.searchPlacesWithDetail(query, options);
export const getDistance = (origin, destination) => goongApi.getDistance(origin, destination);

export default goongApi;
