import React from 'react';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import EmptyStateCard from '../../../../components/common/EmptyStateCard/EmptyStateCard';

const TableDetailMenuForm = ({
  activeMenu,
  menuItemsByCategory,
  selectedCategoryId,
  setSelectedCategoryId,
  currentCategory,
  handleAddToOrder,
  formatPrice,
  tableStatus,
}) => {
  // Show empty state if table is AVAILABLE
  if (tableStatus === 'AVAILABLE') {
    return (
      <div className="flex flex-col min-h-0 flex-1" style={{ height: '500px', overflow: 'hidden' }}>
        <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden p-0" style={{ height: '100%', overflowY: 'auto' }}>
          <EmptyStateCard
            icon="🪑"
            title="Table is Available"
            description="Please make this table occupied to start placing orders."
          />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 flex-1" style={{ height: '500px', overflow: 'hidden' }}>
      {activeMenu ? (
        menuItemsByCategory.length > 0 ? (
          <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden p-0" style={{ height: '100%', overflowY: 'auto' }}>
            {/* Category Tabs - Sticky Header */}
            <div className="flex-shrink-0 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <div className="flex min-w-max">
                  {menuItemsByCategory.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`
                        px-4 py-2.5 text-xs font-medium transition-all duration-200 whitespace-nowrap
                        border-b-2 relative
                        ${selectedCategoryId === category.id
                          ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                          : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{category.name}</span>
                        <span className="text-xs opacity-75 font-normal">({category.items.length})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items Grid - Scrollable */}
            {currentCategory && (
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {currentCategory.items.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        group relative overflow-hidden
                        bg-gradient-to-br from-slate-800/50 via-slate-700/40 to-slate-800/50
                        rounded-lg p-2.5 border border-slate-600/40
                        transition-all duration-200
                        hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5
                        ${item.isAvailable === false ? 'opacity-60' : 'cursor-pointer'}
                      `}
                    >
                      {/* Availability Badge */}
                      {item.isAvailable === false && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Unavailable
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="mb-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold leading-tight flex-1 line-clamp-2" style={{ color: '#34d399' }}>
                            {item.name}
                          </h3>
                          <div className="flex-shrink-0">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow-md shadow-emerald-500/20">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-slate-400 mb-2 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Ingredients */}
                      {item.ingredients && 
                       ((Array.isArray(item.ingredients) && item.ingredients.length > 0) || 
                        (item.ingredients.size !== undefined && item.ingredients.size > 0)) && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-600/30 mb-2">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(item.ingredients) 
                              ? item.ingredients 
                              : Array.from(item.ingredients || [])
                            ).map((ingredient, idx) => (
                              <span
                                key={idx}
                                className={`
                                  inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
                                  ${ingredient.removable 
                                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' 
                                    : 'bg-slate-600/30 text-slate-300 border border-slate-500/30'
                                  }
                                `}
                              >
                                {ingredient.name}
                                {ingredient.removable && (
                                  <span className="ml-1 font-bold" style={{ color: '#93c5fd' }}>(R)</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Select Button */}
                      <button
                        onClick={() => handleAddToOrder(item)}
                        disabled={item.isAvailable === false}
                        className={`
                          w-full mt-2 px-2 py-1.5 rounded-lg font-bold text-xs
                          transition-all duration-200
                          ${item.isAvailable === false
                            ? 'bg-slate-700/40 text-slate-500 cursor-not-allowed border border-slate-600/30'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-500/50 shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                          }
                        `}
                        style={item.isAvailable !== false ? { color: '#0f172a', fontWeight: 'bold' } : {}}
                      >
                        Select
                      </button>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/5 group-hover:to-blue-500/5 rounded-lg transition-all duration-200 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        ) : (
          <EmptyStateCard
            icon="🍽️"
            title="No menu items available in this menu."
            description="Please contact an administrator to add menu items."
          />
        )
      ) : (
        <EmptyStateCard
          icon="📋"
          title="No active menu found"
          description="Please contact an administrator to activate a menu."
        />
      )}
    </div>
  );
};

export default TableDetailMenuForm;

