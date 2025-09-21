import React from "react";
import "./FormWrapper.css";

const FormWrapper = ({ title, children }) => {
  return (
    <div className="form-container">
      <form className="form-wrapper">
        <h2>{title}</h2>
        {children}
      </form>
    </div>
  );
};

export default FormWrapper;
