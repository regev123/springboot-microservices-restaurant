import React from 'react';

/**
 * StatusSummaryCard Component
 * 
 * A reusable card component for displaying status summaries with count and icon.
 * 
 * @param {Object} props
 * @param {string} props.label - Label text (e.g., "Available", "Occupied")
 * @param {number} props.count - Count value to display
 * @param {string} props.icon - Icon emoji or text
 * @param {string} props.color - Color theme: 'emerald', 'red', 'amber', 'blue'
 */
const StatusSummaryCard = ({ label, count, icon, color = 'slate' }) => {
  const colorClasses = {
    emerald: {
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500/50',
    },
    red: {
      gradient: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      hoverBorder: 'hover:border-red-500/50',
    },
    amber: {
      gradient: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      hoverBorder: 'hover:border-amber-500/50',
    },
    blue: {
      gradient: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500/50',
    },
    slate: {
      gradient: 'from-slate-500/20 to-slate-600/10',
      border: 'border-slate-500/30',
      hoverBorder: 'hover:border-slate-500/50',
    },
  };

  const colors = colorClasses[color] || colorClasses.slate;

  return (
    <div
      className={`bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-lg p-3.5 ${colors.hoverBorder} transition-colors`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
          <p className="text-xl font-bold drop-shadow-sm" style={{ color: '#ffffff' }}>
            {count}
          </p>
        </div>
        <div className="text-2xl drop-shadow-sm" style={{ color: '#ffffff' }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatusSummaryCard;

