import React from 'react';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import EmptyStateCard from '../../../../components/common/EmptyStateCard/EmptyStateCard';

const TableDetailNewOrderForm = ({
  orderItems,
  orderItemsByCategory,
  selectedOrderCategoryId,
  setSelectedOrderCategoryId,
  currentOrderCategory,
  activeMenu,
  orderTotal,
  orderLoading,
  handleUpdateQuantity,
  handleRemoveItem,
  handleRemoveIngredient,
  handleAddIngredient,
  handlePlaceOrder,
  formatPrice,
  getOrderItemKey,
}) => {
  return (
    <div className="flex flex-col min-h-0" style={{ height: '500px', overflow: 'hidden' }}>
      <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden p-0" style={{ height: '100%', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex-shrink-0 p-3 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: '#34d399' }}>
              New Order
            </h2>
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-0.5">Total</div>
              <div className="text-base font-bold" style={{ color: '#34d399' }}>
                {formatPrice(orderTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {orderItemsByCategory.length > 1 && (
          <div className="flex-shrink-0 border-b border-slate-700/50 overflow-x-auto">
            <div className="flex min-w-max">
              {orderItemsByCategory.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedOrderCategoryId(category.id)}
                  className={`
                    px-3 py-2 text-xs font-medium transition-all duration-200 whitespace-nowrap
                    border-b-2
                    ${selectedOrderCategoryId === category.id
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                    }
                  `}
                >
                  <div className="flex items-center gap-1">
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">
                      ({category.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order Items Grid - Scrollable */}
        {orderItems.length > 0 ? (
          currentOrderCategory && (
            <div className="flex-1 overflow-y-auto p-2.5">
              <div className="grid grid-cols-3 gap-2">
                {currentOrderCategory.items.map((orderItem) => {
                  const originalMenuItem = activeMenu?.menuItems?.find(item => item.id === orderItem.menuItemId);
                  const availableRemovableIngredients = orderItem.removableIngredients || [];
                  const removedIngredients = orderItem.removedIngredients || [];
                  
                  return (
                    <div
                      key={getOrderItemKey(orderItem.menuItemId, orderItem.removedIngredients)}
                      className="bg-gradient-to-br from-slate-800/50 via-slate-700/40 to-slate-800/50 rounded-lg p-2 border border-slate-600/40"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold text-white mb-0.5 truncate">
                            {orderItem.menuItemName}
                          </h3>
                          <div className="text-xs text-slate-400">
                            {formatPrice(orderItem.price)} each
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateQuantity(orderItem.menuItemId, orderItem.removedIngredients, orderItem.quantity - 1)}
                              className="w-5 h-5 rounded bg-slate-700/50 hover:bg-slate-600/50 text-white text-xs font-bold flex items-center justify-center transition-colors border border-slate-600/30"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold text-white w-5 text-center">
                              {orderItem.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(orderItem.menuItemId, orderItem.removedIngredients, orderItem.quantity + 1)}
                              className="w-5 h-5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center transition-colors border border-emerald-500/30"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-xs font-semibold text-emerald-400 w-14 text-right">
                            {formatPrice(orderItem.price * orderItem.quantity)}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(orderItem.menuItemId, orderItem.removedIngredients)}
                            className="w-5 h-5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs flex items-center justify-center transition-colors border border-red-500/30"
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Removable Ingredients */}
                      {availableRemovableIngredients.length > 0 && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-600/30">
                          <div className="text-xs text-slate-400 mb-1">Removable:</div>
                          <div className="flex flex-wrap gap-1">
                            {availableRemovableIngredients.map((ingredientName) => {
                              const isRemoved = removedIngredients.includes(ingredientName);
                              return (
                                <button
                                  key={ingredientName}
                                  onClick={() => {
                                    if (isRemoved) {
                                      handleAddIngredient(orderItem.menuItemId, ingredientName, orderItem.removedIngredients, orderItem.quantity);
                                    } else {
                                      handleRemoveIngredient(orderItem.menuItemId, ingredientName, orderItem.removedIngredients, orderItem.quantity);
                                    }
                                  }}
                                  className={`
                                    inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium transition-colors
                                    ${isRemoved
                                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 line-through'
                                      : 'bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20'
                                    }
                                  `}
                                >
                                  <span>{ingredientName}</span>
                                  <span className="text-xs">×</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <EmptyStateCard
            title="No items in order yet"
            description="Select items from the menu above"
          />
        )}

        {/* Place Order Button - Sticky Footer */}
        {orderItems.length > 0 && (
          <div className="flex-shrink-0 p-2.5 pt-2 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <button
              onClick={handlePlaceOrder}
              disabled={orderLoading}
              className={`
                w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-2 px-3 rounded-lg 
                transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 text-sm
                ${orderLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-emerald-600 hover:to-emerald-700'
                }
              `}
              style={orderLoading ? {} : { color: '#0f172a' }}
            >
              {orderLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default TableDetailNewOrderForm;

