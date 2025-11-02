import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, resetAllStore } from '../../../store/slices/authSlice';
import FormButton from '../../common/Button2/FormButton';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage first
    dispatch(resetAllStore()); // Clear all Redux store
    navigate('/', { replace: true });
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isActiveMenu = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/home',
      roles: ['ADMIN', 'USER'],
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: '⚙️',
      roles: ['ADMIN'],
      subItems: [
        {
          id: 'admin-users',
          label: 'Users',
          icon: '👥',
          path: '/admin/users',
          roles: ['ADMIN'],
        },
        {
          id: 'admin-menus',
          label: 'Menus',
          icon: '📋',
          path: '/admin/menu',
          roles: ['ADMIN'],
        },
        {
          id: 'admin-tables',
          label: 'Tables',
          icon: '🪑',
          path: '/admin/tables',
          roles: ['ADMIN'],
        },
        {
          id: 'admin-orders',
          label: 'Orders',
          icon: '📦',
          path: '/admin/orders',
          roles: ['ADMIN'],
        },
        {
          id: 'admin-analytics',
          label: 'Analytics',
          icon: '📊',
          path: '/admin/analytics',
          roles: ['ADMIN'],
        },
        {
          id: 'admin-settings',
          label: 'Settings',
          icon: '🔧',
          path: '/admin/settings',
          roles: ['ADMIN'],
        },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '🍽️',
      path: '/orders',
      roles: ['ADMIN', 'USER'],
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: '📅',
      path: '/reservations',
      roles: ['ADMIN', 'USER'],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile',
      roles: ['ADMIN', 'USER'],
    },
  ];

  const filteredItems = navigationItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="block md:hidden fixed top-4 left-4 z-[1001]">
        <button
          className="flex flex-col justify-around w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 border-0 rounded-md cursor-pointer p-1 shadow-lg shadow-primary-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/40"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="w-full h-0.5 bg-white rounded-sm transition-all duration-300"></span>
          <span className="w-full h-0.5 bg-white rounded-sm transition-all duration-300"></span>
          <span className="w-full h-0.5 bg-white rounded-sm transition-all duration-300"></span>
        </button>
      </div>

      <div
        className={`fixed left-0 top-0 h-screen w-60 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl shadow-black/10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[1000] backdrop-blur-lg md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo and Brand Section */}
        <div className="p-1 border-b border-slate-700 relative">
          <div
            className="flex items-center cursor-pointer transition-all duration-200 rounded-lg p-3"
            onClick={() => {
              navigate('/home');
              closeMobileMenu();
            }}
          >
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h1
                className="text-lg font-bold text-slate-300 leading-tight truncate"
                style={{ color: '#cbd5e1' }}
              >
                Restaurant App
              </h1>
              <p className="text-xs text-slate-300 font-medium tracking-wide truncate">
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-4 pl-8 border-b border-slate-700 flex items-center gap-3 bg-white/[0.02]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm uppercase">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 pl-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <ul className="list-none m-0 p-0">
            {filteredItems.map((item) => (
              <li key={item.id} className="my-1">
                {item.subItems ? (
                  <div className="relative">
                    <div
                      className={`absolute inset-0 ${
                        isActiveMenu(item.subItems.map((sub) => sub.path))
                          ? 'bg-gradient-to-r from-primary-500/15 to-transparent'
                          : ''
                      } hover:bg-white/5 transition-all duration-200`}
                    ></div>
                    <button
                      className={`flex items-center gap-3 px-4 py-3 text-slate-300 no-underline rounded-none transition-all duration-200 relative font-medium text-sm w-full ${
                        isActiveMenu(item.subItems.map((sub) => sub.path))
                          ? 'text-primary-400 border-r-2 border-primary-500'
                          : ''
                      } hover:text-white`}
                      onClick={() => toggleMenu(item.id)}
                    >
                      <span className="text-lg w-5 text-center flex-shrink-0 relative z-10">
                        {item.icon}
                      </span>
                      <span className="flex-1 whitespace-nowrap overflow-hidden text-left relative z-10">
                        {item.label}
                      </span>
                      <span
                        className={`text-xs transition-transform duration-200 text-slate-400 flex-shrink-0 relative z-10 ${expandedMenus[item.id] ? 'rotate-180 text-primary-400' : ''}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedMenus[item.id] && (
                      <ul className="list-none m-0 p-0 bg-black/20 border-l-2 border-slate-600 ml-4">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id} className="m-0">
                            <Link
                              to={subItem.path}
                              className={`flex items-center gap-3 py-2.5 px-4 pl-8 text-slate-400 no-underline transition-all duration-200 text-sm relative ${
                                isActiveRoute(subItem.path)
                                  ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500'
                                  : ''
                              } hover:bg-white/[0.03] hover:text-white hover:pl-9`}
                              onClick={closeMobileMenu}
                            >
                              <span className="text-base w-4 text-center flex-shrink-0">
                                {subItem.icon}
                              </span>
                              <span className="flex-1 whitespace-nowrap">{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      className={`absolute inset-0 ${
                        isActiveRoute(item.path)
                          ? 'bg-gradient-to-r from-primary-500/15 to-transparent'
                          : ''
                      } hover:bg-white/5 transition-all duration-200`}
                    ></div>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 text-slate-300 no-underline rounded-none transition-all duration-200 relative font-medium text-sm ${
                        isActiveRoute(item.path)
                          ? 'text-primary-400 border-r-2 border-primary-500'
                          : ''
                      } hover:text-white`}
                      onClick={closeMobileMenu}
                    >
                      <span className="text-lg w-5 text-center flex-shrink-0 relative z-10">
                        {item.icon}
                      </span>
                      <span className="flex-1 whitespace-nowrap overflow-hidden relative z-10">
                        {item.label}
                      </span>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 pl-6 border-t border-slate-700 bg-black/20">
          <div className="mb-4">
            <p className="text-slate-600 text-xs m-0 mb-1 font-medium">v1.0.0</p>
            <p className="text-slate-600 text-xs m-0">© 2024 Restaurant App</p>
          </div>
          <FormButton
            type="red"
            text="Logout"
            icon="logout"
            onClick={handleLogout}
            className="w-[95%]"
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
