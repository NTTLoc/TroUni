/**
 * Map Fallback Service
 * Backup services khi OpenStreetMap Nominatim fail
 */

/**
 * Mock suggestions cho các địa điểm phổ biến ở TP.HCM
 */
export const getFallbackSuggestions = (query) => {
  const commonLocations = [
    {
      id: 'q1-1',
      display_name: `${query}, Quận 1, Thành phố Hồ Chí Minh, Việt Nam`,
      lat: 10.7769,
      lng: 106.7009,
      address: { city: 'Thành phố Hồ Chí Minh', district: 'Quận 1' }
    },
    {
      id: 'q3-1',
      display_name: `${query}, Quận 3, Thành phố Hồ Chí Minh, Việt Nam`,
      lat: 10.7829,
      lng: 106.6879,
      address: { city: 'Thành phố Hồ Chí Minh', district: 'Quận 3' }
    },
    {
      id: 'q7-1',
      display_name: `${query}, Quận 7, Thành phố Hồ Chí Minh, Việt Nam`,
      lat: 10.7377,
      lng: 106.7225,
      address: { city: 'Thành phố Hồ Chí Minh', district: 'Quận 7' }
    },
    {
      id: 'q10-1',
      display_name: `${query}, Quận 10, Thành phố Hồ Chí Minh, Việt Nam`,
      lat: 10.7738,
      lng: 106.6668,
      address: { city: 'Thành phố Hồ Chí Minh', district: 'Quận 10' }
    },
    {
      id: 'qbt-1',
      display_name: `${query}, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam`,
      lat: 10.8106,
      lng: 106.7091,
      address: { city: 'Thành phố Hồ Chí Minh', district: 'Quận Bình Thạnh' }
    }
  ];

  // Filter suggestions based on query
  const filtered = commonLocations.filter(location => 
    location.display_name.toLowerCase().includes(query.toLowerCase()) ||
    location.address.district.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.length > 0 ? filtered : commonLocations.slice(0, 3);
};

/**
 * Mock reverse geocoding cho TP.HCM
 */
export const getFallbackAddress = (lat, lng) => {
  // Simple logic to determine district based on coordinates
  const districts = [
    { name: 'Quận 1', lat: 10.7769, lng: 106.7009 },
    { name: 'Quận 3', lat: 10.7829, lng: 106.6879 },
    { name: 'Quận 7', lat: 10.7377, lng: 106.7225 },
    { name: 'Quận 10', lat: 10.7738, lng: 106.6668 },
    { name: 'Quận Bình Thạnh', lat: 10.8106, lng: 106.7091 }
  ];

  // Find closest district
  let closestDistrict = districts[0];
  let minDistance = Math.sqrt(
    Math.pow(lat - districts[0].lat, 2) + Math.pow(lng - districts[0].lng, 2)
  );

  districts.forEach(district => {
    const distance = Math.sqrt(
      Math.pow(lat - district.lat, 2) + Math.pow(lng - district.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestDistrict = district;
    }
  });

  return {
    display_name: `${lat.toFixed(6)}, ${lng.toFixed(6)}, ${closestDistrict.name}, Thành phố Hồ Chí Minh, Việt Nam`,
    address: {
      city: 'Thành phố Hồ Chí Minh',
      district: closestDistrict.name,
      country: 'Việt Nam'
    },
    raw_data: {
      place_id: `fallback-${lat}-${lng}`,
      display_name: `${lat.toFixed(6)}, ${lng.toFixed(6)}, ${closestDistrict.name}, Thành phố Hồ Chí Minh, Việt Nam`,
      address: {
        city: 'Thành phố Hồ Chí Minh',
        district: closestDistrict.name,
        country: 'Việt Nam'
      }
    }
  };
};
