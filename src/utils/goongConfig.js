/**
 * Goong Maps Configuration
 * Cấu hình cho Goong Maps API và SDK
 */

// Goong Maps API Keys
export const GOONG_CONFIG = {
  API_KEY: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE',
  MAPTILES_KEY: 'B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI'
};

// Goong Maps API Endpoints
export const GOONG_API_ENDPOINTS = {
  AUTOCOMPLETE: '/Place/AutoComplete',
  PLACE_DETAIL: '/Place/Detail',
  GEOCODING: '/Geocode',
  REVERSE_GEOCODING: '/Geocode',
  DISTANCE: '/DistanceMatrix'
};

// Goong Maps SDK Configuration
export const GOONG_MAP_STYLES = {
  // Bản đồ cơ bản
  BASIC: 'https://tiles.goong.io/assets/goong_map_web.json',
  
  // Bản đồ vệ tinh
  SATELLITE: 'https://tiles.goong.io/assets/goong_satellite_web.json',
  
  // Bản đồ hybrid (vệ tinh + đường)
  HYBRID: 'https://tiles.goong.io/assets/goong_hybrid_web.json'
};

// Default map settings
export const DEFAULT_MAP_SETTINGS = {
  center: [106.6297, 10.8231], // TP.HCM [lng, lat]
  zoom: 15,
  minZoom: 10,
  maxZoom: 18,
  defaultStyle: GOONG_MAP_STYLES.BASIC
};

// Helper function để build Map Style URL
export const buildMapStyleUrl = (styleType = 'BASIC') => {
  return GOONG_MAP_STYLES[styleType] || GOONG_MAP_STYLES.BASIC;
};

// Helper function để build Goong API URL
export const buildGoongUrl = (endpoint, params = {}) => {
  // Sử dụng proxy để tránh CORS
  const baseUrl = '/api/goong';
  const url = new URL(baseUrl + endpoint, window.location.origin);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

// Helper function để get headers cho Goong API
export const getGoongHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};