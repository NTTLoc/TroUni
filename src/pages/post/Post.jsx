import React from "react";
import PostList from "../../components/post/postList/PostList";
import PostCategory from "../../components/post/postCategory/PostCategory";
import PostTab from "../../components/post/postTab/PostTab";
import PriceFilter from "../../components/post/priceFilter/PriceFilter";
import LocationFilter from "../../components/post/locationFilter/LocationFilter";
import FilterBar from "../../components/post/filterBar/FilterBar";
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
