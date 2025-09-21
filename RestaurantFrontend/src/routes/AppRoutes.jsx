import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetStatusAll } from "../store/globalActions";
import { useLocation } from "react-router-dom";

const AppRoutesInner = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetStatusAll());
  }, [location, dispatch]);

  return (
      <Routes>
        {/* Public route */}
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <AppRoutesInner />
  </BrowserRouter>
);

export default AppRoutes;
