import React from "react";
import { Button } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  VideoCameraAddOutlined,
  VideoCameraFilled,
  PhoneOutlined,
} from "@ant-design/icons";

const ToolBar = ({ muted, toggleMute, cameraOff, toggleCamera, hangup }) => (
  <div className="toolbar">
    <Button
      className="control-btn"
      shape="circle"
      icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
      onClick={toggleMute}
    />
    <Button
      className="control-btn"
      shape="circle"
      icon={cameraOff ? <VideoCameraAddOutlined /> : <VideoCameraFilled />}
      onClick={toggleCamera}
    />
    <Button
      className="control-btn end-call"
      shape="circle"
      type="primary"
      danger
      size="large"
      icon={<PhoneOutlined />}
      onClick={hangup}
    />
  </div>
);

export default ToolBar;
