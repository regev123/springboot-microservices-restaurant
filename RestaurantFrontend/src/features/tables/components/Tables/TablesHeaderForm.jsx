import React from 'react';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import StatusSummaryCard from '../../../../components/common/StatusSummaryCard/StatusSummaryCard';

const TablesHeaderForm = ({ totalActiveTables, tablesByStatus }) => {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Restaurant Tables</h1>
          <p className="text-sm text-slate-400">
            {totalActiveTables} active table{totalActiveTables !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusSummaryCard
          label="Available"
          count={tablesByStatus.AVAILABLE.length}
          icon="✓"
          color="emerald"
        />
        <StatusSummaryCard
          label="Occupied"
          count={tablesByStatus.OCCUPIED.length}
          icon="👥"
          color="red"
        />
        <StatusSummaryCard
          label="Reserved"
          count={tablesByStatus.RESERVED.length}
          icon="📅"
          color="amber"
        />
        <StatusSummaryCard
          label="Cleaning"
          count={tablesByStatus.CLEANING.length}
          icon="🧹"
          color="blue"
        />
      </div>
    </GlassCard>
  );
};

export default TablesHeaderForm;

