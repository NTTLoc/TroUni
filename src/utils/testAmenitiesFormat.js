// Test function để verify amenities format
export const testAmenitiesFormat = () => {
  console.log("🧪 Testing amenities format...");
  
  const mockAmenityList = [
    { id: "123", name: "WiFi miễn phí", iconUrl: "📶" },
    { id: "456", name: "Điều hòa", iconUrl: "❄️" }
  ];
  
  const mockRoomData = {
    title: "Test Room",
    roomType: "PHONG_TRO",
    city: "HCM",
    district: "Quan 1",
    ward: "Phuong 1",
    streetAddress: "123 Test Street",
    pricePerMonth: "3000000",
    amenityIds: mockAmenityList
  };
  
  console.log("📝 Input amenityIds:", mockRoomData.amenityIds);
  
  // Simulate formatRoomData logic
  const formattedAmenities = mockRoomData.amenityIds ? 
    mockRoomData.amenityIds.map(amenity => ({ name: amenity.name })) : [];
  
  console.log("📤 Formatted amenities:", formattedAmenities);
  
  const expectedFormat = [
    { name: "WiFi miễn phí" },
    { name: "Điều hòa" }
  ];
  
  console.log("✅ Expected format:", expectedFormat);
  console.log("✅ Match:", JSON.stringify(formattedAmenities) === JSON.stringify(expectedFormat));
  
  return formattedAmenities;
};
