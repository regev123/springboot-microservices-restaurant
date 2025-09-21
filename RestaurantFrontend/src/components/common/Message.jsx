import React from "react";
import "./Message.css";

const Message = ({ type = "info", children }) => {
  return (
    <div className={`message message-${type}`}>
      {children}
    </div>
  );
};

export default Message;
