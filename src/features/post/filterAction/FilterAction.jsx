import React from "react";
import { Card, Button, Space } from "antd";

const FilterActions = ({ handleResetFilters, handleSearch }) => (
  <Card title="⚡ Hành động" className="filter-card">
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={handleResetFilters} block>
        Làm mới
      </Button>
      {/* <Button type="primary" block onClick={handleSearch}>
        ✨ Áp dụng bộ lọc
      </Button> */}
    </Space>
  </Card>
);

export default FilterActions;
