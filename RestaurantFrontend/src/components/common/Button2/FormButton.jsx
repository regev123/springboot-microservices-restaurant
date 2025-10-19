import React from 'react';
import { Trash2, Lock, Unlock, Save, Edit, X, Check, Ban, Plus, LogOut } from 'lucide-react';

const icons = {
  delete: <Trash2 size={16} />, // Delete icon
  lock: <Lock size={16} />, // Lock
  unlock: <Unlock size={16} />, // Unlock
  save: <Save size={16} />, // Save
  edit: <Edit size={16} />, // Edit
  cancel: <X size={16} />, // Cancel ❌
  enable: <Check size={16} />, // Enable ✅
  disable: <Ban size={16} />, // Disable 🚫
  add: <Plus size={16} />, // Add ➕
  logout: <LogOut size={16} />, // Logout 🚪
};

const FormButton = ({
  type = 'red', // 'red' | 'green'
  text,
  icon,
  onClick,
  className = '',
  disabled = false,
}) => {
  // Base button classes
  const baseClasses = [
    'px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out hover:-translate-y-1 focus:outline-none flex items-center justify-center gap-2',
    'border-2',
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
  ];

  // Width classes - use className if it contains width, otherwise use default
  const widthClasses = className.includes('w-') ? '' : 'w-full sm:w-auto';

  // Button type specific classes
  const getTypeClasses = () => {
    // Base styling for both types
    const baseTypeClasses = [
      'bg-slate-800/60 hover:bg-slate-700/70',
      'text-slate-300 hover:text-white',
      'hover:shadow-lg',
      'focus:ring-2',
    ];

    // Only border color changes based on type
    switch (type) {
      case 'red':
        return [
          ...baseTypeClasses,
          'border-red-500/80 hover:border-red-400/100',
          'hover:shadow-red-500/30',
          'focus:ring-red-400/25 focus:border-red-400/100',
        ];
      case 'green':
        return [
          ...baseTypeClasses,
          'border-green-500/60 hover:border-green-400/80',
          'hover:shadow-green-500/20',
          'focus:ring-green-400/25 focus:border-green-400/80',
        ];
      default:
        return [
          ...baseTypeClasses,
          'border-slate-600/50 hover:border-slate-500/60',
          'hover:shadow-black/20',
          'focus:ring-slate-400/30 focus:border-slate-400',
        ];
    }
  };

  // Get icon based on icon prop or default based on type
  const getIcon = () => {
    // If icon prop is provided, use it (should be a string like 'cancel', 'save', 'delete', etc.)
    if (icon && icons[icon]) {
      return <span className="flex items-center">{icons[icon]}</span>;
    }
  };

  // Combine all classes
  const buttonClasses = [...baseClasses, ...getTypeClasses(), widthClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled} type="button">
      {getIcon()}
      {text}
    </button>
  );
};

export default FormButton;
