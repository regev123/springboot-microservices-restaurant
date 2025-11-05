import React from 'react';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import EmptyStateCard from '../../../../components/common/EmptyStateCard/EmptyStateCard';

const TableDetailExistingOrdersForm = ({
  existingOrders,
  formatPrice,
  formatDateTime,
  calculateElapsedTime,
}) => {
  // Calculate total amount of all orders
  const totalAmount = existingOrders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

  return (
    <div className="flex flex-col min-h-0" style={{ height: '1000px', overflow: 'hidden' }}>
      <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden p-0" style={{ height: '100%', overflowY: 'auto' }}>
        <div className="flex-shrink-0 p-3 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold" style={{ color: '#34d399' }}>Existing Orders</h2>
              <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded-full">
                {existingOrders.length}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-0.5">Total</div>
              <div className="text-sm font-bold" style={{ color: '#34d399' }}>
                {formatPrice(totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {existingOrders.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {existingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gradient-to-br from-slate-800/50 via-slate-700/40 to-slate-800/50 rounded-lg p-2.5 border border-slate-600/40 hover:border-slate-500/60 transition-colors relative"
              >
                {/* Cancel Button */}
                <button
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors border border-red-500/30"
                  title="Cancel order"
                  onClick={() => {
                    {/* TODO: Implement cancel order functionality */}
                    {/* TODO: Dispatch cancel order action */}
                    console.log('Cancel order:', order.id);
                  }}
                >
                  <span className="text-xs font-bold">×</span>
                </button>

                {/* Order Header */}
                <div className="flex items-center justify-between mb-2 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">#{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="mb-2 pt-2 border-t border-slate-600/30">
                    <div className="space-y-1">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs relative group">
                          <div className="flex-1 min-w-0 pr-6">
                            <span className="text-slate-300">{item.menuItemName}</span>
                            {item.quantity > 1 && (
                              <span className="text-slate-500 ml-1">× {item.quantity}</span>
                            )}
                            {item.specialInstructions && (
                              <div className="text-slate-500 italic text-xs mt-0.5 truncate">
                                {item.specialInstructions}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-slate-400 ml-2 flex-shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {/* Cancel Item Button */}
                            <button
                              className="transition-colors"
                              title="Remove item"
                              onClick={() => {
                                {/* TODO: Implement remove item from order functionality */}
                                console.log('Remove item from order:', order.id, item);
                              }}
                            >
                              <span className="text-xs font-bold" style={{ color: '#f87171' }}>×</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Timestamps */}
                <div className="pt-2 border-t border-slate-600/30 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    <span>Created: {formatDateTime(order.createdAt)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Elapsed: {calculateElapsedTime(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <EmptyStateCard
              title="No existing orders"
              description="Orders placed will appear here"
            />
        )}
      </GlassCard>
    </div>
  );
};

export default TableDetailExistingOrdersForm;

