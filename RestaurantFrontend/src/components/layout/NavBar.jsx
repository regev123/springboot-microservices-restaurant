import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="brand" onClick={() => navigate("/home")}>
          🍔 Restaurant App
        </span>

        <div className="nav-links">
          {user?.role === "ADMIN" && (
            <Link to="/admin/users" className="nav-link">
              Users
            </Link>
          )}
        </div>
      </div>

      <div className="nav-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
