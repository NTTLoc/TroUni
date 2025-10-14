import React, { useEffect, useRef } from "react";
import { UserOutlined } from "@ant-design/icons";
import "./VideoGrid.scss";

const VideoGrid = ({ peer }) => {
  const internalRef = useRef(null);
  const videoRef = peer.videoRef || internalRef;

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    // nếu có stream và camera bật -> gán
    if (peer.stream && !peer.cameraOff) {
      try {
        // gán srcObject nếu khác
        if (videoEl.srcObject !== peer.stream) {
          videoEl.srcObject = peer.stream;
        }
        videoEl.muted = !!peer.isLocal;
        videoEl.play().catch(() => {});
      } catch (e) {
        console.warn("Video assign error", e);
      }
    } else {
      // nếu không có stream hoặc camera tắt -> clear srcObject
      try {
        if (videoEl.srcObject) {
          videoEl.srcObject = null;
        }
      } catch (e) {
        console.warn("Clear srcObject failed", e);
      }
    }

    return () => {
      // cleanup on unmount
      try {
        if (videoEl && videoEl.srcObject) videoEl.srcObject = null;
      } catch (e) {}
    };
  }, [peer.stream, peer.cameraOff, peer.isLocal, videoRef]);

  return (
    <div className="video-item">
      {peer.cameraOff || !peer.stream ? (
        <div className="avatar-placeholder">
          {peer.name ? peer.name.charAt(0).toUpperCase() : <UserOutlined />}
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline />
      )}
      <p className="username">
        {peer.name ? peer.name + (peer.isLocal ? " (Bạn)" : "") : "Người dùng"}
      </p>
    </div>
  );
};

export default VideoGrid;
