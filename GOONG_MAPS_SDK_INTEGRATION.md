# 🗺️ Goong Maps SDK Integration

Dự án đã được chuyển đổi hoàn toàn từ Leaflet sang Goong Maps SDK (`@goongmaps/goong-js`) để có hiệu suất và trải nghiệm tốt nhất.

## 📋 Tổng quan

### ✅ Đã hoàn thành:
- ✅ Cài đặt `@goongmaps/goong-js` SDK
- ✅ Tạo `GoongMapSelector` component thay thế `MapSelector`
- ✅ Tạo `GoongMapModal` component thay thế `MapModal`
- ✅ Cập nhật `RoomForm` và `PostMainInfo` để sử dụng Goong SDK
- ✅ Xóa các component Leaflet cũ
- ✅ Cập nhật configuration cho Goong SDK

### 🔧 API Configuration:
- **API Key**: `bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE`
- **MapTiles Key**: `B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI`
- **SDK**: `@goongmaps/goong-js`

## 🏗️ Cấu trúc Components

### 1. GoongMapSelector
```jsx
import GoongMapSelector from '../components/map/GoongMapSelector';

<GoongMapSelector
  onLocationSelect={handleLocationSelect}
  initialPosition={[10.8231, 106.6297]}
  initialAddress=""
  height="400px"
/>
```

**Tính năng:**
- ✅ Interactive map với Goong SDK
- ✅ Click để chọn vị trí
- ✅ Drag marker để thay đổi vị trí
- ✅ Search địa điểm với autocomplete
- ✅ Reverse geocoding tự động
- ✅ Responsive design

### 2. GoongMapModal
```jsx
import GoongMapModal from '../components/map/GoongMapModal';

<GoongMapModal
  visible={mapModalVisible}
  onClose={() => setMapModalVisible(false)}
  latitude={10.8231}
  longitude={106.6297}
  address="Địa chỉ cụ thể"
  title="Vị trí phòng trọ"
/>
```

**Tính năng:**
- ✅ Hiển thị vị trí cụ thể
- ✅ Interactive marker với popup
- ✅ Links đến Google Maps và Goong Maps
- ✅ Responsive modal

## 🧪 Test Components

### 1. GoongSDKTest
```jsx
import GoongSDKTest from '../components/debug/GoongSDKTest';

<GoongSDKTest />
```

**Chức năng:**
- ✅ Test Goong Maps SDK initialization
- ✅ Test map styles (Basic, Satellite, Hybrid)
- ✅ Test map interactions (click, drag)
- ✅ Test marker functionality
- ✅ Display SDK configuration

### 2. SimpleGoongTest
```jsx
import SimpleGoongTest from '../components/debug/SimpleGoongTest';

<SimpleGoongTest />
```

**Chức năng:**
- ✅ Test reverse geocoding API
- ✅ Test với tọa độ tùy chỉnh
- ✅ Display API response

## 🚀 Cách sử dụng

### 1. Import Components
```jsx
// Thay vì
import MapSelector from '../components/map/MapSelector';
import MapModal from '../components/map/MapModal';

// Sử dụng
import GoongMapSelector from '../components/map/GoongMapSelector';
import GoongMapModal from '../components/map/GoongMapModal';
```

### 2. Map Styles
```javascript
import { GOONG_MAP_STYLES } from '../utils/goongConfig';

// Available styles:
GOONG_MAP_STYLES.BASIC      // Bản đồ cơ bản
GOONG_MAP_STYLES.SATELLITE  // Bản đồ vệ tinh
GOONG_MAP_STYLES.HYBRID     // Bản đồ hybrid
```

### 3. Event Handlers
```javascript
const handleLocationSelect = (locationData) => {
  console.log('Selected location:', locationData);
  // locationData contains:
  // - latitude, longitude
  // - address (formatted)
  // - addressDetails (parsed)
  // - rawData (from Goong API)
};
```

## 📊 API Integration

### Goong API Service
```javascript
import { goongApi } from '../services/goongApi';

// Search places
const results = await goongApi.searchPlaces('Quận 1, TP.HCM');

// Get place detail
const detail = await goongApi.getPlaceDetail(placeId);

// Reverse geocoding
const address = await goongApi.reverseGeocode(10.8231, 106.6297);
```

