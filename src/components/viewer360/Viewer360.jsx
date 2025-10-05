import React, { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import "./Viewer360.scss";

const PanoramaViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // set chiều cao theo tỉ lệ ảnh
      const ratio = img.height / img.width;
      containerRef.current.style.height = `${
        containerRef.current.offsetWidth * ratio
      }px`;

      // hủy viewer cũ nếu có
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }

      // khởi tạo viewer mới
      viewerRef.current = new Viewer({
        container: containerRef.current,
        panorama: imageUrl,
        caption: "Ảnh 360 độ phòng trọ",
        loadingImg:
          "https://photo-sphere-viewer-data.netlify.app/assets/photosphere-logo.gif",
        touchmoveTwoFingers: true,
        navbar: ["zoom", "fullscreen"],
      });
    };

    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, [imageUrl]);

  return (
    <div className="panorama-wrapper">
      <div className="panorama-container" ref={containerRef} />
    </div>
  );
};

export default PanoramaViewer;
