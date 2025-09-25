import React from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="search-container">
      {/* Location */}
      <div className="location-box">
        <button className="location-btn">
          <FaMapMarkerAlt className="icon" />
          Toàn quốc
          <span className="arrow">▼</span>
        </button>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm bất động sản..."
          className="search-input"
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
