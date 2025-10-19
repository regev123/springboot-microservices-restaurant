import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants';

const ProtectedRoute = ({ roles }) => {
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.auth.user) || {};

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
