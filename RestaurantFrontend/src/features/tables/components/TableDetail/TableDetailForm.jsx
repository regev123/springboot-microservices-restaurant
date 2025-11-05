import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../../../components/layout/PageLayout/PageLayout';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import TableDetailHeaderForm from './TableDetailHeaderForm';
import TableDetailMenuForm from './TableDetailMenuForm';
import TableDetailNewOrderForm from './TableDetailNewOrderForm';
import TableDetailExistingOrdersForm from './TableDetailExistingOrdersForm';
import useTableDetailForm from '../../hooks/useTableDetailForm';

const TableDetailForm = () => {
  const { id } = useParams();
  const {
    // State
    activeMenu,
    loading,
    orderLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedOrderCategoryId,
    setSelectedOrderCategoryId,
    orderItems,
    // Computed values
    menuItemsByCategory,
    currentCategory,
    orderItemsByCategory,
    currentOrderCategory,
    orderTotal,
    existingOrders,
    // Handlers
    handleAddToOrder,
    handleUpdateQuantity,
    handleRemoveItem,
    handleRemoveIngredient,
    handleAddIngredient,
    handlePlaceOrder,
    // Utilities
    formatPrice,
    formatDateTime,
    calculateElapsedTime,
    getOrderItemKey,
    tableStatus,
    handleChangeTableStatus,
  } = useTableDetailForm(id);

  return (
    <PageLayout title="Table Details">
      {loading ? (
        <FormSpinner show={true} text="Loading active menu..." />
      ) : (
        <div className="h-full flex flex-col gap-3 overflow-hidden">
          {/* Compact Header */}
          <TableDetailHeaderForm 
            tableId={id}
            activeMenu={activeMenu}
            existingOrders={existingOrders}
            tableStatus={tableStatus}
            handleChangeTableStatus={handleChangeTableStatus}
          />

          {/* Main Content Area - Flex Layout */}
          <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0 overflow-hidden">
            {/* Left Column - Menu and New Order */}
            <div className="flex-1 lg:flex-[0.7] flex flex-col gap-3 min-h-0">
              {/* Menu Section */}
              <TableDetailMenuForm
                activeMenu={activeMenu}
                menuItemsByCategory={menuItemsByCategory}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                currentCategory={currentCategory}
                handleAddToOrder={handleAddToOrder}
                formatPrice={formatPrice}
                tableStatus={tableStatus}
              />

              {/* New Order Section */}
              <TableDetailNewOrderForm
                orderItems={orderItems}
                orderItemsByCategory={orderItemsByCategory}
                selectedOrderCategoryId={selectedOrderCategoryId}
                setSelectedOrderCategoryId={setSelectedOrderCategoryId}
                currentOrderCategory={currentOrderCategory}
                activeMenu={activeMenu}
                orderTotal={orderTotal}
                orderLoading={orderLoading}
                handleUpdateQuantity={handleUpdateQuantity}
                handleRemoveItem={handleRemoveItem}
                handleRemoveIngredient={handleRemoveIngredient}
                handleAddIngredient={handleAddIngredient}
                handlePlaceOrder={handlePlaceOrder}
                formatPrice={formatPrice}
                getOrderItemKey={getOrderItemKey}
              />
            </div>

            {/* Right Column - Existing Orders */}
            <div className="flex-1 lg:flex-[0.3] flex flex-col min-h-0">
              {/* Existing Orders Section */}
              <TableDetailExistingOrdersForm
                existingOrders={existingOrders}
                formatPrice={formatPrice}
                formatDateTime={formatDateTime}
                calculateElapsedTime={calculateElapsedTime}
              />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default TableDetailForm;

