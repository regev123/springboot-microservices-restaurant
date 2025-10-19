/**
 * Navigation routes constants
 * Centralized route definitions for better maintainability
 */

// Main application routes
export const ROUTES = {
  // Authentication routes
  LOGIN: '/',
  CHANGE_PASSWORD: '/change-password',

  // Dashboard routes
  HOME: '/home',

  // Admin routes
  ADMIN_USERS: '/admin/users',
  ADMIN_MENU: '/admin/menu',
};

// Navigation link configurations
export const NAVIGATION_LINKS = {
  // Authentication navigation
  AUTH: {
    CHANGE_PASSWORD: { to: ROUTES.CHANGE_PASSWORD, text: 'Change your password' },
    BACK_TO_LOGIN: { to: ROUTES.LOGIN, text: 'Back to Login' },
  },
};
