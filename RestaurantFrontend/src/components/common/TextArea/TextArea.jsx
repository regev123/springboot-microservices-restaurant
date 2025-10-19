import React from 'react';

/**
 * Modern TextArea component with glass morphism and dark theme styling
 */
const TextArea = React.forwardRef(
  (
    {
      className,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      error = false,
      label,
      helperText,
      errorMessage,
      rows = 4,
      maxLength,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* TextArea Container */}
        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3
              bg-slate-800/50 backdrop-blur-sm
              border border-slate-600/50
              rounded-xl
              text-white placeholder-slate-400
              transition-all duration-200 ease-in-out
              
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              focus:border-blue-400/70
              focus:bg-slate-800/70
              
              hover:border-slate-500/70
              hover:bg-slate-800/60
              
              ${
                error
                  ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/50 hover:border-red-400/70'
                  : ''
              }
              
              ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-800/30 border-slate-600/30' : ''}
              
              resize-y
              ${className || ''}
            `
              .trim()
              .replace(/\s+/g, ' ')}
            {...props}
          />

          {/* Character count */}
          {maxLength && (
            <div className="absolute bottom-2 right-3 text-xs text-slate-400">
              {value?.length || 0}/{maxLength}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <div className="mt-2">
            {error && errorMessage ? (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMessage}
              </p>
            ) : helperText ? (
              <p className="text-sm text-slate-400">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
