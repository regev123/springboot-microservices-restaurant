import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'DRAFT':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'INACTIVE':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'PENDING':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
        transition-all duration-200 hover:scale-105
        ${getStatusStyles(status)}
        ${className}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
