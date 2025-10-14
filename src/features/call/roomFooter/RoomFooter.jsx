import React from "react";

const RoomFooter = ({ roomId }) => (
  <div className="room-footer">
    <span>
      {new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
    <span className="room-id">{roomId}</span>
  </div>
);

export default RoomFooter;
