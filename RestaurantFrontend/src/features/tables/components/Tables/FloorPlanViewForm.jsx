import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import Tooltip from '../../../../components/common/Tooltip/Tooltip';

const FloorPlanTable = ({ table, getStatusConfig, getStatusIcon }) => {
  const navigate = useNavigate();
  const config = getStatusConfig(table.status);
  
  const tooltipContent = (
    <div>
      <div className="text-xs font-semibold text-white">Table #{table.tableNumber}</div>
      <div className="text-xs text-slate-400 mt-0.5">
        {table.status} • {table.capacity} seats
        {table.location && ` • ${table.location}`}
      </div>
    </div>
  );
  
  const handleTableClick = () => {
    navigate(`/tables/${table.id}`);
  };
  
  return (
    <Tooltip content={tooltipContent} position="top">
      <div
        onClick={handleTableClick}
        className={`
          relative group cursor-pointer
          ${config.floorBg} ${config.floorBorder} ${config.floorShadow}
          border-2 rounded-full w-16 h-16
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-lg hover:z-10
          backdrop-blur-sm
        `}
      >
        {/* Table Number */}
        <div className="text-center">
          <div className="text-lg font-bold text-white leading-none">
            #{table.tableNumber}
          </div>
          <div className="text-xs text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <span>👤</span>
            <span>{table.capacity}</span>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 bg-white/90 flex items-center justify-center">
          <span className="text-xs">{getStatusIcon(table.status)}</span>
        </div>
      </div>
    </Tooltip>
  );
};

const FloorPlanViewForm = ({ tables, arrangeTablesForFloorPlan, getStatusConfig, getStatusIcon }) => {
  const { tables: tablesList, cols } = arrangeTablesForFloorPlan(tables);
  const rows = Math.ceil(tablesList.length / cols);
  
  return (
    <GlassCard className="p-6 overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Restaurant Floor Plan</h2>
        <div className="text-xs text-slate-400">
          {tables.length} table{tables.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Floor Plan Grid */}
      <div 
        className="relative mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
          gap: '24px',
          minWidth: 'fit-content',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.4) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        {/* Tables */}
        {tablesList.map((table, index) => (
          <FloorPlanTable 
            key={table.id} 
            table={table} 
            index={index}
            getStatusConfig={getStatusConfig}
            getStatusIcon={getStatusIcon}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-slate-400 font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500/30 border-2 border-emerald-500/50"></div>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500/30 border-2 border-red-500/50"></div>
            <span className="text-slate-300">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500/30 border-2 border-amber-500/50"></div>
            <span className="text-slate-300">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500/30 border-2 border-blue-500/50"></div>
            <span className="text-slate-300">Cleaning</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default FloorPlanViewForm;

