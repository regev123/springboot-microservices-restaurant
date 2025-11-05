import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveMenu } from '../../../store/thunks/menuThunks';
import { fetchActiveTables, fetchOrdersByTable, createOrder, changeTableStatus } from '../../../store/thunks/tableThunks';

const useTableDetailForm = (tableId) => {
  const dispatch = useDispatch();
  const { activeMenu, categories } = useSelector((state) => state.menu);
  const user = useSelector((state) => state.auth.user);
  const tables = useSelector((state) => state.tables?.tables || []);
  const loading = useSelector((state) => state.menu.menuUI?.FetchingActiveMenu || false);
  const orderLoading = useSelector((state) => state.tables?.tablesUI?.FetchingOrdersByTable || false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedOrderCategoryId, setSelectedOrderCategoryId] = useState(null);
  const [orderItems, setOrderItems] = useState([]); // Array of { menuItemId, menuItemName, quantity, price }
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for elapsed time calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeMenu) {
      dispatch(fetchActiveMenu());
    }
  }, [dispatch, activeMenu]);

  // Fetch tables if not loaded, then fetch orders
  useEffect(() => {
    const id = parseInt(tableId);
    
    if (tables.length === 0) {
      // Fetch tables first, then fetch orders
      dispatch(fetchActiveTables())
        .then((result) => {
          if (fetchActiveTables.fulfilled.match(result)) {
            dispatch(fetchOrdersByTable(id));
          }
        });
    } else {
      // Tables exist, just fetch orders
      dispatch(fetchOrdersByTable(id));
    }
  }, [dispatch, tableId, tables.length]);

  // Group menu items by category
  const menuItemsByCategory = useMemo(() => {
    if (!activeMenu?.menuItems || activeMenu.menuItems.length === 0) {
      return [];
    }

    const grouped = {};
    activeMenu.menuItems.forEach((item) => {
      const categoryName = item.category?.name || 'Uncategorized';
      const categoryId = item.category?.id || 'uncategorized';
      
      // Try to get sortOrder from item.category first, then look it up from categories list
      let sortOrder = item.category?.sortOrder;
      if (sortOrder === undefined || sortOrder === null) {
        const categoryFromStore = categories.find(cat => cat.id === categoryId);
        sortOrder = categoryFromStore?.sortOrder ?? 999999; // Default to high number if not found
      }

      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          id: categoryId,
          name: categoryName,
          sortOrder: sortOrder,
          items: [],
        };
      }
      grouped[categoryId].items.push(item);
    });

    // Convert to array and sort by sortOrder (min to max), then by name as fallback
    return Object.values(grouped).sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }, [activeMenu?.menuItems, categories]);

  // Set default selected category when categories are loaded
  useEffect(() => {
    if (menuItemsByCategory.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(menuItemsByCategory[0].id);
    }
  }, [menuItemsByCategory, selectedCategoryId]);

  // Get current category items
  const currentCategory = menuItemsByCategory.find((cat) => cat.id === selectedCategoryId);

  // Get current table and its orders
  const currentTable = tables.find((t) => t.id === parseInt(tableId));
  const existingOrders = currentTable?.orders || [];
  const tableStatus = currentTable?.status;

  // Handler for changing table status
  const handleChangeTableStatus = (newStatus) => {
    dispatch(changeTableStatus({ tableId: parseInt(tableId), status: newStatus }));
  };

  // Helper function to create unique key for order item
  const getOrderItemKey = (menuItemId, removedIngredients) => {
    const sortedRemoved = [...(removedIngredients || [])].sort().join(',');
    return `${menuItemId}_${sortedRemoved}`;
  };

  // Helper function to merge order items with the same key
  const mergeOrderItems = (orderItems) => {
    const mergedMap = new Map();
    
    orderItems.forEach(item => {
      const key = getOrderItemKey(item.menuItemId, item.removedIngredients);
      const existing = mergedMap.get(key);
      
      if (existing) {
        // Merge: combine quantities
        mergedMap.set(key, {
          ...existing,
          quantity: existing.quantity + item.quantity,
        });
      } else {
        // Add new item
        mergedMap.set(key, { ...item });
      }
    });
    
    return Array.from(mergedMap.values());
  };

  // Add item to order
  const handleAddToOrder = (item) => {
    if (!item.isAvailable) return;
    
    setOrderItems((prevItems) => {
      // Extract removable ingredients
      const ingredients = Array.isArray(item.ingredients) 
        ? item.ingredients 
        : Array.from(item.ingredients || []);
      const removableIngredients = ingredients
        .filter(ing => ing.removable === true)
        .map(ing => ing.name);
      
      // Add new item to order
      const newItems = [
        ...prevItems,
        {
          menuItemId: item.id,
          menuItemName: item.name,
          quantity: 1,
          price: parseFloat(item.price),
          removableIngredients: removableIngredients,
          removedIngredients: [],
          specialInstructions: '',
        },
      ];
      
      // Merge items with the same key
      return mergeOrderItems(newItems);
    });
  };

  // Update item quantity
  const handleUpdateQuantity = (menuItemId, removedIngredients, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(menuItemId, removedIngredients);
      return;
    }
    
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        const itemKey = getOrderItemKey(item.menuItemId, item.removedIngredients);
        const targetKey = getOrderItemKey(menuItemId, removedIngredients);
        return itemKey === targetKey ? { ...item, quantity: newQuantity } : item;
      })
    );
  };

  // Remove item from order
  const handleRemoveItem = (menuItemId, removedIngredients) => {
    setOrderItems((prevItems) => {
      const targetKey = getOrderItemKey(menuItemId, removedIngredients);
      return prevItems.filter((item) => {
        const itemKey = getOrderItemKey(item.menuItemId, item.removedIngredients);
        return itemKey !== targetKey;
      });
    });
  };

  // Remove ingredient from order item - creates new order item if quantity > 1
  const handleRemoveIngredient = (menuItemId, ingredientName, currentRemovedIngredients, quantity) => {
    setOrderItems((prevItems) => {
      const newRemovedIngredients = [...(currentRemovedIngredients || []), ingredientName].sort();
      const specialInstructions = newRemovedIngredients.map(ing => `without ${ing}`).join(', ');
      
      // Get the original menu item to extract removable ingredients
      const originalMenuItem = activeMenu?.menuItems?.find(item => item.id === menuItemId);
      const ingredients = Array.isArray(originalMenuItem?.ingredients) 
        ? originalMenuItem.ingredients 
        : Array.from(originalMenuItem?.ingredients || []);
      const removableIngredients = ingredients
        .filter(ing => ing.removable === true)
        .map(ing => ing.name);
      
      if (quantity > 1) {
        // Reduce quantity by 1 and create a new item with ingredient removed
        const updatedItems = prevItems.map((item) => {
          const itemKey = getOrderItemKey(item.menuItemId, item.removedIngredients);
          const currentKey = getOrderItemKey(menuItemId, currentRemovedIngredients);
          if (itemKey === currentKey) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
        
        // Add new item with ingredient removed
        const newItems = [
          ...updatedItems,
          {
            menuItemId: menuItemId,
            menuItemName: originalMenuItem?.name || '',
            quantity: 1,
            price: parseFloat(originalMenuItem?.price || 0),
            removableIngredients: removableIngredients,
            removedIngredients: newRemovedIngredients,
            specialInstructions: specialInstructions,
          },
        ];
        
        // Merge items with the same key
        return mergeOrderItems(newItems);
      } else {
        // Quantity is 1, just modify the existing item
        const updatedItems = prevItems.map((item) => {
          const itemKey = getOrderItemKey(item.menuItemId, item.removedIngredients);
          const currentKey = getOrderItemKey(menuItemId, currentRemovedIngredients);
          if (itemKey === currentKey) {
            return {
              ...item,
              removedIngredients: newRemovedIngredients,
              specialInstructions: specialInstructions,
            };
          }
          return item;
        });
        
        // Merge items with the same key (in case modification created a duplicate)
        return mergeOrderItems(updatedItems);
      }
    });
  };

  // Add ingredient back to order item - merges with existing item if it exists
  const handleAddIngredient = (menuItemId, ingredientName, currentRemovedIngredients, quantity) => {
    setOrderItems((prevItems) => {
      const newRemovedIngredients = (currentRemovedIngredients || [])
        .filter(ing => ing !== ingredientName)
        .sort();
      const specialInstructions = newRemovedIngredients.length > 0
        ? newRemovedIngredients.map(ing => `without ${ing}`).join(', ')
        : '';
      
      // Get the original menu item
      const originalMenuItem = activeMenu?.menuItems?.find(item => item.id === menuItemId);
      const ingredients = Array.isArray(originalMenuItem?.ingredients) 
        ? originalMenuItem.ingredients 
        : Array.from(originalMenuItem?.ingredients || []);
      const removableIngredients = ingredients
        .filter(ing => ing.removable === true)
        .map(ing => ing.name);
      
      if (quantity > 1) {
        // Reduce quantity by 1 and create a new item without this removal
        const updatedItems = prevItems.map((item) => {
          const itemKey = getOrderItemKey(item.menuItemId, item.removedIngredients);
          const currentKey = getOrderItemKey(menuItemId, currentRemovedIngredients);
          if (itemKey === currentKey) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
        
        // Add new item without this removal
        const newItems = [
          ...updatedItems,
          {
            menuItemId: menuItemId,
            menuItemName: originalMenuItem?.name || '',
            quantity: 1,
            price: parseFloat(originalMenuItem?.price || 0),
            removableIngredients: removableIngredients,
            removedIngredients: newRemovedIngredients,
            specialInstructions: specialInstructions,
          },
        ];
        
        // Merge items with the same key
        return mergeOrderItems(newItems);
      } else {
        // Quantity is 1, modify the existing item or merge with existing
        const updatedItems = prevItems
          .map((item) => {
            const itemKey = getOrderItemKey(item.menuItemId, item.removedIngredients);
            const modifiedKey = getOrderItemKey(menuItemId, newRemovedIngredients);
            const currentKey = getOrderItemKey(menuItemId, currentRemovedIngredients);
            
            if (itemKey === currentKey) {
              // If there's an existing item with the new pattern, merge with it
              const existingItem = prevItems.find(i => {
                const iKey = getOrderItemKey(i.menuItemId, i.removedIngredients);
                return iKey === modifiedKey && iKey !== currentKey;
              });
              
              if (existingItem) {
                // Return null to remove this item (will be merged)
                return null;
              } else {
                // Modify this item
                return {
                  ...item,
                  removedIngredients: newRemovedIngredients,
                  specialInstructions: specialInstructions,
                };
              }
            } else if (itemKey === modifiedKey) {
              // Increment quantity of existing item with new pattern
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          })
          .filter(item => item !== null);
        
        // Merge items with the same key
        return mergeOrderItems(updatedItems);
      }
    });
  };

  // Group order items by category
  const orderItemsByCategory = useMemo(() => {
    if (!orderItems.length || !activeMenu?.menuItems) {
      return [];
    }

    const grouped = {};
    orderItems.forEach((orderItem) => {
      const originalMenuItem = activeMenu.menuItems.find(item => item.id === orderItem.menuItemId);
      if (!originalMenuItem) return;

      const categoryName = originalMenuItem.category?.name || 'Uncategorized';
      const categoryId = originalMenuItem.category?.id || 'uncategorized';
      
      // Try to get sortOrder from item.category first, then look it up from categories list
      let sortOrder = originalMenuItem.category?.sortOrder;
      if (sortOrder === undefined || sortOrder === null) {
        const categoryFromStore = categories.find(cat => cat.id === categoryId);
        sortOrder = categoryFromStore?.sortOrder ?? 999999; // Default to high number if not found
      }

      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          id: categoryId,
          name: categoryName,
          sortOrder: sortOrder,
          items: [],
        };
      }
      grouped[categoryId].items.push(orderItem);
    });

    // Convert to array and sort by sortOrder (min to max), then by name as fallback
    return Object.values(grouped).sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }, [orderItems, activeMenu?.menuItems, categories]);

  // Set default selected order category when categories are loaded
  useEffect(() => {
    if (orderItemsByCategory.length > 0 && selectedOrderCategoryId === null) {
      setSelectedOrderCategoryId(orderItemsByCategory[0].id);
    }
  }, [orderItemsByCategory, selectedOrderCategoryId]);

  // Get current order category items
  const currentOrderCategory = orderItemsByCategory.find((cat) => cat.id === selectedOrderCategoryId);

  // Calculate total price
  const orderTotal = useMemo(() => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [orderItems]);

  // Place order
  const handlePlaceOrder = () => {
    if (!user?.id) {
      return;
    }

    if (orderItems.length === 0) {
      return;
    }

    // Transform orderItems to match CreateOrderDtoRequest format
    const orderData = {
      tableId: parseInt(tableId),
      waitressId: user.id,
      orderItems: orderItems.map(item => ({
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions || null,
      })),
    };

    dispatch(createOrder(orderData))
      .then((result) => {
        if (createOrder.fulfilled.match(result)) {
          // Clear order items after successful order creation
          setOrderItems([]);
          setSelectedOrderCategoryId(null);
          // Refresh orders list
          dispatch(fetchOrdersByTable(parseInt(tableId)));
        }
      });
  };

  // Format date/time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate elapsed time from createdAt to now (HH:MM:SS format)
  const calculateElapsedTime = (createdAtString) => {
    if (!createdAtString) return '00:00:00';
    const createdAt = new Date(createdAtString);
    const elapsed = Math.floor((currentTime - createdAt) / 1000); // elapsed in seconds
    
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return {
    // State
    activeMenu,
    loading,
    orderLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedOrderCategoryId,
    setSelectedOrderCategoryId,
    orderItems,
    currentTime,
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
    // Table info
    tableStatus,
    handleChangeTableStatus,
  };
};

export default useTableDetailForm;

