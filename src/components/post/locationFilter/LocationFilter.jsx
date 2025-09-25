import React from "react";
import "./LocationFilter.scss";

const LocationFilter = () => {
  const locations = [
    "TP. Thủ Đức",
    "Quận 1",
    "Quận Bình Thạnh",
    "Quận Tân Bình",
  ];
  return (
    <div className="location-filter">
      <h4>Thuê bất động sản</h4>
      <ul className="range-list">
        {locations.map((l, i) => (
          <li key={i} className="range-item">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationFilter;
