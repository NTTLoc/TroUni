import React from "react";
import { Card, Select, Space } from "antd";

const PRICE_RANGES = [
  { value: [0, 2000000], label: "Dưới 2 triệu" },
  { value: [2000000, 5000000], label: "2-5 triệu" },
  { value: [5000000, 10000000], label: "5-10 triệu" },
  { value: [10000000, 20000000], label: "10-20 triệu" },
  { value: [20000000, 50000000], label: "Trên 20 triệu" },
];

const PriceFilter = ({ priceRange, setPriceRange }) => (
  <Card title="Giá thuê" className="filter-card">
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        placeholder="Chọn khoảng giá"
        style={{ width: "100%" }}
        value={priceRange ? `${priceRange[0]}-${priceRange[1]}` : null}
        onChange={(value) => {
          if (value) {
            const [min, max] = value.split("-").map(Number);
            setPriceRange([min, max]);
          } else {
            setPriceRange(null);
          }
        }}
      >
        {PRICE_RANGES.map((range) => (
          <Select.Option
            key={`${range.value[0]}-${range.value[1]}`}
            value={`${range.value[0]}-${range.value[1]}`}
          >
            {range.label}
          </Select.Option>
        ))}
      </Select>
    </Space>
  </Card>
);

export default PriceFilter;
