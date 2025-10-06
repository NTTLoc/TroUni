import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { Select, Input, Button } from "antd";
import "./SearchBar.scss";

const { Option } = Select;

const SearchBar = () => {
  const [location, setLocation] = useState("toan-quoc");

  const wards = [
    { value: "toan-quoc", label: "Toàn quốc" },
    { value: "ha-noi", label: "Hà Nội" },
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "phuong-moi", label: "Phường Mới Sáp Nhập" },
  ];

  return (
    <div className="search-container">
      {/* Location */}
      <div className="location-box">
        <button className="location-btn">
          <FaMapMarkerAlt className="icon" />
          <Select
            value={location}
            onChange={(val) => setLocation(val)}
            bordered={false}
            className="location-select"
            dropdownStyle={{ borderRadius: 8 }}
          >
            {wards.map((w) => (
              <Option key={w.value} value={w.value}>
                {w.label}
              </Option>
            ))}
          </Select>
        </button>
      </div>

      {/* Search */}
      <div className="search-box">
        <Input placeholder="Tìm phòng trọ..." className="search-input" />
        <Button
          type="primary"
          shape="circle"
          className="search-btn"
          icon={<FaSearch />}
        />
      </div>
    </div>
  );
};

export default SearchBar;
