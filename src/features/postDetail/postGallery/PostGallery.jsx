import React, { useState } from "react";
import "./PostGallery.scss";
import {
  LeftOutlined,
  RightOutlined,
  ExpandOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import PanoramaViewer from "../../../components/viewer360/Viewer360";
import { assets } from "../../../assets/assets";

const PostGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);

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

        {/* Nút mở ảnh 360 */}
        <button
          className="nav panorama"
          onClick={() => setIsPanoramaOpen(true)}
        >
          <ExpandOutlined /> 360°
        </button>

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

      {/* Toàn màn hình Panorama Viewer */}
      {isPanoramaOpen && (
        <div className="panorama-fullscreen">
          <button
            className="close-btn"
            onClick={() => setIsPanoramaOpen(false)}
          >
            <CloseOutlined />
          </button>
          <PanoramaViewer imageUrl={assets.anh360_3} />
        </div>
      )}
    </div>
  );
};

export default PostGallery;
