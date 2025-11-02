import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from '../../../../../components/common/Input/Input';
import FormButton from '../../../../../components/common/Button2/FormButton';
import Toggle from '../../../../../components/common/Toggle/Toggle';
import ButtonGroup from '../../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../../components/common/SectionHeader/SectionHeader';
import { addToast } from '../../../../../store/slices/uiSlice';

// Constants
const TOAST_MESSAGES = {
  DUPLICATE_INGREDIENT: 'Ingredient already exists',
};

const COMPONENT_STYLES = {
  CONTAINER: 'mt-6',
  INGREDIENT_LIST: 'space-y-3',
  LIST_TITLE: 'text-lg font-semibold text-white mb-4',
  COUNTER_BADGE: 'ml-2 px-2 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full',
  SCROLLABLE_LIST:
    'max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50 pr-2',
  INGREDIENT_ITEM:
    'flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/30 rounded-lg px-3 py-1.5 hover:from-slate-700/80 hover:to-slate-600/80 hover:border-slate-500/50 transition-all duration-200',
  INGREDIENT_NAME_CONTAINER: 'flex items-center space-x-3',
  INGREDIENT_STATUS_CONTAINER: 'flex items-center space-x-2',
  STATUS_INDICATOR: 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse',
  STATUS_LABEL: 'text-slate-300 text-xs font-light',
};

const MenuItemIngredientsManagerForm = ({ ingredients, setIngredients }) => {
  const dispatch = useDispatch();
  const [newIngredientName, setNewIngredientName] = useState('');

  // Helper functions
  const isIngredientDuplicate = (name) => {
    return ingredients.some((ingredient) => ingredient.name.toLowerCase() === name.toLowerCase());
  };

  const createNewIngredient = (name) => ({
    name: name.trim(),
    removable: true,
  });

  const showDuplicateError = () => {
    dispatch(
      addToast({
        type: 'error',
        message: TOAST_MESSAGES.DUPLICATE_INGREDIENT,
      })
    );
  };

  const clearInput = () => {
    setNewIngredientName('');
  };

  // Event handlers
  const handleAddIngredient = () => {
    const trimmedName = newIngredientName.trim();

    if (!trimmedName) return;

    if (isIngredientDuplicate(trimmedName)) {
      showDuplicateError();
      clearInput();
      return;
    }

    const newIngredient = createNewIngredient(trimmedName);
    setIngredients([...ingredients, newIngredient]);
    clearInput();
  };

  const handleToggleRemovable = (index) => {
    const updatedIngredients = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, removable: !ingredient.removable } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  // Render functions
  const renderIngredientItem = (ingredient, index) => (
    <div key={index} className="group relative">
      <div className={COMPONENT_STYLES.INGREDIENT_ITEM}>
        <div className={COMPONENT_STYLES.INGREDIENT_NAME_CONTAINER}>
          <div className={COMPONENT_STYLES.STATUS_INDICATOR}></div>
          <span className="text-white font-medium">{ingredient.name}</span>
        </div>
        <div className={COMPONENT_STYLES.INGREDIENT_STATUS_CONTAINER}>
          <span className={COMPONENT_STYLES.STATUS_LABEL}>Removable</span>
          <Toggle
            checked={ingredient.removable}
            onChange={() => handleToggleRemovable(index)}
            variant="success"
          />
          <ButtonGroup
            buttons={[
              {
                icon: 'delete',
                onClick: () => handleDeleteIngredient(index),
                title: 'Delete ingredient',
              },
            ]}
            size="small"
          />
        </div>
      </div>
    </div>
  );

  const renderIngredientsList = () => (
    <div className={COMPONENT_STYLES.INGREDIENT_LIST}>
      <h3 className={COMPONENT_STYLES.LIST_TITLE}>
        Ingredients List
        <span className={COMPONENT_STYLES.COUNTER_BADGE}>{ingredients.length}</span>
      </h3>
      <div className={COMPONENT_STYLES.SCROLLABLE_LIST}>
        <div className="grid gap-2">{ingredients.map(renderIngredientItem)}</div>
      </div>
    </div>
  );

  const renderAddIngredientForm = () => (
    <div className="flex gap-4">
      <div className="w-56 sm:w-72">
        <Input
          label="Ingredient Name"
          placeholder="Enter ingredient name..."
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          className="text-sm pt-5 pb-1.5 px-3 rounded-lg"
        />
      </div>
      <FormButton
        text="Add"
        icon="add"
        onClick={handleAddIngredient}
        type="green"
        disabled={!newIngredientName.trim()}
      />
    </div>
  );

  return (
    <GlassCard className={COMPONENT_STYLES.CONTAINER}>
      <SectionHeader title="Ingredients" description="Manage ingredients for this menu item" />
      <div className="space-y-4">
        {renderAddIngredientForm()}
        {ingredients.length > 0 && renderIngredientsList()}
      </div>
    </GlassCard>
  );
};

export default MenuItemIngredientsManagerForm;
