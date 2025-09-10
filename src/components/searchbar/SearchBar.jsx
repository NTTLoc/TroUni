import React from "react";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Nhập khu vực bạn muốn tìm..." />
      <button>Tìm kiếm</button>
    </div>
  );
};

export default SearchBar;
