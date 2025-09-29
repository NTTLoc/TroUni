import React from "react";
import FilterBar from "../../features/post/filterBar/FilterBar";
import PostCategory from "../../features/post/PostCategory/PostCategory";
import PostTab from "../../features/post/PostTab/PostTab";
import PostList from "../../features/post/PostList/PostList";
import PriceFilter from "../../features/post/PriceFilter/PriceFilter";
import LocationFilter from "../../features/post/LocationFilter/LocationFilter";
import "./Post.scss";

const Post = () => {
  return (
    <div className="post-page">
      <div className="post-left">
        <div className="top">
          <FilterBar />
          <PostCategory />
        </div>
        <div className="bottom">
          <PostTab />
          <PostList />
        </div>
      </div>

      <div className="post-right">
        <PriceFilter />
        <LocationFilter />
      </div>
    </div>
  );
};

export default Post;
