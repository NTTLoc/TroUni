# 🗺️ Goong Maps Integration

Dự án đã được chuyển đổi từ OpenStreetMap sang Goong Maps để có hiệu suất và độ chính xác tốt hơn cho thị trường Việt Nam.

## 📋 Tổng quan

### API Keys được sử dụng:
- **API Key**: `bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE`
- **MapTiles Key**: `B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI`

### Các thay đổi chính:
1. ✅ Thay thế OpenStreetMap tiles bằng Goong Maps tiles
2. ✅ Cập nhật geocoding và reverse geocoding sử dụng Goong API
3. ✅ Tích hợp Goong Maps API service
4. ✅ Cập nhật các component map để sử dụng Goong Maps
5. ✅ Xóa các tham chiếu đến OpenStreetMap

## 🏗️ Cấu trúc Files

### Files mới được tạo:
- `src/utils/goongConfig.js` - Cấu hình Goong Maps API
- `src/services/goongApi.js` - Service tương tác với Goong API
- `src/components/debug/GoongMapsTest.jsx` - Component test Goong Maps

### Files được cập nhật:
- `src/components/map/MapSelector.jsx` - Sử dụng Goong tiles
- `src/components/map/MapModal.jsx` - Sử dụng Goong tiles
- `src/utils/addressParser.js` - Sử dụng Goong API
- `src/utils/alternativeMapApis.js` - Tích hợp Goong API
- `src/utils/mapFallback.js` - Cập nhật comments

## 🚀 Cách sử dụng

### 1. Map Tiles
```jsx
import { GOONG_TILE_LAYERS } from '../utils/goongConfig';

// Trong MapContainer
<TileLayer
  attribution={GOONG_TILE_LAYERS.BASIC.attribution}
  url={GOONG_TILE_LAYERS.BASIC.url}
/>
```

### 2. Geocoding (Tìm kiếm địa điểm)
```javascript
import { goongApi } from '../services/goongApi';

// Tìm kiếm địa điểm
const results = await goongApi.searchPlaces('Quận 1, TP.HCM', { limit: 5 });

// Tìm kiếm với chi tiết đầy đủ
const detailedResults = await goongApi.searchPlacesWithDetail('Quận 1, TP.HCM');
```

### 3. Reverse Geocoding (Lấy địa chỉ từ tọa độ)
```javascript
import { reverseGeocode } from '../utils/addressParser';

// Lấy địa chỉ từ tọa độ
const addressData = await reverseGeocode(10.8231, 106.6297);
console.log(addressData.display_name); // Địa chỉ đầy đủ
```

### 4. Forward Geocoding (Lấy tọa độ từ địa chỉ)
```javascript
import { forwardGeocode } from '../utils/addressParser';

// Lấy tọa độ từ địa chỉ
const location = await forwardGeocode('Quận 1, TP.HCM');
console.log(location.lat, location.lng); // Tọa độ
```

## 🧪 Testing

### Sử dụng GoongMapsTest Component:
```jsx
import GoongMapsTest from '../components/debug/GoongMapsTest';

// Trong component hoặc page
<GoongMapsTest />
```

Component này cho phép test:
- ✅ Search Places
- ✅ Search with Detail
- ✅ Reverse Geocoding
- ✅ Forward Geocoding
- ✅ Smart Search

## 📊 API Endpoints được sử dụng

### Goong Maps API:
- `GET /Place/AutoComplete` - Tìm kiếm địa điểm
- `GET /Place/Detail` - Chi tiết địa điểm
- `GET /Geocode` - Reverse geocoding
- `GET /DistanceMatrix` - Tính khoảng cách

### Map Tiles:
- `https://tiles.goong.io/assets/goong-map-mt/{z}/{x}/{y}.png` - Bản đồ cơ bản
- `https://tiles.goong.io/assets/goong-satellite-mt/{z}/{x}/{y}.png` - Bản đồ vệ tinh
- `https://tiles.goong.io/assets/goong-hybrid-mt/{z}/{x}/{y}.png` - Bản đồ hybrid

## 🔧 Configuration

### Cấu hình trong `goongConfig.js`:
```javascript
export const GOONG_CONFIG = {
  API_KEY: 'bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE',
  MAPTILES_KEY: 'B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI',
  BASE_URL: 'https://rsapi.goong.io',
  MAPTILES_URL: 'https://tiles.goong.io'
};
```

## 🎯 Lợi ích của Goong Maps

1. **Độ chính xác cao**: Dữ liệu địa lý Việt Nam chính xác hơn
2. **Hiệu suất tốt**: API response nhanh hơn OpenStreetMap
3. **Hỗ trợ tiếng Việt**: Tên địa điểm bằng tiếng Việt
4. **Tích hợp dễ dàng**: API đơn giản, dễ sử dụng
5. **Miễn phí**: Có quota miễn phí cho dự án nhỏ

## 🚨 Lưu ý quan trọng

1. **API Key Security**: Không commit API key vào public repository
2. **Rate Limiting**: Goong có giới hạn request, cần monitor usage
3. **Fallback**: Vẫn giữ fallback methods cho trường hợp API fail
4. **Testing**: Luôn test trước khi deploy production

## 📈 Monitoring

### Kiểm tra API usage:
- Theo dõi số lượng request trong Goong Console
- Monitor error rate và response time
- Backup plan khi API quota hết

## 🔄 Migration từ OpenStreetMap

### Đã hoàn thành:
- ✅ Thay thế map tiles
- ✅ Cập nhật geocoding services
- ✅ Cập nhật các map components
- ✅ Xóa OpenStreetMap references
- ✅ Tạo test components

### Không cần thay đổi:
- Leaflet library (vẫn sử dụng)
- Map interaction logic
- Component props và interfaces
- User experience flow

## 📞 Support

Nếu có vấn đề với Goong Maps integration:
1. Kiểm tra API key có đúng không
2. Test với GoongMapsTest component
3. Kiểm tra network connectivity
4. Xem Goong API documentation: https://docs.goong.io/

---

**Tác giả**: AI Assistant  
**Ngày cập nhật**: $(date)  
**Phiên bản**: 1.0.0
