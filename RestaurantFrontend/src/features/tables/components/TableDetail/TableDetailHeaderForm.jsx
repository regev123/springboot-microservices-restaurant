import React from 'react';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import ButtonForm from '../../../../components/common/Button2/FormButton';

const TableDetailHeaderForm = ({ tableId, activeMenu, existingOrders, tableStatus, handleChangeTableStatus }) => {
  const renderStatusButton = () => {
    if (tableStatus === 'AVAILABLE') {
      return (
        <ButtonForm
          type="green"
          text="Make Occupied"
          onClick={() => handleChangeTableStatus('OCCUPIED')}
          className="w-auto"
        />
      );
    } else if (tableStatus === 'CLEANING') {
      return (
        <ButtonForm
          type="green"
          text="Finish Cleaning"
          onClick={() => handleChangeTableStatus('AVAILABLE')}
          className="w-auto"
        />
      );
    } else if (tableStatus === 'OCCUPIED') {
      // If no orders, allow changing to CLEANING
      if (existingOrders.length === 0) {
        return (
          <ButtonForm
            type="green"
            text="Change to Cleaning"
            onClick={() => handleChangeTableStatus('CLEANING')}
            className="w-auto"
          />
        );
      }
      // If there are orders, show Pay & Close Table button
      return (
        <ButtonForm
          type="green"
          text="Pay & Close Table"
          onClick={() => {
            {/* TODO: Implement payment/close table functionality */}
            {/* TODO: Show payment modal or navigate to payment page */}
            {/* TODO: Calculate total bill from all existing orders */}
            {/* TODO: Update table status to closed/paid */}
            console.log('Payment/Close Table for table:', tableId);
          }}
          className="w-auto"
        />
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-2.5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ color: '#34d399' }}>Table #{tableId}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Browse menu and place orders</p>
        </div>
        <div className="flex items-center gap-3">
          {activeMenu && (
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-0.5">Active Menu</div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>📋</span>
                {activeMenu.name}
              </div>
            </div>
          )}
          {renderStatusButton()}
        </div>
      </div>
    </GlassCard>
  );
};

export default TableDetailHeaderForm;

