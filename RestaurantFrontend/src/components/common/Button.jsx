import React from "react";
import { Trash2, Lock, Unlock, Save, Edit } from "lucide-react";
import "./Button.css";

const icons = {
  delete: <Trash2 size={16} />,
  lock: <Lock size={16} />,
  unlock: <Unlock size={16} />,
  save: <Save size={16} />,
  edit: <Edit size={16} />,
};

const Button = ({
  text,
  onClick,
  type = "button",
  variant = "primary",
  icon, // "delete" | "lock" | "unlock" | "save" | "edit"
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icons[icon]}</span>}
      {text}
    </button>
  );
};

export default Button;
