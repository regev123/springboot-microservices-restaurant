import React, { useState } from "react";
import "./Input.css";

const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  // determine input type dynamically
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <div className="input-with-icon">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
        {type === "password" && (
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
