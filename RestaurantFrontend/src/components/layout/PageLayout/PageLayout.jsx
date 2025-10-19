import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const PageLayout = ({ children, className = '' }) => {
  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden ml-60 ${className}`}
      >
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">{children}</div>
      </div>
    </>
  );
};

export default PageLayout;
