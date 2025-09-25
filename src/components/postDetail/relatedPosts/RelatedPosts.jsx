import React, { useState } from "react";
import "./RelatedPosts.scss";
import { Link } from "react-router-dom";
import { path } from "../../../utils/constants";

const RelatedPosts = ({ posts }) => {
  // const [currentIndex, setCurrentIndex] = useState(0);

  // if (!posts || posts.length === 0) {
  //   return <div className="post-gallery">Không có hình ảnh</div>;
  // }

  // const prevImage = () => {
  //   setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  // };

  // const nextImage = () => {
  //   setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  // };

  return (
    <div className="related-posts">
      <h3>Tin đăng tương tự</h3>
      <div className="related-list">
        {posts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id} className="related-card">
            <div className="image-wrapper">
              <img src={post.image} alt={post.title} />
              {post.isPriority && <span className="badge">Đối Tác</span>}
            </div>

            <div className="info">
              <h4>{post.title}</h4>
              <p className="desc">{post.description}</p>
              <div className="meta">
                <span className="price">{post.price}</span>
                <span className="size">{post.size} m²</span>
              </div>
              <p className="location">{post.location}</p>
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
