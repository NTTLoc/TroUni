import React from "react";
import { Card, Space, Button, Typography, Divider } from "antd";
import AmenitySelector from "../components/amenity/AmenitySelector";

const { Title, Text } = Typography;

/**
 * Demo component để test AmenitySelector
 */
const AmenityDemo = () => {
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);

  const handleSelectionChange = (amenities) => {
    console.log("Selected amenities:", amenities);
    setSelectedAmenities(amenities);
  };

  const handleAmenityCreated = (newAmenity) => {
    console.log("New amenity created:", newAmenity);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Card>
        <Title level={2}>Demo AmenitySelector</Title>
        <Text type="secondary">
          Component để chọn amenities cho phòng trọ
        </Text>

        <Divider />

        <AmenitySelector
          selectedAmenities={selectedAmenities}
          onSelectionChange={handleSelectionChange}
          roomId={null}
          showCreateForm={true}
          onAmenityCreated={handleAmenityCreated}
          maxSelection={10}
        />

        <Divider />

        <div>
          <Title level={4}>Selected Amenities ({selectedAmenities.length})</Title>
          <Space wrap>
            {selectedAmenities.map(amenity => (
              <Button key={amenity.id} size="small">
                {amenity.iconUrl ? (
                  <img src={amenity.iconUrl} alt={amenity.name} style={{ width: 16, height: 16, marginRight: 4 }} />
                ) : (
                  <span style={{ marginRight: 4 }}>🏠</span>
                )}
                {amenity.name}
              </Button>
            ))}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default AmenityDemo;
