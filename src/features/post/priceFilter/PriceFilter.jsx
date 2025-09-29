import React from "react";
import "./PriceFilter.scss";

const PriceFilter = () => {
  const ranges = ["Dưới 2 triệu", "2 - 3 triệu", "3 - 5 triệu", "5 - 10 triệu"];
  return (
    <div className="price-filter">
      <h4>Lọc theo khoảng giá</h4>
      <ul className="range-list">
        {ranges.map((r, i) => (
          <li key={i} className="range-item">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceFilter;
