import React from "react";
import VideoGrid from "../videoGrid/VideoGrid";
import "./VideoSection.scss";

const VideoSection = ({ localVideoRef, localName, cameraOff, remotePeers }) => {
  // Tạo mảng peers gồm cả local + remote
  const allPeers = [
    {
      id: "local",
      name: localName + (cameraOff ? " (Camera off)" : ""),
      stream: localVideoRef.current?.srcObject,
      cameraOff: cameraOff,
      isLocal: true,
      videoRef: localVideoRef,
    },
    ...remotePeers.map((peer) => ({
      ...peer,
      isLocal: false,
    })),
  ];

  return (
    <div className="video-section">
      <div className="video-grid">
        {allPeers.map((peer) => (
          <VideoGrid key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
