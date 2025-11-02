import React from 'react';
import {
  Trash2,
  Lock,
  Unlock,
  Save,
  Edit,
  X,
  Check,
  Ban,
  Plus,
  Home,
  ArrowLeft,
} from 'lucide-react';

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
  home: <Home size={16} />, // Home 🏠
  'arrow-left': <ArrowLeft size={16} />, // Arrow Left ⬅️
};

const Button = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
  icon, // "delete" | "lock" | "unlock" | "save" | "edit" | "cancel" | "enable" | "disable" | "add" | "home" | "arrow-left"
  disabled = false,
  size = 'default', // 'small' | 'default' | 'large' | 'xlarge'
  fullWidth = false,
  className = '',
}) => {
  // Base button classes
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'border border-transparent rounded-xl',
    'font-medium',
    'relative overflow-hidden',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
    'active:transform active:translate-y-0',
    fullWidth ? 'w-full' : '',
  ];

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-2 text-sm h-9',
    default: 'px-6 py-3 text-sm h-12',
    large: 'px-8 py-4 text-base h-14',
    xlarge: 'px-8 py-4 text-base h-12',
    // New size matching Sidebar logout button
    'sidebar-style': 'px-4 py-3 text-sm h-12 min-h-[48px]',
  };

  // Variant classes with white text
  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-blue-600 to-blue-700',
      'border-blue-500/30',
      'text-white',
      'shadow-lg shadow-blue-500/20',
      'hover:from-blue-500 hover:to-blue-600',
      'hover:shadow-xl hover:shadow-blue-500/30',
      'focus:ring-blue-500',
    ],
    secondary: [
      'bg-slate-800/60',
      'border-slate-600/50',
      'text-white',
      'shadow-lg shadow-black/20',
      'hover:bg-slate-700/70',
      'hover:border-slate-500/60',
      'hover:shadow-xl hover:shadow-black/30',
      'focus:ring-slate-500',
    ],
    success: [
      'bg-gradient-to-r from-emerald-600 to-emerald-700',
      'border-emerald-500/30',
      'text-white',
      'shadow-lg shadow-emerald-500/20',
      'hover:from-emerald-500 hover:to-emerald-600',
      'hover:shadow-xl hover:shadow-emerald-500/30',
      'focus:ring-emerald-500',
    ],
    danger: [
      'bg-gradient-to-r from-red-600 to-red-700',
      'border-red-500/30',
      'text-white',
      'shadow-lg shadow-red-500/20',
      'hover:from-red-500 hover:to-red-600',
      'hover:shadow-xl hover:shadow-red-500/30',
      'focus:ring-red-500',
    ],
    // Sidebar-style variants for forms
    'modern-cancel': [
      'bg-slate-700/40',
      'border border-slate-600/50',
      'text-slate-300',
      'rounded-lg',
      'shadow-sm shadow-black/10',
      'hover:bg-slate-600/50',
      'hover:border-slate-500/60',
      'hover:text-white',
      'hover:-translate-y-0.5',
      'hover:shadow-md hover:shadow-black/20',
      'transition-all duration-200 ease-in-out',
      'focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400',
    ],
    'modern-save': [
      'bg-gradient-to-r from-green-500 to-green-600',
      'border border-green-500/50',
      'text-white',
      'rounded-lg',
      'shadow-lg shadow-green-500/25',
      'hover:from-green-600 hover:to-green-700',
      'hover:border-green-400/60',
      'hover:-translate-y-0.5',
      'hover:shadow-xl hover:shadow-green-500/35',
      'transition-all duration-200 ease-in-out',
      'focus:ring-2 focus:ring-green-400/50 focus:border-green-400',
    ],
    'modern-primary': [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'border-blue-500/50',
      'text-white',
      'shadow-lg shadow-blue-500/25',
      'hover:from-blue-600 hover:to-blue-700',
      'hover:border-blue-400/50',
      'hover:shadow-xl hover:shadow-blue-500/35',
      'focus:ring-blue-500',
    ],
    glass: [
      'bg-slate-800/40',
      'border-slate-700/50',
      'text-white',
      'backdrop-blur-xl',
      'shadow-lg shadow-black/20',
      'hover:bg-slate-700/50',
      'hover:border-slate-600/60',
      'hover:shadow-xl hover:shadow-black/30',
      'focus:ring-slate-500',
    ],
  };

  // Shimmer effect classes
  const shimmerClasses = [
    'before:absolute before:inset-0 before:-translate-x-full',
    'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
    'before:transition-transform before:duration-500',
    'hover:before:translate-x-full',
    'disabled:before:hidden',
  ];

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    ...shimmerClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Inline styles as fallback for height
  const inlineStyles = size === 'xlarge' ? { height: '42px', minHeight: '42px' } : {};

  return (
    <button
      className={buttonClasses}
      style={inlineStyles}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {icon && <span className="flex items-center">{icons[icon]}</span>}
      {text}
    </button>
  );
};

export default Button;
