import { useState, useEffect } from 'react';

const useCreateMenuItemForm = () => {
  // === Form State ===
  const [menu, setMenu] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  // === Data State ===
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');

  // Form-based Editing State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // Dummy data (replace with API calls later)
  const menus = ['Breakfast Menu', 'Lunch Menu', 'Dinner Menu'];
  const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

  // Load initial menu items
  useEffect(() => {
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
    ];
    setMenuItems(mockItems);
  }, []);

  // === Create or Update menu item ===
  const handleCreate = () => {
    setError(null);

    if (!menu.trim() || !category.trim() || !name.trim() || !price.trim()) {
      setError('Menu, category, name, and price are required.');
      return;
    }

    if (isEditMode) {
      // Update existing item
      const updatedItems = menuItems.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              menu,
              category,
              name,
              description,
              price: parseFloat(price),
              isAvailable,
              ingredients: ingredients,
            }
          : item
      );
      setMenuItems(updatedItems);
      setInfo(`Menu item "${name}" updated successfully!`);
    } else {
      // Create new item
      const newMenuItem = {
        id: Date.now(),
        menu,
        category,
        name,
        description,
        price: parseFloat(price),
        isAvailable,
        ingredients: ingredients,
      };

      setMenuItems([...menuItems, newMenuItem]);
      setInfo(`Menu item "${name}" created successfully!`);
    }

    // Reset form and exit edit mode
    resetForm();
  };

  // === Reset form ===
  const resetForm = () => {
    setMenu('');
    setCategory('');
    setName('');
    setDescription('');
    setPrice('');
    setIsAvailable(true);
    setIngredients([]);
    setNewIngredient('');
    setIsEditMode(false);
    setEditingItemId(null);
  };

  // === Delete menu item ===
  const handleDelete = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    setInfo('Menu item deleted successfully!');
  };

  // === Toggle availability ===
  const handleToggleAvailability = (id) => {
    const updatedItems = menuItems.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenuItems(updatedItems);
    setInfo('Menu item availability updated!');
  };

  // === Start Editing (Form-based) ===
  const handleEdit = (row) => {
    setIsEditMode(true);
    setEditingItemId(row.id);

    // Populate form with existing data
    setMenu(row.menu || '');
    setCategory(row.category);
    setName(row.name);
    setDescription(row.description || '');
    setPrice(row.price.toString());
    setIsAvailable(row.isAvailable);
    setIngredients(row.ingredients || []);
    setNewIngredient('');
  };

  // === Cancel Editing ===
  const handleCancelEdit = () => {
    resetForm();
  };

  // === Add ingredient ===
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      const ingredient = {
        id: Date.now(),
        name: newIngredient.trim(),
        removable: false,
      };
      setIngredients([...ingredients, ingredient]);
      setNewIngredient('');
    }
  };

  // === Remove ingredient ===
  const handleRemoveIngredient = (ingredientId) => {
    setIngredients(ingredients.filter((ing) => ing.id !== ingredientId));
  };

  // === Toggle ingredient removable state ===
  const handleToggleIngredientRemovable = (ingredientId) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === ingredientId ? { ...ing, removable: !ing.removable } : ing
      )
    );
  };

  // === Filter menu items by selected category ===
  const filteredItems = filterCategory
    ? menuItems.filter((item) => item.category === filterCategory)
    : menuItems;

  return {
    // Form state
    menu,
    setMenu,
    category,
    setCategory,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    isAvailable,
    setIsAvailable,
    ingredients,
    setIngredients,
    newIngredient,
    setNewIngredient,

    // Data state
    info,
    error,
    menuItems,
    filterCategory,
    setFilterCategory,
    filteredItems,

    // Editing state
    isEditMode,
    editingItemId,

    // Constants
    menus,
    categories,

    // Actions
    handleCreate,
    handleDelete,
    handleToggleAvailability,
    handleEdit,
    handleCancelEdit,
    resetForm,
    handleAddIngredient,
    handleRemoveIngredient,
    handleToggleIngredientRemovable,
  };
};

export default useCreateMenuItemForm;
