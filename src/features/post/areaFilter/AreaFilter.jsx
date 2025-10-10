import React from "react";
import { Card, Select, Space } from "antd";

const AREA_RANGES = [
  { value: [0, 20], label: "Dưới 20 m²" },
  { value: [20, 40], label: "20-40 m²" },
  { value: [40, 60], label: "40-60 m²" },
  { value: [60, 100], label: "60-100 m²" },
  { value: [100, 200], label: "Trên 100 m²" },
];

const AreaFilter = ({ areaRange, setAreaRange }) => (
  <Card title="Diện tích" className="filter-card">
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        placeholder="Chọn khoảng diện tích"
        style={{ width: "100%" }}
        value={areaRange ? `${areaRange[0]}-${areaRange[1]}` : null}
        onChange={(value) => {
          if (value) {
            const [min, max] = value.split("-").map(Number);
            setAreaRange([min, max]);
          } else {
            setAreaRange(null);
          }
        }}
      >
        {AREA_RANGES.map((range) => (
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

export default AreaFilter;
