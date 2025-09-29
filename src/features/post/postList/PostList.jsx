import React from "react";
import "./PostList.scss";
import PostCard from "../postCard/PostCard";
import dummyPosts from "../../../utils/mockData";

const PostList = () => {
  return (
    <div className="post-list">
      {dummyPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
