import React from "react";
import { Card, Select, Space } from "antd";

const CITIES = [
  { value: "HCM", label: "Hồ Chí Minh" },
  { value: "HN", label: "Hà Nội" },
  { value: "DN", label: "Đà Nẵng" },
  { value: "HP", label: "Hải Phòng" },
  { value: "CT", label: "Cần Thơ" },
];

const DISTRICTS = {
  HCM: [
    { value: "Quan 1", label: "Quận 1" },
    { value: "Quan 2", label: "Quận 2" },
    { value: "Quan 3", label: "Quận 3" },
    { value: "Quan 4", label: "Quận 4" },
    { value: "Quan 5", label: "Quận 5" },
  ],
  HN: [
    { value: "Hoan Kiem", label: "Hoàn Kiếm" },
    { value: "Ba Dinh", label: "Ba Đình" },
    { value: "Dong Da", label: "Đống Đa" },
    { value: "Hai Ba Trung", label: "Hai Bà Trưng" },
    { value: "Cau Giay", label: "Cầu Giấy" },
  ],
};

const LocationFilter = ({
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
}) => (
  <Card title="Vị trí" className="filter-card">
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        placeholder="Chọn thành phố"
        style={{ width: "100%" }}
        value={selectedCity}
        onChange={(city) => {
          setSelectedCity(city);
          setSelectedDistrict(null);
        }}
      >
        {CITIES.map((city) => (
          <Select.Option key={city.value} value={city.value}>
            {city.label}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Chọn quận/huyện"
        style={{ width: "100%" }}
        value={selectedDistrict}
        onChange={setSelectedDistrict}
        disabled={!selectedCity}
      >
        {selectedCity &&
          DISTRICTS[selectedCity]?.map((district) => (
            <Select.Option key={district.value} value={district.value}>
              {district.label}
            </Select.Option>
          ))}
      </Select>
    </Space>
  </Card>
);

export default LocationFilter;
