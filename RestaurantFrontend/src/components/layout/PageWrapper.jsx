import React from "react";
import "./PageWrapper.css";
import NavBar from "./NavBar";

const PageWrapper = ({ title, subtitle, children }) => {
  return (
    <div className="page-wrapper">
      <NavBar />

      <header className="page-header">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </header>

      <main>{children}</main>
    </div>
  );
};

export default PageWrapper;
