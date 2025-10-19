import React, { useState } from 'react';
import {
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Check,
  Ban,
  Plus,
  LogOut,
  Power,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const icons = {
  edit: <Edit size={16} />,
  delete: <Trash2 size={16} />,
  view: <Eye size={16} />,
  save: <Save size={16} />,
  cancel: <X size={16} />,
  enable: <Check size={16} />,
  disable: <Ban size={16} />,
  add: <Plus size={16} />,
  logout: <LogOut size={16} />,
  power: <Power size={16} />,
  'arrow-up': <ChevronUp size={16} />,
  'arrow-down': <ChevronDown size={16} />,
};

const ButtonGroup = ({
  buttons = [],
  className = '',
  size = 'small', // 'small', 'default', 'large'
}) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'gap-1';
      case 'large':
        return 'gap-2';
      default:
        return 'gap-1.5';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const getIconColorClasses = (iconType) => {
    switch (iconType) {
      case 'delete':
        return 'text-red-400 hover:text-red-300';
      case 'power':
        return 'text-green-400 hover:text-green-300';
      case 'enable':
        return 'text-green-400 hover:text-green-300';
      case 'disable':
        return 'text-red-400 hover:text-red-300';
      case 'ban':
        return 'text-red-400 hover:text-red-300';
      case 'cancel':
        return 'text-red-400 hover:text-red-300';
      case 'save':
        return 'text-green-400 hover:text-green-300';
      case 'add':
        return 'text-green-400 hover:text-green-300';
      case 'edit':
        return 'text-blue-400 hover:text-blue-300';
      case 'view':
        return 'text-blue-400 hover:text-blue-300';
      case 'logout':
        return 'text-red-400 hover:text-red-300';
      default:
        return 'text-slate-300 hover:text-white';
    }
  };

  if (!buttons || buttons.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center ${getSizeClasses()} ${className} relative`}>
      {buttons.map((button, index) => {
        const { icon, onClick, disabled, className: buttonClassName, title } = button;
        const IconComponent = icons[icon];

        return (
          <div key={index} className="relative">
            <button
              onClick={onClick}
              disabled={disabled}
              onMouseEnter={() => setHoveredButton(index)}
              onMouseLeave={() => setHoveredButton(null)}
              className={`
                ${getButtonSize()}
                flex items-center justify-center
                rounded-lg
                bg-slate-700/50 hover:bg-slate-600/70
                ${getIconColorClasses(icon)}
                transition-all duration-200
                hover:shadow-md hover:shadow-slate-900/30
                focus:outline-none focus:ring-2 focus:ring-slate-500/50
                disabled:opacity-50 disabled:cursor-not-allowed
                ${buttonClassName || ''}
              `}
            >
              {IconComponent && (
                <span style={{ fontSize: `${getIconSize()}px` }}>{IconComponent}</span>
              )}
            </button>

            {/* Custom Tooltip */}
            {hoveredButton === index && title && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50">
                <div
                  className="
                  bg-slate-900/95 backdrop-blur-sm
                  border border-slate-700/50
                  rounded-md px-2 py-1
                  shadow-xl shadow-black/50
                  text-white text-xs font-medium
                  whitespace-nowrap
                  animate-in fade-in-0 zoom-in-95 duration-200
                "
                >
                  {title}
                  {/* Tooltip Arrow */}
                  <div
                    className="
                    absolute left-full top-1/2 transform -translate-y-1/2
                    w-0 h-0
                    border-t-4 border-b-4 border-l-4
                    border-t-transparent border-b-transparent border-l-slate-700/50
                  "
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
