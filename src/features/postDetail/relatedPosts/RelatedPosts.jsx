import React, { useState, useEffect } from "react";
import "./RelatedPosts.scss";
import { Link } from "react-router-dom";
import { path } from "../../../utils/constants";
import { getAllPostsAPI } from "../../../services/postApi"; // import API đúng

const RelatedPosts = () => {
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

  if (loading) {
    return <div className="related-posts">Đang tải...</div>;
  }

  if (!posts.length) {
    return <div className="related-posts">Không có bài đăng tương tự</div>;
  }

  return (
    <div className="related-posts">
      <h3>Tin đăng tương tự</h3>
      <div className="related-list">
        {posts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id} className="related-card">
            <div className="image-wrapper">
              <img src={post.thumbnailUrl} alt={post.title} />
              {/* {post.isPriority && <span className="badge">Đối Tác</span>} */}
            </div>

            <div className="info">
              <h4>{post.title}</h4>
              {/* <p className="desc">{post.description}</p> */}
              <div className="meta">
                <span className="price">
                  {Math.floor(post.price / 1000000)} Triệu/tháng
                </span>
                <span className="size">{post.area} m²</span>
              </div>
              <p className="location">{post.address}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link to={path.POST} className="view-more">
        Xem thêm
      </Link>
    </div>
  );
};

export default RelatedPosts;
