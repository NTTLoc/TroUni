import React, { useState } from "react";
import "./PostGallery.scss";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const PostGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="post-gallery">Không có hình ảnh</div>;
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="post-gallery">
      {/* Ảnh chính */}
      <div className="post-gallery__main">
        <img src={images[currentIndex]} alt={`main-${currentIndex}`} />

        {/* Nút chuyển ảnh */}
        {images.length > 1 && (
          <>
            <button className="nav prev" onClick={prevImage}>
              <LeftOutlined />
            </button>
            <button className="nav next" onClick={nextImage}>
              <RightOutlined />
            </button>
          </>
        )}

        {/* Hiển thị số ảnh */}
        <div className="counter">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="post-gallery__thumbs">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`thumb-${i}`}
            className={i === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default PostGallery;
