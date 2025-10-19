import React, { useState, useEffect, useRef } from 'react';
import HidePasswordIcon from '../Icons/HidePasswordIcon';
import ShowPasswordIcon from '../Icons/ShowPasswordIcon';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const hasValue = value && value.length > 0;
  const shouldFloatLabel = isFocused || hasValue;
  const hasError = error && error.trim() !== '';

  const handleAnimationStart = (e) => {
    if (e.animationName === 'onAutoFillStart') {
      setIsFocused(true);
    }
  };

  useEffect(() => {
    const checkAutofill = () => {
      if (inputRef.current) {
        const isAutofilled = inputRef.current.matches(':-webkit-autofill');
        if (isAutofilled && inputRef.current.value) {
          setIsFocused(true);
          inputRef.current.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
          inputRef.current.style.color = '#ffffff';
        }
      }
    };

    checkAutofill();
    const interval = setInterval(checkAutofill, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div
        className={`relative transition-all duration-200 ${
          isFocused ? 'transform scale-[1.02]' : ''
        }`}
      >
        <input
          ref={inputRef}
          className={`w-full px-4 py-3 bg-slate-800/60 border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-200 backdrop-blur-sm autofill-detection ${
            shouldFloatLabel ? 'pt-6 pb-2' : 'py-3'
          } ${type === 'password' ? 'pr-12' : ''} ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
              : 'border-slate-600/50 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/70'
          }`}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={shouldFloatLabel ? placeholder : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onAnimationStart={handleAnimationStart}
          required={required}
          style={{
            WebkitBoxShadow: 'inset 0 0 0px 1000px rgba(30, 41, 59, 0.6)',
            WebkitTextFillColor: '#ffffff',
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            color: '#ffffff',
          }}
        />
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
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:text-primary-400"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <HidePasswordIcon size={20} /> : <ShowPasswordIcon size={20} />}
          </button>
        )}
      </div>
      {hasError && (
        <div className="mt-2 text-sm text-red-400 flex items-start gap-2">
          <span className="text-base leading-4 mt-0.5 flex-shrink-0">⚠️</span>
          <span className="leading-5">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
