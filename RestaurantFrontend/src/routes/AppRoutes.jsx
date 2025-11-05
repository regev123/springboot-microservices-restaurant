import { Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/Auth/LoginPage';
import ChangePasswordPage from '../pages/Auth/ChangePasswordPage';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import UsersManagementPage from '../pages/Admin/UsersManagementPage';
import MenuManagementPage from '../pages/Admin/MenuManagementPage';
import TablesManagementPage from '../pages/Admin/TablesManagementPage';
import TablesPage from '../pages/Table/TablesPage';
import TableDetailPage from '../pages/Table/TableDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/tables/:id" element={<TableDetailPage />} />
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="/admin/users" element={<UsersManagementPage />} />
        <Route path="/admin/menu" element={<MenuManagementPage />} />
        <Route path="/admin/tables" element={<TablesManagementPage />} />
      </Route>

      {/* 404 - Catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
