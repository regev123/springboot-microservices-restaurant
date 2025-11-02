// src/App.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './store/thunks/authThunks';
import { logout } from './store/slices/authSlice';
import { clearAllToasts } from './store/slices/uiSlice';
import AppRoutes from './routes/AppRoutes';
import { GlobalToastManager } from './components/common/Toast';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, shouldForceLogout } = useSelector((state) => state.auth);

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/change-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Main authentication logic - runs on app initialization, token changes, and location changes
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');

    // Scenario 1: No token exists and user is not on a public route
    if (!tokenFromStorage && !isPublicRoute) {
      navigate('/login', { replace: true });
      return;
    }

    // Scenario 2: Token exists and user is on login page
    if (tokenFromStorage && location.pathname === '/login') {
      navigate('/home', { replace: true });
      return;
    }

    // Scenario 3: Token exists, not on public routes, and need to fetch user data
    if (tokenFromStorage && !isPublicRoute) {
      dispatch(fetchUser());
      return;
    }

    // Scenario 4: No token in storage but token exists in state (shouldn't happen, but handle it)
    if (!tokenFromStorage && token) {
      // This means the store was reset, navigate to login
      navigate('/login', { replace: true });
      return;
    }
  }, [token, location.pathname, isPublicRoute, dispatch, navigate]); // Include location and other dependencies

  // Handle fetchUser failure - redirect to login if token exists but user fetch fails
  useEffect(() => {
    if (shouldForceLogout) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [shouldForceLogout, dispatch, navigate]);

  // Clear messages when navigating to different routes
  useEffect(() => {
    dispatch(clearAllToasts());
  }, [location.pathname, dispatch]);

  return (
    <>
      {/* App routes */}
      <AppRoutes />

      {/* Global toast notifications */}
      <GlobalToastManager />
    </>
  );
}

export default App;
