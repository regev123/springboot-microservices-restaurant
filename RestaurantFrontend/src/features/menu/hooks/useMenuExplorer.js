import { useState, useEffect } from 'react';

const useMenuExplorer = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [assignedItems, setAssignedItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [info, setInfo] = useState(null);

  // === Load initial dummy data ===
  useEffect(() => {
    const mockMenus = [
      { id: 1, name: 'Breakfast Menu', status: 'ACTIVE' },
      { id: 2, name: 'Lunch Menu', status: 'DRAFT' },
      { id: 3, name: 'Check Check Check Check Check Check Menu', status: 'DRAFT' },
    ];
    setMenus(mockMenus);

    const mockCategories = ['Starters', 'Mains', 'Desserts', 'Drinks'];
    setCategories(mockCategories);

    const mockItems = [
      {
        id: 1,
        menu: 'Breakfast Menu',
        category: 'Starters',
        name: 'Pancakes',
        description: 'Fluffy pancakes with syrup',
        price: 8.99,
        isAvailable: true,
        ingredients: [
          { name: 'Flour', removable: false },
          { name: 'Syrup', removable: true },
          { name: 'Butter', removable: true },
        ],
      },
      {
        id: 2,
        menu: 'Lunch Menu',
        category: 'Mains',
        name: 'Cheeseburger',
        description: 'Juicy cheeseburger with fries',
        price: 12.5,
        isAvailable: true,
        ingredients: [
          { name: 'Bun', removable: false },
          { name: 'Cheese', removable: true },
          { name: 'Beef Patty', removable: false },
        ],
      },
      {
        id: 3,
        menu: '',
        category: 'Desserts',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake',
        price: 6.99,
        isAvailable: true,
        ingredients: [{ name: 'Chocolate', removable: false }],
      },
    ];
    setMenuItems(mockItems);
  }, []);

  // === Update assigned items when selected menu changes ===
  useEffect(() => {
    if (selectedMenu) {
      const assigned = menuItems.filter((item) => item.menu === selectedMenu);
      setAssignedItems(assigned);
    } else {
      setAssignedItems([]);
    }
  }, [selectedMenu, menuItems]);

  // === Handle menu selection ===
  const handleMenuChange = (menuName) => {
    setSelectedMenu(menuName);
    setFilterCategory(''); // Reset filter when menu changes
    setInfo(null); // Clear any previous info
  };

  // === Assign Item to Menu ===
  const handleAssignItem = (itemId) => {
    const updatedItems = menuItems.map((item) =>
      item.id === itemId ? { ...item, menu: selectedMenu } : item
    );
    setMenuItems(updatedItems);
    setAssignedItems(updatedItems.filter((item) => item.menu === selectedMenu));
    setInfo('Menu item assigned successfully!');
  };

  // === Remove Item from Menu ===
  const handleRemoveItem = (itemId) => {
    const updatedItems = menuItems.map((item) =>
      item.id === itemId ? { ...item, menu: '' } : item
    );
    setMenuItems(updatedItems);
    setAssignedItems(updatedItems.filter((item) => item.menu === selectedMenu));
    setInfo('Menu item removed successfully!');
  };

  // === Filter assigned and available items by category ===
  const filteredAssignedItems = filterCategory
    ? assignedItems.filter((item) => item.category === filterCategory)
    : assignedItems;

  const filteredAvailableItems = filterCategory
    ? menuItems.filter((item) => !item.menu && item.category === filterCategory)
    : menuItems.filter((item) => !item.menu);

  return {
    menus,
    categories,
    menuItems,
    selectedMenu,
    assignedItems,
    filterCategory,
    setFilterCategory,
    info,
    filteredAssignedItems,
    filteredAvailableItems,
    handleMenuChange,
    handleAssignItem,
    handleRemoveItem,
  };
};

export default useMenuExplorer;
