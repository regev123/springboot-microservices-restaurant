import { Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/Auth/LoginPage';
import ChangePasswordPage from '../pages/Auth/ChangePasswordPage';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import UsersManagementPage from '../pages/Admin/UsersManagementPage';
import MenuManagementPage from '../pages/Admin/MenuManagementPage';
import { ROUTES } from '../constants';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path={ROUTES.ADMIN_USERS} element={<UsersManagementPage />} />
        <Route path={ROUTES.ADMIN_MENU} element={<MenuManagementPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
