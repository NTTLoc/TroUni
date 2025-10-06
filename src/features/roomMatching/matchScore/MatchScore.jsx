import React from "react";
import { Progress, Tooltip } from "antd";

const MatchScore = ({ score }) => {
  const color = score > 80 ? "#00a896" : score > 60 ? "#fadb14" : "#ff4d4f";

  return (
    <Tooltip title={`Điểm hợp cạ: ${score}%`}>
      <Progress
        percent={score}
        size="small"
        strokeColor={color}
        showInfo={false}
      />
    </Tooltip>
  );
};

export default MatchScore;
