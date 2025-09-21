import React from "react";
import "./Card.css";

const Card = ({ title, children, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
