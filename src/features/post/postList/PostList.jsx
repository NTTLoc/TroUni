import React, { useState, useEffect } from "react";
import "./PostList.scss";
import PostCard from "../postCard/PostCard";
import { Spin, Empty } from "antd";
import { getAllPostsAPI } from "../../../services/postApi";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPostsAPI();
        setPosts(res.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={`post-${post.id}`} post={post} />)
      ) : (
        <Empty description="Không có bài đăng nào" />
      )}
    </div>
  );
};

export default PostList;
