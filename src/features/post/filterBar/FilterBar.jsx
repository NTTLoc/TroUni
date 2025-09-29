import React from "react";
import "./FilterBar.scss";

const FilterBar = () => {
  return (
    <div className="post-filter">
      <select>
        <option>Cho thuê</option>
        <option>Bán</option>
      </select>
      <select>
        <option>Loại hình BĐS</option>
        <option>Căn hộ</option>
        <option>Phòng trọ</option>
      </select>
      <select>
        <option>Giá thuê</option>
        <option>Dưới 2 triệu</option>
        <option>2 - 5 triệu</option>
        <option>5 - 10 triệu</option>
      </select>
      <select>
        <option>Dự án</option>
      </select>
      <button>Lọc</button>
    </div>
  );
};

export default FilterBar;
