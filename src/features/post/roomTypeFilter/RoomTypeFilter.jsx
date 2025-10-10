import React from "react";
import { Card, Checkbox, Space } from "antd";

const ROOM_TYPES = [
  { value: "PHONG_TRO", label: "Phòng trọ" },
  { value: "CHUNG_CU_MINI", label: "Chung cư mini" },
  { value: "O_GHEP", label: "Ở ghép" },
  { value: "KY_TUC_XA", label: "Ký túc xá" },
];

const RoomTypeFilter = ({ selectedRoomTypes, setSelectedRoomTypes }) => (
  <Card title="Loại phòng" className="filter-card">
    <Space direction="vertical" style={{ width: "100%" }}>
      {ROOM_TYPES.map((type) => (
        <Checkbox
          key={type.value}
          checked={selectedRoomTypes.includes(type.value)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRoomTypes([...selectedRoomTypes, type.value]);
            } else {
              setSelectedRoomTypes(
                selectedRoomTypes.filter((t) => t !== type.value)
              );
            }
          }}
        >
          {type.label}
        </Checkbox>
      ))}
    </Space>
  </Card>
);

export default RoomTypeFilter;