### Address Parser
```javascript
import { reverseGeocode, forwardGeocode } from '../utils/addressParser';

// Reverse geocoding
const addressData = await reverseGeocode(lat, lng);

// Forward geocoding
const location = await forwardGeocode('Quận 1, TP.HCM');
```

## 🎯 Lợi ích của Goong SDK

### So với Leaflet:
- ✅ **Native Goong Maps**: Sử dụng trực tiếp Goong Maps SDK
- ✅ **Better Performance**: Tối ưu hóa cho Goong services
- ✅ **Rich Features**: Geocoding, search, directions built-in
- ✅ **Vietnamese Support**: Dữ liệu địa lý Việt Nam chính xác
- ✅ **Modern UI**: Interface hiện đại và responsive

### So với OpenStreetMap:
- ✅ **Accurate Data**: Dữ liệu Việt Nam chính xác hơn
- ✅ **Fast API**: Response time nhanh hơn
- ✅ **Vietnamese Language**: Hỗ trợ tiếng Việt tốt
- ✅ **Commercial Support**: Hỗ trợ thương mại

## 🔧 Configuration

### goongConfig.js
```javascript
export const GOONG_CONFIG = {
  API_KEY: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE',
  MAPTILES_KEY: 'B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI',
  BASE_URL: 'https://rsapi.goong.io',
  MAPTILES_URL: 'https://tiles.goong.io'
};

export const GOONG_MAP_STYLES = {
  BASIC: 'https://tiles.goong.io/assets/goong_map_web.json',
  SATELLITE: 'https://tiles.goong.io/assets/goong_satellite_web.json',
  HYBRID: 'https://tiles.goong.io/assets/goong_hybrid_web.json'
};
```

## 🧪 Testing

### Test Map Display:
1. Mở `GoongSDKTest` component
2. Kiểm tra bản đồ có hiển thị không
3. Test các map styles
4. Test interactions (click, drag)

### Test API:
1. Mở `SimpleGoongTest` component
2. Test reverse geocoding với tọa độ TP.HCM
3. Kiểm tra response có địa chỉ cụ thể không

### Test Integration:
1. Mở `RoomForm` để test `GoongMapSelector`
2. Mở post detail để test `GoongMapModal`
3. Test search và select location

## 🚨 Troubleshooting

### Nếu map không hiển thị:
1. Kiểm tra MapTiles key có đúng không
2. Check console errors
3. Verify `@goongmaps/goong-js` đã được cài đặt
4. Test với `GoongSDKTest` component

### Nếu API không hoạt động:
1. Kiểm tra API key có đúng không
2. Check network connectivity
3. Test với `SimpleGoongTest` component
4. Verify Goong API quota

### Nếu địa chỉ không parse được:
1. Check `goongApi.js` service
2. Test với tọa độ khác nhau
3. Check Goong API response format
4. Verify `extractGoongAddressComponent` method

## 📈 Performance

### Optimizations:
- ✅ Dynamic import của Goong SDK
- ✅ Lazy loading components
- ✅ Efficient event handling
- ✅ Memory cleanup on unmount

### Monitoring:
- Monitor API usage trong Goong Console
- Check response times
- Monitor error rates
- Track user interactions

## 🔄 Migration Notes

### Từ Leaflet:
- ✅ Không cần Leaflet dependencies
- ✅ Không cần OpenStreetMap tiles
- ✅ Sử dụng Goong SDK native
- ✅ Better integration với Goong services

### Breaking Changes:
- ❌ `MapSelector` → `GoongMapSelector`
- ❌ `MapModal` → `GoongMapModal`
- ❌ Leaflet props → Goong SDK props
- ❌ OpenStreetMap tiles → Goong styles

## 📞 Support

### Resources:
- [Goong Maps Documentation](https://docs.goong.io/)
- [Goong Maps SDK](https://www.npmjs.com/package/@goongmaps/goong-js)
- [Goong Console](https://account.goong.io/)

### Debug Tools:
- `GoongSDKTest` - Test SDK functionality
- `SimpleGoongTest` - Test API calls
- Browser DevTools - Check network requests
- Goong Console - Monitor API usage

---

**Tác giả**: AI Assistant  
**Ngày cập nhật**: $(date)  
**Phiên bản**: 2.0.0 (SDK Integration)


