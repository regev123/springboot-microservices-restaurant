import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Custom Select component (fully controlled, accessible, and portal-safe)
 */
const Select = ({
  label,
  value,
  options = [],
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  required = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [menuPosition, setMenuPosition] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  // Normalize options to { value, label }
  const items = useMemo(
    () => options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt)),
    [options]
  );

  const selectedOption = items.find((opt) => String(opt.value) === String(value)) || null;
  const selectedLabel = selectedOption ? selectedOption.label : '';

  // Floating label logic (same as Input component)
  const hasValue = value && value !== '';
  const shouldFloatLabel = isFocused || hasValue || isOpen;
  const hasError = error && error.trim() !== '';

  // -----------------------------------------
  // Toggle & Close Dropdown
  // -----------------------------------------
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const newIsOpen = !prev;
      setIsFocused(newIsOpen);
      return newIsOpen;
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setIsFocused(false);
    setHighlighted(-1);
  };

  // -----------------------------------------
  // Handle Option Click
  // -----------------------------------------
  const handleOptionSelect = (opt) => {
    onChange?.(opt.value);
    closeDropdown();
  };

  // -----------------------------------------
  // Handle outside click safely
  // -----------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Prevent closing before option click registers
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -----------------------------------------
  // Keyboard navigation
  // -----------------------------------------
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted(selectedOption ? items.findIndex((i) => i.value === selectedOption.value) : 0);
      return;
    }

    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(items.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlighted >= 0 && items[highlighted]) handleOptionSelect(items[highlighted]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

  // -----------------------------------------
  // Compute menu position when open
  // -----------------------------------------
  useEffect(() => {
    if (isOpen && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setMenuPosition({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  // -----------------------------------------
  // Render
  // -----------------------------------------
  return (
    <div className="relative w-full" ref={rootRef} onKeyDown={handleKeyDown}>
      <div
        className={`relative transition-all duration-200 ${
          isFocused ? 'transform scale-[1.02]' : ''
        }`}
      >
        {/* Control Button */}
        <button
          type="button"
          className={`w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-white focus:outline-none transition-all duration-200 backdrop-blur-sm flex items-center justify-between ${
            shouldFloatLabel ? 'pt-6 pb-2' : 'py-3'
          } ${
            disabled
              ? 'border-slate-600/30 bg-slate-800/30 text-slate-500 cursor-not-allowed opacity-70'
              : hasError
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
                : 'border-slate-600/50 hover:border-primary-500/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/70'
          }`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span
            className={`text-left flex-1 truncate ${selectedLabel ? 'text-white' : 'text-slate-400'}`}
          >
            {selectedLabel || (shouldFloatLabel ? placeholder : '')}
          </span>
          <span
            className={`ml-2 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary-400' : 'text-slate-400'
            }`}
          >
            ▼
          </span>
        </button>

        {/* Floating Label */}
        {label && (
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              shouldFloatLabel
                ? `top-2 text-xs font-medium ${hasError ? 'text-red-400' : 'text-primary-400'}`
                : `top-1/2 -translate-y-1/2 font-medium ${hasError ? 'text-red-400' : 'text-slate-400'}`
            }`}
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="mt-2 text-sm text-red-400 flex items-start gap-2">
          <span className="text-base leading-4 mt-0.5 flex-shrink-0">⚠️</span>
          <span className="leading-5">{error}</span>
        </div>
      )}

      {/* Dropdown Menu (Portal) */}
      {isOpen &&
        createPortal(
          <div
            className="absolute bg-slate-800/95 border border-slate-600/50 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-xl max-h-60 overflow-y-auto z-50"
            role="listbox"
            ref={menuRef}
            style={menuPosition}
          >
            {items.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isHighlighted = highlighted === idx;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between text-sm ${
                    isSelected
                      ? 'bg-primary-500 text-white !text-white'
                      : isHighlighted
                        ? 'bg-slate-700/50 text-white'
                        : 'text-slate-300 hover:bg-slate-700/30 hover:text-white'
                  }`}
                  onMouseEnter={() => setHighlighted(idx)}
                  onClick={() => handleOptionSelect(opt)}
                >
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && <span className="ml-2 text-white">✓</span>}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Select;
